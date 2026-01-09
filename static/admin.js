const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) location.href = "adminlogin.html";

/* ---------- TINYMCE ---------- */
tinymce.init({
  selector: "#content",
  height: 350,
  plugins: "image link lists",
  toolbar:
    "undo redo | formatselect | bold italic underline | " +
    "alignleft aligncenter alignright | " +
    "bullist numlist | image link",
  menubar: false,

  file_picker_callback: function(cb) {
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

/* ---------- DOM ---------- */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection = document.getElementById("blogsSection");
const leadsSection = document.getElementById("leadsSection");
const settingsSection = document.getElementById("settingsSection");

const blogForm = document.getElementById("blogForm");
const blogList = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

const titleInput = document.getElementById("title");
const tagsInput = document.getElementById("tags");
const leadList = document.getElementById("leadList");

/* ---------- Helpers ---------- */
function hideAll() {
  dashboardSection.style.display = "none";
  blogsSection.style.display = "none";
  leadsSection.style.display = "none";
  settingsSection.style.display = "none";
}

/* ---------- Navigation ---------- */
function showDashboard() {
  hideAll();
  dashboardSection.style.display = "block";
  loadBlogs();
  loadLeads();
}

function showBlogs() {
  hideAll();
  blogsSection.style.display = "block";
  loadBlogs();
}

function showLeads() {
  hideAll();
  leadsSection.style.display = "block";
  loadLeads();
}

function showSettings() {
  hideAll();
  settingsSection.style.display = "block";
  loadSettings();
}

/* ---------- BLOGS ---------- */
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

        <button class="btn btn-sm btn-warning me-2"
          onclick="editBlog('${b._id}')">Edit</button>

        <button class="btn btn-sm btn-danger"
          onclick="deleteBlog('${b._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

blogForm.addEventListener("submit", async e => {
  e.preventDefault();

  const blogId = document.getElementById("blogId").value;
  const title = titleInput.value.trim();
  const content = tinymce.get("content").getContent();
  const tags = tagsInput.value.split(",").map(t => t.trim());

  if (!title || !content) {
    alert("Title & content required");
    return;
  }

  const payload = { title, content, tags };

  const url = blogId
    ? `${BASE_URL}/blogs/${blogId}`
    : `${BASE_URL}/blogs`;

  const method = blogId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  alert(blogId ? "Blog updated ✅" : "Blog saved ✅");
  resetBlog();
  loadBlogs();
});

async function editBlog(id) {
  const res = await fetch(`${BASE_URL}/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const json = await res.json();
  const blog = json.data;

  document.getElementById("blogId").value = id;
  titleInput.value = blog.title;
  tinymce.get("content").setContent(blog.content);
  tagsInput.value = blog.tags.join(",");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

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
  document.getElementById("blogId").value = "";
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

/* ---------- SETTINGS ---------- */
function saveSettings() {

  const data = {
    logo: document.getElementById("siteLogo").value,
    email: document.getElementById("siteEmail").value,
    phone: document.getElementById("sitePhone").value,
    address: document.getElementById("siteAddress").value
  };

  localStorage.setItem("siteSettings", JSON.stringify(data));

  alert("Settings saved successfully ✅");
}

function loadSettings() {

  const saved = localStorage.getItem("siteSettings");
  if (!saved) return;

  const data = JSON.parse(saved);

  document.getElementById("siteLogo").value = data.logo || "";
  document.getElementById("siteEmail").value = data.email || "";
  document.getElementById("sitePhone").value = data.phone || "";
  document.getElementById("siteAddress").value = data.address || "";
}

/* IMPORTANT */
function showSettings() {
  hideAll();
  settingsSection.style.display = "block";
  loadSettings();
}


/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* ---------- INIT ---------- */
showDashboard();


