const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  location.href = "adminlogin.html";
}

/* ---------- TinyMCE ---------- */
tinymce.init({
  selector: "#content",
  height: 350,
  plugins: "image link lists",
  toolbar: "undo redo | bold italic | bullist numlist | image link",
  menubar: false,

  file_picker_callback: function (cb) {
    const widget = cloudinary.createUploadWidget(
      { cloudName: "dnfidjaa3", uploadPreset: "unsigned_blog" },
      (err, res) => {
        if (!err && res.event === "success") {
          cb(res.info.secure_url);
        }
      }
    );
    widget.open();
  }
});

/* ---------- Helpers ---------- */
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hideAll() {
  dashboardSection.style.display = "none";
  blogsSection.style.display = "none";
  leadsSection.style.display = "none";
  settingsSection.style.display = "none";
}

/* ---------- Navigation ---------- */
function showDashboard(el) {
  hideAll();
  dashboardSection.style.display = "block";
  loadBlogs();
  loadLeads();
}

function showBlogs(el) {
  hideAll();
  blogsSection.style.display = "block";
  loadBlogs();
}

function showLeads(el) {
  hideAll();
  leadsSection.style.display = "block";
  loadLeads();
}

function showSettings(el) {
  hideAll();
  settingsSection.style.display = "block";
}

/* ---------- BLOGS ---------- */
const blogForm = document.getElementById("blogForm");
const blogList = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

async function loadBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  const blogs = json.data || [];

  blogCount.innerText = blogs.length;

  blogList.innerHTML = blogs.map(b => `
    <div class="card mb-2">
      <div class="card-body">
        <h5>${b.title}</h5>
        <button class="btn btn-sm btn-danger" onclick="deleteBlog('${b._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

blogForm.addEventListener("submit", async e => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = tinymce.get("content").getContent();
  const tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
  const status = publish.value;

  if (!title || !content) {
    alert("Title & content required");
    return;
  }

  const payload = {
    title,
    content,
    tags,
    slug: slugify(title),
    status
  };

  const res = await fetch(`${BASE_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    alert("Validation error (backend)");
    return;
  }

  alert("Blog saved ✅");
  resetBlog();
  loadBlogs();
});

async function deleteBlog(id) {
  if (!confirm("Delete blog?")) return;
  await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  loadBlogs();
}

function resetBlog() {
  blogForm.reset();
  tinymce.get("content").setContent("");
}

/* ---------- LEADS ---------- */
async function loadLeads() {
  const res = await fetch(`${BASE_URL}/leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  leadList.innerHTML = (json.data || []).map(l =>
    `<div class="card mb-2"><div class="card-body">${l.email}</div></div>`
  ).join("");
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* ---------- DOM ---------- */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection = document.getElementById("blogsSection");
const leadsSection = document.getElementById("leadsSection");
const settingsSection = document.getElementById("settingsSection");

const titleInput = document.getElementById("title");
const tagsInput = document.getElementById("tags");
const publish = document.getElementById("publish");
const leadList = document.getElementById("leadList");

/* ---------- Init ---------- */
showDashboard();

