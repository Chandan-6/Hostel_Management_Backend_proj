window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

document.getElementById("OutingForm").addEventListener("submit", function(event){
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = {};
    for(const [key, value] of formData.entries()){
        jsonData[key] = value;
    }
    const jsonBody = JSON.stringify(jsonData);

    fetch('/api/students/acceptOutingDetails', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : jsonBody
    })
    .then(response =>{
        if(response.ok){
            document.getElementById("alertMessage").style.display = 'block';
            document.getElementById("OutingForm").reset();
        }
        else{
            document.getElementById("alertMessage").textContent = 'There is error in sending Outing Request';
            document.getElementById("alertMessage").style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle network errors or other exceptions
        document.getElementById("alertMessage").textContent = 'An error occurred. Please try again later.';
        document.getElementById("alertMessage").style.display = 'block';
    });
});



document.getElementById("historyButton").addEventListener("click", function(){
    document.querySelector(".outing-history").style.display = 'block';
    fetch('/api/students/outingHistory')
    .then(response => {
        if(response.ok){
            return response.json();
        } else{
            throw new Error('Failed to fetch outing History.');
        }
    })
    .then(data => {
        data.forEach(outing => {
            const newRow = document.createElement("tr");

            newRow.innerHTML = `
            <td>${outing.jntu_no}</td>
            <td>${outing.permissionType}</td>
            <td>${outing.outDate.slice(0,10)}</td>
            <td>${outing.outTime}</td>
            <td>${outing.inDate.slice(0,10)}</td>
            <td>${outing.inTime}</td>
            <td>${outing.reason}</td>
            <td>${outing.status}</td>                
            `;

        document.querySelector(".outing-history table tbody").appendChild(newRow);
        });
    })
    .catch(error => {
        console.error("Error : ", error);
    });

});
