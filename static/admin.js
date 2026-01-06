/* GLOBALS */
const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token || token === "undefined") {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* TINYMCE */
tinymce.init({
  selector: "#content",
  plugins: "image link lists media table autoresize",
  menubar: false,

  toolbar: "undo redo | bold italic underline | bullist numlist | image link",

  file_picker_types: "image",

  file_picker_callback: function (cb) {
    const widget = cloudinary.createUploadWidget(
      {
        cloudName: "dnfidjaa3",
        uploadPreset: "unsigned_blog"   // 👈 USE THIS (unsigned preset)
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          cb(result.info.secure_url, { alt: result.info.original_filename });
        }
      }
    );

    widget.open();
  }
});

/* DOM refs */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection = document.getElementById("blogsSection");
const leadsSection = document.getElementById("leadsSection");

const blogForm  = document.getElementById("blogForm");
const blogList  = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

const leadList  = document.getElementById("leadList");
const leadCount = document.getElementById("leadCount");

const blogId  = document.getElementById("blogId");
const title   = document.getElementById("title");
const tags    = document.getElementById("tags");
const publish = document.getElementById("publish");

/* NAVIGATION */
function setActive(el){
  document.querySelectorAll(".sidebar a")
    .forEach(a => a.classList.remove("active"));
  el.classList.add("active");
}

function showDashboard(el){
  dashboardSection.style.display="block";
  blogsSection.style.display="none";
  leadsSection.style.display="none";
  setActive(el);
  loadBlogs();
  loadLeads();
}

function showBlogs(el){
  dashboardSection.style.display="none";
  blogsSection.style.display="block";
  leadsSection.style.display="none";
  setActive(el);
  loadBlogs();
}

function showLeads(el){
  dashboardSection.style.display="none";
  blogsSection.style.display="none";
  leadsSection.style.display="block";
  setActive(el);
  loadLeads();
}

/* LOAD BLOGS */
async function loadBlogs(){
  try {
    const res = await fetch(`${BASE_URL}/blogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const blogs = (data && data.data) || [];

    blogCount.innerText = blogs.length;

    blogList.innerHTML = blogs.length
      ? blogs.map(b => `
        <div class="card mb-2">
          <div class="card-body">
            <h5>${b.title}</h5>
            <div>${b.content}</div>

            <button class="btn btn-warning btn-sm"
              onclick='editBlog(${JSON.stringify(b)})'>
              Edit
            </button>

            <button class="btn btn-danger btn-sm"
              onclick="deleteBlog('${b._id}')">
              Delete
            </button>
          </div>
        </div>
      `).join("")
      : "<p>No blogs found</p>";

  } catch (e) {
    console.error(e);
    blogList.innerHTML = "<p class='text-danger'>Failed to load blogs</p>";
  }
}

/* SAVE BLOG */
blogForm.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    title: title.value.trim(),
    content: tinymce.get("content").getContent(),
    tags: tags.value ? tags.value.split(",").map(t => t.trim()) : [],
    isPublished: publish.value === "true"
  };

  if (!payload.title || !payload.content){
    alert("Title and content are required");
    return;
  }

  const method = blogId.value ? "PUT" : "POST";
  const url = blogId.value
      ? `${BASE_URL}/blogs/${blogId.value}`
      : `${BASE_URL}/blogs`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok || data.success === false){
    alert(data.message || "Blog NOT saved");
    return;
  }

  alert("Blog saved successfully 👍");
  resetBlog();
  loadBlogs();
});

/* EDIT BLOG */
function editBlog(b){
  showBlogs(document.querySelectorAll(".sidebar a")[1]);

  blogId.value = b._id || "";
  title.value = b.title || "";
  tinymce.get("content").setContent(b.content || "");
  tags.value = Array.isArray(b.tags) ? b.tags.join(",") : "";
  publish.value = b.isPublished ? "true" : "false";
}

/* DELETE */
async function deleteBlog(id){
  if (!confirm("Delete blog?")) return;

  await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  alert("Blog deleted 👍");
  loadBlogs();
}

/* RESET */
function resetBlog(){
  blogId.value = "";
  blogForm.reset();
  tinymce.get("content").setContent("");
}

/* LEADS */
async function loadLeads(){
  const res = await fetch(`${BASE_URL}/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const leads = data.leads || data.data || [];

  leadCount.innerText = leads.length;

  leadList.innerHTML = leads.map(l => `
    <div class="card mb-2">
      <div class="card-body">
        <b>${l.name}</b> (${l.email})<br>
        ${l.message || ""}
      </div>
    </div>
  `).join("");
}

/* LOGOUT */
function logout(){
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* MAKE FUNCTIONS PUBLIC */
window.showDashboard = showDashboard;
window.showBlogs     = showBlogs;
window.showLeads     = showLeads;
window.logout        = logout;
window.resetBlog     = resetBlog;
window.editBlog      = editBlog;
window.deleteBlog    = deleteBlog;

/* INITIAL LOAD */
loadBlogs();
loadLeads();
