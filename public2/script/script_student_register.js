window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

document.getElementById("myform").addEventListener("submit", function(event){
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = {};
    for(const [key, value] of formData.entries()){
        jsonData[key] = value;
    }
    const jsonBody = JSON.stringify(jsonData);

    fetch('/api/students/register', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : jsonBody
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        // Check the message from the server
        if(data.message === "Student already exists.") {
            document.querySelector(".congrats").textContent = data.message;
        } else {
            document.querySelector(".congrats").textContent = "Registration successful.";
            document.getElementById("myform").reset();
        }
        document.querySelector(".congrats").style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle network errors or other exceptions
        document.querySelector(".congrats").textContent = 'An error occurred. Please try again later.';
        document.querySelector(".congrats").style.display = 'block';
    })
})
