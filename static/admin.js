const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token || token === "undefined") {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* SLUG */
function generateSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* TINYMCE */
tinymce.init({
  selector: "#content",
  plugins: "image link lists media table autoresize",
  menubar: false,
  toolbar: "undo redo | bold italic | bullist numlist | image link",
  file_picker_callback: cb => {
    cloudinary.createUploadWidget(
      { cloudName: "dnfidjaa3", uploadPreset: "unsigned_blog" },
      (err, res) => res?.event === "success" && cb(res.info.secure_url)
    ).open();
  }
});

/* DOM */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection = document.getElementById("blogsSection");
const leadsSection = document.getElementById("leadsSection");
const settingsSection = document.getElementById("settingsSection");

const blogForm = document.getElementById("blogForm");
const blogList = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

const leadList = document.getElementById("leadList");
const leadCount = document.getElementById("leadCount");

/* NAV */
function hideAll() {
  dashboardSection.style.display = blogsSection.style.display =
  leadsSection.style.display = settingsSection.style.display = "none";
}

function setActive(el) {
  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  el.classList.add("active");
}

function showDashboard(el){ hideAll(); dashboardSection.style.display="block"; setActive(el); loadBlogs(); loadLeads(); }
function showBlogs(el){ hideAll(); blogsSection.style.display="block"; setActive(el); loadBlogs(); }
function showLeads(el){ hideAll(); leadsSection.style.display="block"; setActive(el); loadLeads(); }
function showSettings(el){ hideAll(); settingsSection.style.display="block"; setActive(el); }

/* BLOGS */
async function loadBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`, { headers:{Authorization:`Bearer ${token}`}});
  const blogs = (await res.json()).data || [];
  blogCount.innerText = blogs.length;

  blogList.innerHTML = blogs.map(b => `
    <div class="card mb-2">
      <div class="card-body">
        <h5>${b.title}</h5>
        <button class="btn btn-warning btn-sm me-2" onclick='editBlog(${JSON.stringify(b)})'>Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteBlog('${b._id}')">Delete</button>
      </div>
    </div>`).join("");
}

blogForm.addEventListener("submit", async e => {
  e.preventDefault();

  const blogId = blogIdInput.value;
  const payload = {
    title: title.value,
    content: tinymce.get("content").getContent(),
    excerpt: excerpt.value,
    featuredImage: featuredImage.value,
    slug: generateSlug(title.value),
    status: publish.value === "true" ? "published" : "draft"
  };

  if (!payload.title || !payload.content || !payload.excerpt || !payload.featuredImage)
    return alert("All fields required");

  const res = await fetch(blogId ? `${BASE_URL}/blogs/${blogId}` : `${BASE_URL}/blogs`, {
    method: blogId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) return alert("Validation error");
  alert("Blog Saved ✅");
  resetBlog();
  loadBlogs();
});

function editBlog(b){
  blogId.value=b._id;
  title.value=b.title;
  excerpt.value=b.excerpt;
  featuredImage.value=b.featuredImage;
  tinymce.get("content").setContent(b.content);
  publish.value=b.status==="published"?"true":"false";
}

async function deleteBlog(id){
  if(confirm("Delete blog?")){
    await fetch(`${BASE_URL}/blogs/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});
    loadBlogs();
  }
}

function resetBlog(){
  blogId.value="";
  blogForm.reset();
  tinymce.get("content").setContent("");
}

/* LEADS */
async function loadLeads(){
  const res=await fetch(`${BASE_URL}/leads`,{headers:{Authorization:`Bearer ${token}`}});
  const leads=(await res.json()).data||[];
  leadCount.innerText=leads.length;
  leadList.innerHTML=leads.map(l=>`<div class="card p-2 mb-2">${l.name} - ${l.email}</div>`).join("");
}

/* SETTINGS */
function updateLogo(){
  const f=logoInput.files[0];
  if(!f) return alert("Select logo");
  const r=new FileReader();
  r.onload=()=>{localStorage.setItem("siteLogo",r.result);alert("Logo Updated");};
  r.readAsDataURL(f);
}
function updateFooter(){
  localStorage.setItem("footerEmail",footerEmail.value);
  localStorage.setItem("footerPhone",footerPhone.value);
  localStorage.setItem("footerAddress",footerAddress.value);
  alert("Footer Updated");
}

function logout(){ localStorage.clear(); location.href="adminlogin.html"; }

showDashboard(document.querySelector(".sidebar a.active"));
