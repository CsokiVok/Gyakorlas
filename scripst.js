const endUrl = "https://retoolapi.dev/U2uKOV/data";

document.addEventListener("DOMContentLoaded", () => {
    const creatButton = document.querySelector("#creat")
    const readButton = document.querySelector("#read")
    const userForm = document.querySelector("#userForm");
    const userFormSubmitButton = document.querySelector("#userFormSubmitButton");
    const userList = document.querySelector("#userList");
    const idInput = document.querySelector("#id");
    const firstNameInput = document.querySelector("#firstName");
    const lastNameInput = document.querySelector("#lastName");
    const emailAddressInput = document.querySelector("#emailAddress")
    const phoneNumberInput = document.querySelector("#phoneNumber")

    creatButton.addEventListener('click', () => {
        clearUserForm();
        displayCreateButton();
        displayUserForm();
    })

    readButton.addEventListener('click', () => {
        displayUserList();
    })

    function displayUserForm() {
        userList.classList.add("d-none");
        userForm.classList.remove("d-none");
    }

    function displayUserList() {
        readAllUsers();
        userForm.classList.add("d-none");
        userList.classList.remove("d-none");
    }

    userForm.addEventListener('submit', event => {
        event.preventDefault();
        const id = parseInt(idInput.value);
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const emailAddress = emailAddressInput.value;
        const phoneNumber = phoneNumberInput.value;
        const user = {
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber
        };
        if (id == 0) {
            createUser(user);
        } else {
            updateUser(id, user);
        }
    })

    async function updateUser(id, user) {
        const response = await fetch(endUrl + "/" + id, {
            method: "PATCH",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            alert("Hiba történt")
            return;
        }
        displayUserList();
    }

    async function createUser(user) {
        const response = await fetch(endUrl, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            displayUserList();
        } else {
            alert("hiba történt")
        }
    }

    function clearUserForm() {
        idInput.value = 0;
        firstNameInput.value = "";
        lastNameInput.value = "";
        emailAddressInput.value = "";
        phoneNumberInput.value = "";
    }

    async function deleteUser(id) {
        const userConfirm = confirm(`Biztos szeretné törölni a ${id} sorszámú elemet?`)
        if (!userConfirm) {
            return;
        }
        const response = await fetch(endUrl + "/" + id, {
            method: "DELETE"
        });
        readAllUsers();
        if (!response.ok) {
            alert("Sikertelen törlés");
        }
    }

    function readAllUsers() {
        fetch(endUrl)
            .then((response) => response.json())
            .then((data) => adatokTablazatba(data))
    }

    function adatokTablazatba(data) {
        let tablaHtml = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Keresztnév</th>
                    <th>Vezetéknév</th>
                    <th>Email</th>
                    <th>Telefonszám</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>`;

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let tableRow = `<tr>
                    <td>${element.id}</td>
                    <td>${element.firstName}</td>
                    <td>${element.lastName}</td>
                    <td>${element.emailAddress}</td>
                    <td>${element.phoneNumber}</td>
                    <td>
                        <button type="button" class="btn btn-outline-success" onclick="loadUserUpdateForm(${element.id})">Módosítás</button>
                        
                        <button type="button" class="btn btn-outline-danger" onclick="deleteUser(${element.id})">Törlés</button>
                    </td>
                </tr>`;
            tablaHtml += tableRow;
        }

        tablaHtml += '</tbody></table>';
        userList.innerHTML = tablaHtml;
    }

    async function loadUserUpdateForm(id) {
        const response = await fetch(endUrl + "/" + id);
        if (!response.ok) {
            readAllUsers();
            alert("Hiba történt a módosítási űrlap megnyitása során");
            return;
        }
        const user = await response.json();
        console.log(user);
        idInput.value = user.id;
        firstNameInput.value = user.firstName;
        lastNameInput.value = user.lastName;
        emailAddressInput.value = user.emailAddress;
        phoneNumberInput.value = user.phoneNumber;

        displayUpdateButton();
        displayUserForm();
    }

    function displayUpdateButton() {
        userFormSubmitButton.textContent = "Módosítás";
        userFormSubmitButton.classList.remove("btn-outline-primary");
        userFormSubmitButton.classList.add("btn-outline-success");
    }

    function displayCreateButton() {
        userFormSubmitButton.textContent = "Felvétel";
        userFormSubmitButton.classList.remove("btn-outline-success");
        userFormSubmitButton.classList.add("btn-outline-primary");
    }

    window.deleteUser = deleteUser;
    window.loadUserUpdateForm = loadUserUpdateForm;
    readAllUsers();
})