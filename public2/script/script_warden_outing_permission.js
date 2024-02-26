
window.addEventListener("load", ()=>{
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitioned", ()=>{
       document.body.removeChild("loader");
    });
  });

document.addEventListener("DOMContentLoaded", function() {
    // Fetch outing history from the server
    fetch('/api/warden/outingHistory')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch outing History.');
            }
        })
        .then(data => {
            // Populate the outing history table
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
                    <td class="status">${outing.status}
                        <button class="accept-btn">Accept</button>
                        <button class="reject-btn">Reject</button>
                    </td>
                `;
                document.getElementById("outing-history-table").appendChild(newRow);

                // Add event listeners to Accept and Reject buttons
                const acceptBtn = newRow.querySelector('.accept-btn');
                const rejectBtn = newRow.querySelector('.reject-btn');
                acceptBtn.addEventListener('click', function() {
                    updatePermission(outing.outingID, 'Accepted');
                    newRow.querySelector(".status").textContent = 'Accepted';
                    acceptBtn.classList.add('disabled');
                    rejectBtn.classList.add('disabled');
                });
                rejectBtn.addEventListener('click', function() {
                    updatePermission(outing.outingID, 'Rejected');
                    newRow.querySelector(".status").textContent = 'Rejected';
                    acceptBtn.classList.add('disabled');
                    rejectBtn.classList.add('disabled');
                });
                const message = outing.status;
                if (message === 'Accepted' || message === 'Rejected') {
                    acceptBtn.style.display = 'none';       
                    rejectBtn.style.display = 'none';
                }
                             
            });
        })
        .catch(error => {
            console.error("Error : ", error);
        });

    // Function to send POST request to update permission status
    function updatePermission(outingID, status) {
        fetch('/api/warden/updatePermission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ outingID, status })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to update permission status.');
            }
        })
        .then(data => {
            console.log(data.message);
            // Optionally, update the status in the UI
        })
        .catch(error => {
            console.error("Error : ", error);
        });
    }
});