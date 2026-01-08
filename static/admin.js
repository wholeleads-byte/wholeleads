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
  toolbar: "undo redo | bold italic | bullist numlist | image link",
});

/* ================= DOM ================= */
const dashboardSection = document.getElementById("dashboardSection");
const blogsSection     = document.getElementById("blogsSection");
const leadsSection     = document.getElementById("leadsSection");
const settingsSection  = document.getElementById("settingsSection");

const blogForm  = document.getElementById("blogForm");
const blogList  = document.getElementById("blogList");
const blogCount = document.getElementById("blogCount");

const leadList  = document.getElementById("leadList");
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

/* ================= BLOGS ================= */
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
        <button class="btn btn-danger btn-sm" onclick="deleteBlog('${b._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

async function deleteBlog(id) {
  if (!confirm("Delete blog?")) return;
  await fetch(`${BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  loadBlogs();
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
