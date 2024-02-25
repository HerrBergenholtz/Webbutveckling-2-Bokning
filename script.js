let formElem;
let roomElem;
let radioInputs;
let personsElem;
let dateElem;
let nightsElem;
let extraElem;
let extraCheckboxElem;
let totalElem;
let customerElem;
let campaignCodeElem;
let cityElem;
let zipcodeElem;
let telephoneElem;

window.onload = () => {
    formElem = document.getElementById("booking");
    roomElem = document.getElementById("room");
    radioInputs = document.querySelectorAll('input[name="roomType"]');
    personsElem = document.querySelector('select[name="persons"]');
    dateElem = document.getElementById("date");
    nightsElem = document.querySelector('select[name="nights"]');
    extraElem = document.getElementById("extra");
    extraCheckboxElem = document.querySelectorAll('input[name="addition"]');
    totalElem = document.getElementById("totalCost");
    campaignCodeElem = document.querySelector('input[name="campaigncode"]');
    customerElem = document.getElementById("customer");
    cityElem = document.getElementById("city");
    zipcodeElem = document.getElementById("zipcode");
    telephoneElem = document.getElementById("telephone");

    campaignCodeElem.addEventListener("keydown", campaignValidate);
    campaignCodeElem.addEventListener("blur", () => {
        campaignCodeElem.style.backgroundColor = "#fff";
    });
    campaignCodeElem.addEventListener("focus", campaignValidate);

    cityElem.addEventListener("blur", capitalize);
    formElem.addEventListener("change", calculatePrice);
    formElem.addEventListener("submit", e => {
        e.preventDefault();
        validateInputs();
    });

    for (let i = 0; i < radioInputs.length; i++) {
        radioInputs[i].addEventListener("click", checkIfFamilyRoom);
    }

    checkIfFamilyRoom();
    calculatePrice();
}

function checkIfFamilyRoom() {
    if (radioInputs[2].checked == true) {
        personsElem.disabled = false;
        personsElem.parentNode.style.color = "#000";

        extraCheckboxElem[2].disabled = true;
        extraCheckboxElem[2].checked = false;
        extraCheckboxElem[2].parentNode.style.color = "#999"
    } else {
        personsElem.disabled = true;
        personsElem.parentNode.style.color = "#999";

        extraCheckboxElem[2].disabled = false;
        extraCheckboxElem[2].parentNode.style.color = "#000";
    }
}

function calculatePrice() {
    const regex = /\d+/;
    let totalSum = 0;

    for (let i = 0; i < radioInputs.length; i++) {
        if (radioInputs[i].checked) {
            const match = regex.exec(radioInputs[i].value);
            totalSum = +match[0];
        }
    }

    for (let i = 0; i < extraCheckboxElem.length; i++) {

        if (extraCheckboxElem[i].checked) {
            const match = regex.exec(extraCheckboxElem[i].value);
            totalSum += +match[0];
        }
    }

    totalSum *= nightsElem.value;

    totalElem.innerHTML = totalSum;
}

function capitalize() {
    cityElem.value = cityElem.value.toUpperCase();
}

function validateInputs() {
    const zipRegex = /^\d{3}[ |-]?\d{2}$/;
    const telRegex = /^0\d{3}[ |\-|\/]?\d{3,7}$/;

    const zip = validate(zipRegex, zipcodeElem.value);
    const tel = validate(telRegex, telephoneElem.value);


    if (zip & tel) {
        console.log("funkar");
        formElem.submit();
    }
}

function validate(regex, value) {
    console.log("validate")
    return value.match(regex) != null;
}

function campaignValidate() {
    const campaignRegex = /^\w{3}-\d{2}-\w\d$/i;

    if (validate(campaignRegex, campaignCodeElem.value)) {
        campaignCodeElem.style.backgroundColor  = "#6f6"
    } else {
        campaignCodeElem.style.backgroundColor  = "#f66"
    }
}