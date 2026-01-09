const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  location.href = "adminlogin.html";
}

/* SLUG */
function generateSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

/* TINYMCE */
tinymce.init({
  selector: "#content",
  height: 350,
  plugins: "image link lists",
  menubar: false,
  toolbar: "undo redo | bold italic | bullist numlist | image link",
  file_picker_types: "image",
  file_picker_callback: function (cb) {
    const widget = cloudinary.createUploadWidget(
      {
        cloudName: "dnfidjaa3",
        uploadPreset: "unsigned_blog"
      },
      (error, result) => {
        if (!error && result.event === "success") {
          cb(result.info.secure_url);
        }
      }
    );
    widget.open();
  }
});

/* SECTIONS */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection = document.getElementById("blogsSection");
const leadsSection = document.getElementById("leadsSection");

const blogForm = document.getElementById("blogForm");
const blogList = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

/* NAV */
function hideAll() {
  dashboardSection.style.display = "none";
  blogsSection.style.display = "none";
  leadsSection.style.display = "none";
}

function setActive(el) {
  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  el.classList.add("active");
}

function showDashboard(el) {
  hideAll();
  dashboardSection.style.display = "block";
  setActive(el);
  loadBlogs();
}

function showBlogs(el) {
  hideAll();
  blogsSection.style.display = "block";
  setActive(el);
  loadBlogs();
}

function showLeads(el) {
  hideAll();
  leadsSection.style.display = "block";
  setActive(el);
  loadLeads();
}

/* BLOGS */
async function loadBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const blogs = data.data || [];

  blogCount.innerText = blogs.length;

  blogList.innerHTML = blogs.map(b => `
    <div class="card mb-2">
      <div class="card-body">
        <h5>${b.title}</h5>
        <button class="btn btn-sm btn-warning me-2"
          onclick='editBlog(${JSON.stringify(b)})'>Edit</button>
        <button class="btn btn-sm btn-danger"
          onclick="deleteBlog('${b._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

/* SAVE / UPDATE */
blogForm.addEventListener("submit", async e => {
  e.preventDefault();

  const blogId = blogForm.blogId.value;
  const title = titleInput.value || document.getElementById("title").value;
  const content = tinymce.get("content").getContent();
  const tags = document.getElementById("tags").value.split(",");
  const publish = document.getElementById("publish").value === "true";

  if (!title || !content) {
    alert("Title & Content required");
    return;
  }

  const payload = {
    title,
    content,
    tags,
    slug: generateSlug(title),
    status: publish ? "published" : "draft",
    author: "Admin"
  };

  const url = blogId ? `${BASE_URL}/blogs/${blogId}` : `${BASE_URL}/blogs`;
  const method = blogId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("Validation error");
    return;
  }

  alert("Blog Saved ✅");
  resetBlog();
  loadBlogs();
});

/* EDIT */
function editBlog(blog) {
  blogForm.blogId.value = blog._id;
  document.getElementById("title").value = blog.title;
  tinymce.get("content").setContent(blog.content);
  document.getElementById("tags").value = blog.tags?.join(",") || "";
  document.getElementById("publish").value =
    blog.status === "published" ? "true" : "false";
}

/* DELETE */
async function deleteBlog(id) {
  if (!confirm("Delete blog?")) return;
  await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  loadBlogs();
}

/* RESET */
function resetBlog() {
  blogForm.reset();
  blogForm.blogId.value = "";
  tinymce.get("content").setContent("");
}

/* LEADS */
async function loadLeads() {
  const res = await fetch(`${BASE_URL}/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  leadsSection.innerHTML = JSON.stringify(data.data || []);
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* DEFAULT */
showDashboard(document.querySelector(".sidebar a.active"));
