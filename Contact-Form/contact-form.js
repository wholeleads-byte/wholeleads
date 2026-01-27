document.getElementById("contactForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    contactNumber: document.getElementById("Number").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };

  try {
    const response = await fetch(
      "https://leads-backend-2piw.onrender.com/api/contact-us",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    if(result.success){
      document.getElementById("response").innerHTML =
        "<span style='color:green'>Form submitted successfully!</span>";
      document.getElementById("contactForm").reset();
    } else {
      document.getElementById("response").innerHTML =
        "<span style='color:red'>Something went wrong!</span>";
    }

  } catch (error) {
    console.error(error);
    document.getElementById("response").innerHTML =
      "<span style='color:red'>Server Error!</span>";
  }
});
