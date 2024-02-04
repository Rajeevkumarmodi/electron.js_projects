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
const bankDetail = document.getElementById("bankDetail");
const form = document.getElementById("form");
const userTable = document.getElementById("userTable");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
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
    form.reset();
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

// edit user data

function editUser(userId) {
  // fetch single user data
  window.electronAPI.send("get-singleuser-item", userId);
  window.electronAPI.receive("get-singleuser-item-success", (result) => {
    filltDataInForm(userId, result);
  });

  window.electronAPI.receive("get-item-error", (errorMessage) => {
    alert(errorMessage);
  });
}

// update single user Data
function updateUser(userId, userUpdatedData) {
  window.electronAPI.send("update-item", { userId, userUpdatedData });
  window.electronAPI.receive("update-item-success", (result) => {
    getAllUsers();
    form.reset();
  });

  window.electronAPI.receive("update-item-error", (errorMessage) => {
    alert(errorMessage);
  });
}

function filltDataInForm(userId, data) {
  firstName.value = data[0].firstName;
  lastName.value = data[0].lastName;
  phone.value = data[0].phone;
  email.value = data[0].email;
  password.value = data[0].passwordHash;
  address.value = data[0].address;
  country.value = data[0].country;
  postalZipCode.value = data[0].postalZipCode;
  companyName.value = data[0].companyName;
  publishStatus.value = data[0].publishStatus;
  bankDetail.value = data[0].bankDetails;
  // show update button
  updateBtn.style.display = "block";
  submitBtn.style.display = "none";

  // update user

  updateBtn.addEventListener("click", () => {
    const userUpdatedData = {
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

    updateUser(userId, userUpdatedData);
  });
}

// display all users
function displayData(allData) {
  updateBtn.style.display = "none";
  submitBtn.style.display = "block";

  let allElements = "";
  allData.forEach((elm) => {
    allElements += `
    <tr>
          <td>${elm.firstName}</td>
          <td>${elm.lastName}</td>
          <td>${elm.phone}</td>
          <td>${elm.email}</td>
          <td>${elm.passwordHash}</td>
          <td>${elm.address}</td>
          <td>${elm.country}</td>
          <td>${elm.postalZipCode}</td>
          <td>${elm.companyName}</td>
          <td>${elm.publishStatus}</td>
          <td>${elm.bankDetails}</td>
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

  // all delete btns
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.id;
      deleteUser(id);
    });
  });

  // all edit btns

  editBtn.forEach((elm) => {
    elm.addEventListener("click", (e) => {
      const id = e.target.id;
      editUser(id);
    });
  });
}
