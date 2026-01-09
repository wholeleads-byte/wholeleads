document.addEventListener("DOMContentLoaded", () => {

  const saved = localStorage.getItem("siteSettings");

  let data = {
    logo: "/MAINLOGO/Whole-leads-main-logo.png",
    email: "support@wholeleads.com",
    phone: "+91 7814007003",
    address: "Santa Clara, US"
  };

  if (saved) {
    data = { ...data, ...JSON.parse(saved) };
  }

  /* LOGO */
  const logo = document.getElementById("siteLogo");
  if (logo) logo.src = data.logo;

  /* EMAIL */
  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail) footerEmail.innerText = data.email;

  /* PHONE */
  const footerPhone = document.getElementById("footerPhone");
  if (footerPhone) footerPhone.innerText = data.phone;

  /* ADDRESS */
  const footerAddress = document.getElementById("footerAddress");
  if (footerAddress) footerAddress.innerText = data.address;

});

