window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

var rooms, selectedFloor;
document.addEventListener("DOMContentLoaded", function() {
    var floors = document.querySelectorAll('.floor');
    floors.forEach(function(floor) {
        floor.style.display = 'none';
    });
    disableZeroBedRooms();
});

fetch('/api/students/studentName')
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch student name');
    }
})
.then(data => {
    // Assuming 'data' contains the student name 
    //console.log('Student Name:', data.name);
    // Now you can display the student name wherever you need it
    document.getElementById("studentName").textContent = data.name; 
    document.getElementById("hostelID").textContent = data.hostelID; 
})
.catch(error => {
    console.error('Error:', error);
    // Handle error if the fetch request fails
});

document.getElementById("floors").addEventListener("change", function(){
    selectedFloor = this.value;
    var floors = document.querySelectorAll('.floor');
    floors.forEach(function(floor) {
        floor.style.display = 'none';
    });
    if (selectedFloor !== '') {
        var selectedFloorElements = document.querySelectorAll('.floor' + selectedFloor);
        selectedFloorElements.forEach(function(floor) {
            floor.style.display = 'table-row';
        });
    }
});


function disableZeroBedRooms() {
    rooms = document.querySelectorAll('input[type="radio"]');
    rooms.forEach(function(room) {
        var bedAvailability = room.nextElementSibling.querySelector('.beds_availability').innerText;
        var availableBeds = parseInt(bedAvailability.split(' ')[0]);
        if (availableBeds === 0) {
            room.disabled = true;
        } else {
            room.disabled = false;
        }
    });
}

document.getElementById("submit_btn").addEventListener("click", function(){
    
    document.getElementById("floorNo").textContent = selectedFloor;
    document.getElementById("FloorNumber").value = selectedFloor;
    rooms.forEach(function(room){
        if(room.checked){
            document.getElementById("roomNo").textContent = room.value;
            document.getElementById("RoomNumber").value = room.value;

            document.getElementById("roomType").textContent = room.dataset.roomType;
            document.getElementById("RoomType").value = room.dataset.roomType;
        }
    });

});

document.getElementById('roomSelectionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // event.preventDefault();: This line prevents the default form submission behavior, which would cause the page to reload. 

    // Serialize form data into JSON format
    const formData = new FormData(this);
    const jsonData = {};
    for (const [key, value] of formData.entries()) {
        jsonData[key] = value;
    }
    const jsonBody = JSON.stringify(jsonData);

    // Send JSON data asynchronously to your server-side endpoint
    fetch('/api/students/acceptRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonBody
    })  
    .then(response => { //This method is called when the server responds to the request.
        if (response.ok) {
            // Handle success
            document.querySelector(".congrats").textContent = 'Room is allocated and data is stored.';
            document.querySelector(".congrats").style.display = 'block';
        } else {
            // Handle other status codes (e.g., 404, 500, etc.)
            document.querySelector(".congrats").textContent = 'There is an error in room allocation.';
            document.querySelector(".congrats").style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle network errors or other exceptions
        document.querySelector(".congrats").textContent = 'An error occurred. Please try again later.';
        document.querySelector(".congrats").style.display = 'block';
    });
});
 