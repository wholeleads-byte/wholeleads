/* GLOBALS */
const BASE_URL = "https://leads-backend-2piw.onrender.com/api";
const token = localStorage.getItem("token");

if (!token || token === "undefined") {
  localStorage.clear();
  location.href = "adminlogin.html";
}

/* ⭐ TINYMCE FINAL CONFIG ⭐ */
tinymce.init({
  selector: "#content",

  plugins: "image link media table lists autoresize code",

  /* 👇 THIS MAKES BUTTONS VISIBLE */
  toolbar:
    "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image link media | table | code",

  menubar: false,
  branding: false,
  automatic_uploads: true,

  /* CLOUDINARY IMAGE UPLOAD */
  images_upload_handler: async (blobInfo, success, failure) => {
    try {
      const form = new FormData();
      form.append("file", blobInfo.blob());
      form.append("upload_preset", "blogs_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnfdijaa3/image/upload",
        { method: "POST", body: form }
      );

      const data = await res.json();
      success(data.secure_url);
    } catch (err) {
      console.error(err);
      failure("Upload failed");
    }
  }
});
