const BASE_URL = "https://leads-backend-2piw.onrender.com/api";

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function loadBlog() {
  const id = getParam("id");
  const wrapper = document.getElementById("blogWrapper");

  if (!id) {
    wrapper.innerHTML = "<p class='text-danger'>Invalid blog link.</p>";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/blogs/${id}`);
    const data = await res.json();

    console.log("DETAIL RESPONSE:", data);

    const b = data.data;

    if (!b) {
      wrapper.innerHTML = "<p class='text-danger'>Blog not found.</p>";
      return;
    }

    wrapper.innerHTML = `
      <h1>${b.title}</h1>

      <div class="blog-meta">
        ${b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
      </div>

      <div class="blog-content">
        ${b.content || ""}
      </div>
    `;
  } catch (err) {
    console.error(err);
    wrapper.innerHTML =
      "<p class='text-danger text-center'>Failed to load blog detail.</p>";
  }
}

loadBlog();
