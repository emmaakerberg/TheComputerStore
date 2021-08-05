// Bank Elements
const nameElem = document.getElementById("nameElem");
const totalBalanceElem = document.getElementById("totalBalance");
const outstandingLoanHeaderElem = document.getElementById("outstandingLoanHeader");
const outstandingLoanElem = document.getElementById("outstandingLoanValue");
const loanButton = document.getElementById("loanButton");
const bankBox = document.getElementById("bankBox");

// Work Elements
const totalPayElem = document.getElementById("totalPay");
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const payLoanButton = document.getElementById("payLoanButton");

// Laptops Elements
const selectElem = document.getElementById("selectComputer")
const descriptionListElem = document.getElementById("descriptionListElem")
const computerPresentationElem = document.getElementById("computerPresentation")
const computerImg = document.getElementById("computerPic");
const computerTitle = document.getElementById("computerTitle");
const computerDescription = document.getElementById("computerDescription");
const computerPrice = document.getElementById("price");
const buyButton = document.getElementById("buyButton");

// Event Listeners
loanButton.addEventListener("click", openPopUpLoan)
bankButton.addEventListener("click", addToBank);
workButton.addEventListener("click", getPayed);
payLoanButton.addEventListener("click", payLoan);
selectElem.addEventListener("change", getSelected);
buyButton.addEventListener("click", buyComputer);

//Hide elements
outstandingLoanHeaderElem.style.display = "none";
outstandingLoanElem.style.display = "none";
payLoanButton.style.display = "none";

// Global variables
let totalBalance = 0;
let totalOutstandingLoan = 0;
let totalPay = 0;
let computers = [];
let json;
let loan = false;

updateTotalBalance();
updateTotalPay();
getComputers();

// Updates the balance to the HTML
function updateTotalBalance() {
    totalBalanceElem.innerHTML = totalBalance + " SEK";
}

// Updates the loan to the HTML
function updateTotalOutstandingLoan() {

    if (totalOutstandingLoan > 0) {
        outstandingLoanElem.innerHTML = totalOutstandingLoan + " SEK";
        outstandingLoanHeaderElem.style.display = "block";
        outstandingLoanElem.style.display = "block";
    } 
    else if (totalOutstandingLoan <= 0) {
        totalPay = 0;

        if (totalOutstandingLoan < 0) {
            totalPay -= totalOutstandingLoan;
            
        } 
        
        
        outstandingLoanHeaderElem.style.display = "none";
        outstandingLoanElem.style.display = "none";
        payLoanButton.style.display = "none";
        

        if (loan == false) {
            loanButton.style.display = "block";
        }
    }
    updateTotalPay(); 
    
}

// Updates the pay to the HTML
function updateTotalPay() {
    totalPayElem.innerHTML = totalPay + " SEK";
}

// Opens up a pop up to enter how much the user wants to loan and adds it to
function openPopUpLoan() {
    let popUp = prompt("How much would you like to loan?","");
    if (popUp == null || popUp == "") {
        console.log(popUp);
    } else if (popUp > (totalBalance * 2)) {
            alert("You need to earn more money before taking a loan this big!");
    }
    
    else {
        totalOutstandingLoan = parseInt(popUp);
        updateTotalOutstandingLoan();

        totalBalance += parseInt(popUp);
        updateTotalBalance();
        
        loanButton.style.display = "none";
        payLoanButton.style.display = "block";
        loan = true;
    }
}

// If loan exists - adds 90% of the total pay to the bank balance and 10% to pay of the loan.
// If no loan exists - adds the total pay to the bank balance.
function addToBank() {   
    if (totalOutstandingLoan > 0) {
        totalOutstandingLoan -= (totalPay*0.10);
        
        totalBalance += (totalPay*0.90);

        if(totalOutstandingLoan > 0) {
            totalPay = 0;
        }
        updateTotalOutstandingLoan(); 
    }
    else {
        totalBalance += totalPay;
        totalPay = 0;
    }
    updateTotalBalance();
    updateTotalPay();
}

// Increases the pay with 100:-
function getPayed() {
    totalPay += 100;
    updateTotalPay();
}

// All the money from the pay goes to pay off the loan
function payLoan() {
    totalOutstandingLoan -= totalPay;
    totalPay = 0;

    updateTotalOutstandingLoan();
    updateTotalPay();
}

// Gets all computers from the API and creates new option-elements to print them out in the select-element
async function getComputers() {
    try{
        const response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
        json = await response.json()

        for(let i = 0; i < json.length; i++) {
            let opt = document.createElement('option');
            opt.name = json[i].id;
            opt.innerHTML = json[i].title;

            selectElem.appendChild(opt);
        }
    }
    catch(error) {
        console.log(error);
    }
}

// Get the selected computer from the drop down list and prints out the computer information.
function getSelected() {
    while (descriptionListElem.firstChild) {
        descriptionListElem.removeChild(descriptionListElem.lastChild);
      }

    for(let i = 0; i < json.length; i++) {
        if (selectElem.value == json[i].title) {

            for(let l = 0; l < json[i].specs.length; l++) {
                let description = document.createElement('li');
                description.innerHTML = json[i].specs[l];
                descriptionListElem.appendChild(description);   
                console.log(json[i].specs[l]);
            }

            computerImg.src = "https://noroff-komputer-store-api.herokuapp.com/" + json[i].image;
            computerTitle.innerHTML = json[i].title;
            computerDescription.innerHTML = json[i].description;
            computerPrice.innerHTML = json[i].price + " SEK";
        }
    }
}

// adds a default image
function defaultImg() {
    computerImg.src = "https://i.stack.imgur.com/y9DpT.jpg";
}

// check if the bank balance is enough to buy a computer.
// If it is, the computer price will be subtracted from the bank balance.
function buyComputer() {
    let price = computerPrice.innerHTML.match(/\d/g);
    price = price.join("")

    if (totalBalance >= (price)) {
        totalBalance -= price;
        updateTotalBalance();

        alert("You just bought a " + computerTitle.innerHTML + "!");

        if (totalOutstandingLoan == 0) {
            loanButton.style.display = "block";
        }

        loan = false;
        updateTotalOutstandingLoan();

    } else {
        alert("you need more money");
    }
}