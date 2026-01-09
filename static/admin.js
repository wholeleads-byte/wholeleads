/* ================= GLOBAL ================= */
const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token || token === "undefined") {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* ================= TINYMCE ================= */
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
        uploadPreset: "unsigned_blog"
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          cb(result.info.secure_url, {
            alt: result.info.original_filename
          });
        }
      }
    );
    widget.open();
  }
});

/* ================= DOM ================= */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection = document.getElementById("blogsSection");
const leadsSection = document.getElementById("leadsSection");
const settingsSection = document.getElementById("settingsSection");

const blogForm = document.getElementById("blogForm");
const blogList = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

const leadList = document.getElementById("leadList");
const leadCount = document.getElementById("leadCount");

/* ================= HELPERS ================= */
function hideAll() {
  dashboardSection.style.display = "none";
  blogsSection.style.display = "none";
  leadsSection.style.display = "none";
  settingsSection.style.display = "none";
}

function setActive(el) {
  document.querySelectorAll(".sidebar a").forEach(a =>
    a.classList.remove("active")
  );
  el.classList.add("active");
}

/* ================= NAVIGATION ================= */
function showDashboard(el) {
  hideAll();
  dashboardSection.style.display = "block";
  setActive(el);
  loadBlogs();
  loadLeads();
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

function showSettings(el) {
  hideAll();
  settingsSection.style.display = "block";
  setActive(el);
}

/* ================= BLOG CRUD ================= */

// LOAD BLOGS
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

// SAVE / UPDATE BLOG
blogForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const blogId = document.getElementById("blogId").value;
  const title = document.getElementById("title").value;
  const content = tinymce.get("content").getContent();
  const tags = document.getElementById("tags").value.split(",");
  const publish = document.getElementById("publish").value === "true";

  if (!title || !content) {
    alert("Title & Content required");
    return;
  }

  const payload = { title, content, tags, publish };

  const url = blogId
    ? `${BASE_URL}/blogs/${blogId}`
    : `${BASE_URL}/blogs`;

  const method = blogId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Error saving blog");
    return;
  }

  alert(blogId ? "Blog Updated ✅" : "Blog Saved ✅");
  resetBlog();
  loadBlogs();
});

// EDIT BLOG
function editBlog(blog) {
  document.getElementById("blogId").value = blog._id;
  document.getElementById("title").value = blog.title;
  tinymce.get("content").setContent(blog.content);
  document.getElementById("tags").value = blog.tags.join(",");
  document.getElementById("publish").value = blog.publish.toString();
}

// DELETE BLOG
async function deleteBlog(id) {
  if (!confirm("Delete blog?")) return;

  await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadBlogs();
}

// RESET FORM
function resetBlog() {
  document.getElementById("blogId").value = "";
  blogForm.reset();
  tinymce.get("content").setContent("");
}

/* ================= LEADS ================= */
async function loadLeads() {
  const res = await fetch(`${BASE_URL}/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const leads = data.data || [];

  leadCount.innerText = leads.length;

  leadList.innerHTML = leads.map(l => `
    <div class="card mb-2">
      <div class="card-body">
        <b>${l.name}</b> - ${l.email}
      </div>
    </div>
  `).join("");
}

/* ================= SETTINGS ================= */
function updateLogo() {
  const file = document.getElementById("logoInput").files[0];
  if (!file) return alert("Select logo first");

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("siteLogo", reader.result);
    alert("Logo Updated");
  };
  reader.readAsDataURL(file);
}

function updateFooter() {
  localStorage.setItem("footerEmail", document.getElementById("footerEmail").value);
  localStorage.setItem("footerPhone", document.getElementById("footerPhone").value);
  localStorage.setItem("footerAddress", document.getElementById("footerAddress").value);
  alert("Footer Updated");
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* ================= EXPOSE ================= */
window.showDashboard = showDashboard;
window.showBlogs = showBlogs;
window.showLeads = showLeads;
window.showSettings = showSettings;
window.logout = logout;
window.updateLogo = updateLogo;
window.updateFooter = updateFooter;

/* ================= DEFAULT LOAD ================= */
showDashboard(document.querySelector(".sidebar a.active"));

