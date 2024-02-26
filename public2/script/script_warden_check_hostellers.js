window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

  document.getElementById("searchStudentBtn").addEventListener("click", function(event){
    event.preventDefault();

    const StudentID = document.getElementById("studentSearch").value;
    const jsonData = {jntu_no : StudentID};
    const jsonBody = JSON.stringify(jsonData);

    fetch('/api/warden/StudentDetailsByID', {
      method : "POST",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : jsonBody
    })
    .then(response => {
      if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch student details.');
    }
    })
    .then(data => {

        document.getElementById("studentInfo").style.display = 'block';
        document.getElementById("studentName").textContent = data.name;
        document.getElementById("studentID").textContent = data.jntu_no;
        document.getElementById("yearOfStudy").textContent = data.year;
        document.getElementById("parentPhoneNo").textContent = data.parent_phone_number;
        document.getElementById("ParentEmail").textContent = data.parent_email;
        document.getElementById("HostelID").textContent = data.hostelID;
        document.getElementById("FloorNo").textContent = data.floor;
        document.getElementById("RoomNo").textContent = data.room;
        document.getElementById("RoomType").textContent = data.roomType;
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error if the fetch request fails
    });
  })


  document.getElementById("searchRoomBtn").addEventListener("click", function(event){
    event.preventDefault();

    const RoomNumber = document.getElementById("roomSearch").value;
    const jsonData = {room : RoomNumber};
    const jsonBody = JSON.stringify(jsonData);

    fetch('/api/warden/StudentDetailsByRoomNo', {
      method : "POST",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : jsonBody
    })
    .then(response => {
      if(response.ok){
        return response.json();
      } else {
        throw new Error('Failed to fetch student details.');
    }
    })
    .then(data => {

      document.getElementById("roomInfo").style.display = 'block';
        // clear existing table rows
        document.querySelectorAll(".student_details_room tbody tr").forEach(row => row.remove());

        data.forEach(student =>{
          //create a new table row
          const newRow = document.createElement("tr");
          
          newRow.innerHTML = `
          <td>${student.name}</td>
          <td>${student.jntu_no}</td>
          <td>${student.year}</td>
          <td>${student.parent_phone_number}</td>
          <td>${student.parent_email}</td>
          <td>${student.hostelID}</td>
          <td>${student.floor}</td>
          <td>${student.room}</td>
          <td>${student.roomType}</td>
      `;

      document.querySelector(".student_details_room tbody").appendChild(newRow);
        });
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error if the fetch request fails
    });
  })