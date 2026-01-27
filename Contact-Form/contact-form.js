document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    contactNumber: document.getElementById("Number").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };

  try {
    const response = await fetch("https://wholeleads.com/contact-us", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    document.getElementById("response").innerHTML =
      "<span style='color:green'>Message sent successfully!</span>";

    document.getElementById("contactForm").reset();

  } catch (error) {
    document.getElementById("response").innerHTML =
      "<span style='color:red'>Something went wrong!</span>";
  }
});

