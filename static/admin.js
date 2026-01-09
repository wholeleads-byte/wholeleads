const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) location.href = "adminlogin.html";

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

/* ---------- TinyMCE ---------- */
tinymce.init({
  selector: "#content",
  apiKey: "YOUR_API_KEY_HERE",
  height: 350,
  plugins: "image link lists",
  toolbar: "undo redo | bold italic underline | bullist numlist | image link",
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

  if (!title || !content) {
    alert("Title & content required");
    return;
  }

  const payload = { title, content, tags };

  const res = await fetch(`${BASE_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("Blog save failed");
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

/* ---------- SETTINGS ---------- */
async function saveSettings() {
  const logo = document.getElementById("siteLogo").value;
  const email = document.getElementById("siteEmail").value;
  const phone = document.getElementById("sitePhone").value;

  const payload = { logo, email, phone };

  const res = await fetch(`${BASE_URL}/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("Settings save failed ❌");
    return;
  }

  alert("Settings updated on website ✅");
}

async function loadSettings() {
  const res = await fetch(`${BASE_URL}/settings`);
  const data = await res.json();

  document.getElementById("siteLogo").value = data.logo || "";
  document.getElementById("siteEmail").value = data.email || "";
  document.getElementById("sitePhone").value = data.phone || "";
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* ---------- INIT ---------- */
showDashboard();
