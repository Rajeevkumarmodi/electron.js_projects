const firstName = document.getElementById("firstName").value;
const lastName = document.getElementById("lastName").value;
const phone = document.getElementById("phone").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const address = document.getElementById("address").value;
const country = document.getElementById("country").value;
const postalZipCode = document.getElementById("postalZipCode").value;
const companyName = document.getElementById("companyName").value;
const publishStatus = document.getElementById("publishStatus").value;
const bankDetail = document.getElementById("postalZipCode").value;
const userTable = document.getElementById("userTable");
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", () => {
  console.log("clicked");
});

window.onload = () => {
  // Using the exposed ipcRenderer.send method
  window.electronAPI.send("get-items");

  // Using the exposed ipcRenderer.receive method
  window.electronAPI.receive("get-items-success", (items) => {
    displayData(items);
  });

  window.electronAPI.receive("get-items-error", (errorMessage) => {
    console.error(errorMessage);
  });
};

function displayData(allData) {
  let allElements = "";
  allData.forEach((elm) => {
    allElements += `
    <tr>
          <td>${elm.firstName}</td>
          <td>${elm.lastName}</td>
          <td>${elm.phone}</td>
          <td>${elm.email}</td>
          <td>${elm.password}</td>
          <td>${elm.address}</td>
          <td>${elm.country}</td>
          <td>${elm.postalZipCode}</td>
          <td>${elm.companyName}</td>
          <td>${elm.publishStatus}</td>
          <td>${elm.bankDetail}</td>
          <td class="actionsBtns">
            <button>Edit</button>
            <button>delete</button>
          </td>
        </tr>
    `;
  });
  userTable.innerHTML = allElements;
}
