document.addEventListener("DOMContentLoaded", function () {

  // -------- Circle Hover Effect --------
  const items = document.querySelectorAll(".circle-item");
  const centerText = document.getElementById("centerText");

  if (centerText) {
    const defaultText = centerText.innerHTML;

    items.forEach(item => {
      item.addEventListener("mouseenter", () => {
        centerText.innerHTML = item.getAttribute("data-content");
      });

      item.addEventListener("mouseleave", () => {
        centerText.innerHTML = defaultText;
      });
    });
  }

  // -------- Call Us Button --------
  const callBtn = document.getElementById("callUs");

  if (callBtn) {
    callBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const phoneNumber = "+917814007003";
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      if (isMobile) {
        window.location.href = "tel:" + phoneNumber;
      } else {
        alert("Call us at: " + phoneNumber);
      }
    });
  }

  console.log("WholeLeads JS Loaded Successfully ✅");
});
