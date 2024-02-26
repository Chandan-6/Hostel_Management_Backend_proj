
window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

let hostelA, hostelB, hostelC, hostelD;
let yearA, yearB, yearC, yearD;

fetch('/api/students/HostelAllocation')
.then(response => {
    if(response.ok){
        return response.json();
    } else {
        throw new Error("Failed to fetch Hostel allocation Details / Documents.");
    }
})
.then(data => {
    // now complete data is stored in the "data"
    hostelA = data[0].hostel_name; yearA = data[0].year;
    hostelB = data[1].hostel_name; yearB = data[1].year;
    hostelC = data[2].hostel_name; yearC = data[2].year;
    hostelD = data[3].hostel_name; yearD = data[3].year;
})
.catch(error => {
    console.log('Error', error);
});


document.getElementById('hostelForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var year = document.getElementById('year').value;
    var hostel;

    switch (true) {
        case (yearA == year):
            hostel = hostelA;
            break;
        case (yearB == year):
            hostel = hostelB;
            break;
        case (yearC == year):
            hostel = hostelC;
            break;
        case (yearD == year):
            hostel = hostelD;
            break;
        default:
            hostel = 'Unknown';
            break;
    }
    document.getElementById('hostel').innerText = hostel;
    document.getElementById('hostelInfo').style.display = 'flex';
    document.querySelector('.accept').style.display = 'block';
    document.getElementById("hostelInput").value = hostel;
});
