document.addEventListener("DOMContentLoaded", () => {

  const saved = localStorage.getItem("siteSettings");
  if (!saved) return;

  const data = JSON.parse(saved);

  /* LOGO */
  const logo = document.getElementById("siteLogo");
  if (logo && data.logo) {
    logo.src = data.logo;
  }

  /* FOOTER EMAIL */
  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail && data.email) {
    footerEmail.innerText = data.email;
  }

  /* FOOTER PHONE */
  const footerPhone = document.getElementById("footerPhone");
  if (footerPhone && data.phone) {
    footerPhone.innerText = data.phone;
  }

});
