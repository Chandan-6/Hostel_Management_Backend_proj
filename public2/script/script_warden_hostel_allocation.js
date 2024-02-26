
window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

    // send the allocated data to server & store it
    document.getElementById("allocationForm").addEventListener("submit", function(event){
      event.preventDefault();

      const hostelYearMap = {};

      document.getElementById("allocationForm").querySelectorAll(".hostel").forEach(hostelDiv => {
        const hostelName = hostelDiv.querySelector("label").textContent.trim();
        const yearSelect = hostelDiv.querySelector("select");

        const yearValue = yearSelect.options[yearSelect.selectedIndex].value;

        hostelYearMap[hostelName] = parseInt(yearValue);
      });

      const jsonBody = JSON.stringify(hostelYearMap);
      console.log(`json body: ${jsonBody}`);
      
      fetch("/api/warden/acceptHostelAllocation", {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : jsonBody
      })
      .then(response => {
        if(response.ok){
          // Handle Success
          document.querySelector(".congrats").textContent = 'Allocated and data is stored.';
          document.querySelector(".congrats").style.display = 'block';
        } else{
              // Handle Error
              document.querySelector(".congrats").textContent = 'There is an error in hostel allocation.';
              document.querySelector(".congrats").style.display = 'block';
        }
      })
      .catch(error => {
        console.log('Error: ', error);
        document.querySelector(".congrats").textContent = 'An error occurred. Please try again later.';
        document.querySelector(".congrats").style.display = 'block';
      });
    });


    document.getElementById("saveBtn").addEventListener("click", () => {
      document.querySelector(".congrats").style.display = 'block';
    });
