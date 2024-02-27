// Globala variabler
let formElem;
let radioInputs;
let personsElem;
let nightsElem;
let extraCheckboxElem;
let totalElem;
let campaignCodeElem;
let cityElem;
let zipcodeElem;
let telephoneElem;

window.onload = () => {
    //Definierar alla element
    formElem = document.getElementById("booking");
    radioInputs = document.querySelectorAll('input[name="roomType"]');
    personsElem = document.querySelector('select[name="persons"]');
    nightsElem = document.querySelector('select[name="nights"]');
    extraCheckboxElem = document.querySelectorAll('input[name="addition"]');
    totalElem = document.getElementById("totalCost");
    campaignCodeElem = document.querySelector('input[name="campaigncode"]');
    cityElem = document.getElementById("city");
    zipcodeElem = document.getElementById("zipcode");
    telephoneElem = document.getElementById("telephone");
    feedbackElems = document.querySelectorAll("label + span");

    //Sätter event listeners för kampanj koden, när användaren skriver och när de fockuserar elementet så anropas campaignValidate() och när elementet blurras så återställs färgen.
    campaignCodeElem.addEventListener("keyup", campaignValidate);
    campaignCodeElem.addEventListener("blur", () => {
        campaignCodeElem.style.backgroundColor = "#fff";
    });
    campaignCodeElem.addEventListener("focus", campaignValidate);

    //När användaren blurrar stad elementet så anropas capitalize() som gör värdet till stora bokstäver.
    cityElem.addEventListener("blur", capitalize);
    //När något förändras i formuläret så ska priset räknas ut.
    formElem.addEventListener("change", calculatePrice);
    //Förhindrar att formuläret skickas förens det har validerats av validate().
    formElem.addEventListener("submit", e => {
        e.preventDefault();
        validateInputs();
    });

    //Går igenom alla radio inputs och lägger till en event listener
    for (let i = 0; i < radioInputs.length; i++) {
        radioInputs[i].addEventListener("click", checkIfFamilyRoom);
    }

    calculatePrice();
}

function checkIfFamilyRoom() {
    //Om familjerummet är valt så avaktiveras tillägget för sjöutsikt och om det redan är ikryssat så tas det bort, person elementet aktiveras.
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

    //Går igenom radio inputs för att kolla vilket rum som är valt och sedan används regex.exec() på värdet för att ta ut priset som står i värdet med hjälp av ett simpelt reguljärt uttryck.
    for (let i = 0; i < radioInputs.length; i++) {
        if (radioInputs[i].checked) {
            const match = regex.exec(radioInputs[i].value);
            totalSum = +match[0];
        }
    }

    //Samma sak sker med tilläggen
    for (let i = 0; i < extraCheckboxElem.length; i++) {
        if (extraCheckboxElem[i].checked) {
            const match = regex.exec(extraCheckboxElem[i].value);
            totalSum += +match[0];
        }
    }

    //Summan multipleceras med antalet nätter
    totalSum *= nightsElem.value;

    totalElem.innerHTML = totalSum;
}

function capitalize() {
    cityElem.value = cityElem.value.toUpperCase();
}

function validateInputs() {
    let tel = true;
    let campaign = true;

    const zipRegex = /^\d{3} ?\d{2}$/;
    //Sträng startar med 3 siffror med ett valfritt mellanslag och strängen avslutas sedan med två siffror
    const telRegex = /^0\d{1,3}[ |\-|\/]?\d{5,8}$/;
    //Strängen börjar på 0, 1-3 siffror, valfritt " ", "-" eller "/", 5-8 siffror i slutet av strängen.

    let zip = validateRegex(zipRegex, zipcodeElem.value);
    if (telephoneElem.value) {
        tel = validateRegex(telRegex, telephoneElem.value);
    }
    if (campaignCodeElem.value) {
        campaign = campaignValidate();
    }
    //Värden verifieras med validateRegex() och sätts till variabler. Eftersom att kampanjkod och telefonnummer inte behövs anges så kontrolleras de bara om användaren har skrivit in något.

    //Om postnummret inte stämmer så ska det ges feedback genom ett span element, om koden innehåller något som inte är en siffra så skrivs det att det endast får innehålla siffror. Annars så skrivs det att input är felaktig. Om det inte är något fel så töms span elementet.
    if (!zip) {
        if (validateRegex(/\D/, zipcodeElem.value)) {
            feedbackElems[0].innerHTML = "Postnummer får endast innehålla siffror";
        } else {
            feedbackElems[0].innerHTML = "Felaktig input";
        }
    } else {
        feedbackElems[0].innerHTML = "";
    }

    //Samma sker för telefonnummret
    if (!tel & telephoneElem.value) {
        feedbackElems[1].innerHTML = "Felaktig input";
    } else {
        feedbackElems[1].innerHTML = "";
    }

    //Om alla inputs stämmer så skickas formuläret
    if (zip & tel & campaign) {
        formElem.submit();
    }
}

function validateRegex(regex, value) {
    //Returnerar sant om match() inte är null;
    return value.match(regex) != null;
}

function campaignValidate() {
    const campaignRegex = /^[a-ö]{3}-\d{2}-[a-ö]\d$/i;
    //Strängen börjar med tre bokstäver,"-", två siffror,"-", en bokstav och slutar med en siffra.

    //Ändrar färg om input är godkänd och returnerar sant eller falskt.
    if (validateRegex(campaignRegex, campaignCodeElem.value)) {
        campaignCodeElem.style.backgroundColor = "#6f6";
        return true;
    } else {
        campaignCodeElem.style.backgroundColor = "#f66";
        return false;
    }
}