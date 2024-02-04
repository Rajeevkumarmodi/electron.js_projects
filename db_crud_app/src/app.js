const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const password = document.getElementById("password");
const address = document.getElementById("address");
const country = document.getElementById("country");
const postalZipCode = document.getElementById("postalZipCode");
const companyName = document.getElementById("companyName");
const publishStatus = document.getElementById("publishStatus");
const bankDetail = document.getElementById("postalZipCode");
const userTable = document.getElementById("userTable");
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", () => {
  console.log("clicked");
  postUserData();
});

// getdata from batabase
const getAllUsers = () => {
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

window.onload = getAllUsers();
// setData

function postUserData() {
  const userRegisterData = {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    address: address.value,
    country: country.value,
    postalZipCode: postalZipCode.value,
    companyName: companyName.value,
    publishStatus: publishStatus.value,
    bankDetail: bankDetail.value,
  };

  window.electronAPI.send("set-item", userRegisterData);
  window.electronAPI.receive("set-tiem-success", (data) => {
    console.log("result is succcess", data);
    getAllUsers();
  });

  window.electronAPI.receive("set-item-error", (errorMessage) => {
    alert(errorMessage);
  });
}

// delete user

function deleteUser(userId) {
  console.log("this is id", userId);
  window.electronAPI.send("delete-item", userId);
  window.electronAPI.receive("delete-item-success", (result) => {
    alert("user delete successfully");
    getAllUsers();
  });

  window.electronAPI.receive("delete-item-error", (errorMessage) => {
    alert(errorMessage);
  });
}

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
            <button class="editBtn" id=${elm.id}>Edit</button>
            <button class="deleteBtn" id=${elm.id}>delete</button>
          </td>
        </tr>
    `;
  });
  userTable.innerHTML = allElements;

  // target edit and delete button
  const deleteBtn = document.querySelectorAll(".deleteBtn");
  const editBtn = document.querySelectorAll(".editBtn");

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.id;
      deleteUser(id);
    });
  });
}
