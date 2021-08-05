// Bank Elements
const nameElem = document.getElementById("nameElem");
const totalBalanceElem = document.getElementById("totalBalance");
const outstandingLoanHeaderElem = document.getElementById("outstandingLoanHeader");
outstandingLoanHeaderElem.style.display = "none";
const outstandingLoanElem = document.getElementById("outstandingLoanValue");
outstandingLoanElem.style.display = "none";
const loanButton = document.getElementById("loanButton");
const bankBox = document.getElementById("bankBox");

loanButton.addEventListener("click", OpenPopUpLoan)

// Work Elements
const totalPayElem = document.getElementById("totalPay");
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const payLoanButton = document.getElementById("payLoanButton");

bankButton.addEventListener("click", AddToBank);
workButton.addEventListener("click", GetPayed);
payLoanButton.addEventListener("click", PayLoan);
payLoanButton.style.display = "none";

// Laptops Elements
const selectElem = document.getElementById("selectComputer")
const descriptionListElem = document.getElementById("descriptionListElem")
const computerPresentationElem = document.getElementById("computerPresentation")
const computerImg = document.getElementById("computerPic");
const computerTitle = document.getElementById("computerTitle");
const computerDescription = document.getElementById("computerDescription");
const computerPrice = document.getElementById("price");
const buyButton = document.getElementById("buyButton");

selectElem.addEventListener("change", getSelected);
buyButton.addEventListener("click", buyComputer);

// Global variables
let totalBalance = 0;
let totalOutstandingLoan = 0;
let totalPay = 0;
let computers = [];
let json;
let loan = false;

TotalBalance();
TotalPay();
getComputers();

// Updates the balance
function TotalBalance() {
    totalBalanceElem.innerHTML = totalBalance + " SEK";
}

// Updates the loan
function TotalOutstandingLoan() {

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
    TotalPay(); 
    
}

// Updates the pay
function TotalPay() {
    totalPayElem.innerHTML = totalPay + " SEK";
}

// Opens up a pop up to enter how much the user wants to loan
function OpenPopUpLoan() {
    let popUp = prompt("How much would you like to loan?","");
    if (popUp == null || popUp == "") {
        console.log(popUp);
    } else if (popUp > (totalBalance * 2)) {
            alert("You need to earn more money before taking a loan this big!");
    }
    
    else {
        totalOutstandingLoan = parseInt(popUp);
        TotalOutstandingLoan();

        totalBalance += parseInt(popUp);
        TotalBalance();
        
        loanButton.style.display = "none";
        payLoanButton.style.display = "block";
        loan = true;
    }
}

// Adds the total pay to the bank balance, and "nollställer" the pay.
function AddToBank() {
    
    if (totalOutstandingLoan > 0) {
        totalOutstandingLoan -= (totalPay*0.10);
        
        totalBalance += (totalPay*0.90);

        if(totalOutstandingLoan > 0) {
            totalPay = 0;
        }
        TotalOutstandingLoan(); 

    }
    else {
        totalBalance += totalPay;
        totalPay = 0;
    }

    TotalBalance();
    TotalPay();
    
}

// Increases the pay with 100:-
function GetPayed() {
    totalPay += 100;
    TotalPay();
}

function PayLoan() {

    totalOutstandingLoan -= totalPay;
    totalPay = 0;

    TotalOutstandingLoan();
    TotalPay();
    
}

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


function defaultImg() {
    computerImg.src = "https://i.stack.imgur.com/y9DpT.jpg";
}

function buyComputer() {
    let price = computerPrice.innerHTML.match(/\d/g);
    price = price.join("")

    if (totalBalance >= (price)) {
        totalBalance -= price;
        TotalBalance();

        alert("You just bought a " + computerTitle.innerHTML + "!");

        if (totalOutstandingLoan == 0) {
            loanButton.style.display = "block";
        }

        loan = false;
        TotalOutstandingLoan();

    } else {
        alert("you need more money");
    }
}

