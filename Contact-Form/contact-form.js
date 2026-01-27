// contact-form.js

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get values safely
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    const responseDiv = document.getElementById("response");

    try {
      const res = await fetch(
        "https://leads-backend-2piw.onrender.com/api/contact-us",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            contactNumber: contactNumber,
            subject: subject,
            message: message
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        responseDiv.innerHTML =
          "<span style='color:green'>Message sent successfully!</span>";
        form.reset();
      } else {
        responseDiv.innerHTML =
          "<span style='color:red'>Failed to send message</span>";
      }

    } catch (error) {
      console.error(error);
      responseDiv.innerHTML =
        "<span style='color:red'>Server error!</span>";
    }
  });

});
