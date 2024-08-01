const inputSlider=document.querySelector("[data-lengthSlider]");//custom attribute fetch karne ka syntax
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
// create string of all symbols
const symbols='!@#$%^&*()_-+=<>?/{}[]|<>/?~';

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    //special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})



let password='';
let passwordLength=10;
let checkCount=1;
//strength and set to grey
handleSlider();
//sets the value of slider
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100";

}

setIndicator("#ccc")
function setIndicator(color){
    //change colour
    indicator.style.backgroundColor=color;
    //add shadow of color
    indicator.style.boxShadow=`0px 0px 10px ${color}`;
    

}

function getRandInteger(min,max){
    //math.random() returns a number between 0 to 1 (0 inclusive and 1 exclusive) we took floor to make all
    //the number as integer
    return Math.floor(Math.random()*(max-min+1)+min);
}

function generateRandomNumber(){
    //generate random number between 0 to 9
    return getRandInteger(0,9);
}

function generateLowerCase(){
    //generate random number between 0 to 25
    return String.fromCharCode(getRandInteger(97,122));
}

function generateUpperCase(){
    //generate random number between 0 to 25
    return String.fromCharCode(getRandInteger(65,90));
}

function generateSymbol(){
    const randNum=getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);    
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    for(let i=0;i<password.length;i++){
        let charCode=password.charCodeAt(i);
        if(charCode>=65 && charCode<=90) hasUpper=true;
        else if(charCode>=97 && charCode<=122) hasLower=true;
        else if(charCode>=48 && charCode<=57) hasNum=true;
        else hasSym=true;
    }

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");

    }
    else if((hasLower||hasUpper)&& (hasNum|| hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}


async function copyContent(){
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch{
        copyMsg.innerText="failed";
    }
    //to make copy content visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },200);

}

//event listeners
inputSlider.addEventListener('input',(e)=>{
   passwordLength=e.target.value;
   handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

// function sufflePassword(sufflePassword){
//     //fisher yates algorithm for suffling
//     for(let i=sufflePassword.length-1;i>0;i--){
//         const j=Math.floor(Math.random()*i);
//         [sufflePassword[i],sufflePassword[j]]=[sufflePassword[j],sufflePassword[i]];
//     }
//     return sufflePassword;



// }
function sufflePassword(str) {
    // Convert string to an array of characters
    let arr = str.split('');

    // Shuffle the array using Fisher-Yates shuffle algorithm
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Convert the array back to a string and return
    return arr.join('');
}


generateBtn.addEventListener('click',() =>{
    if(checkCount<=0)return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //removed thE OLD PASSWORD
    password='';

    //generating the password
    // if(upperCaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password+=generateSymbol();
    // }
    

    let funcArr=[];
    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsary
    for (i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    for (i=0;i<passwordLength-checkCount;i++){
        let randomIndex=getRandInteger(0,funcArr.length-1);
        password+=funcArr[randomIndex]();
    }
    //now we need to suffle bcz first four elements are always the same
    password=sufflePassword(password);
    passwordDisplay.value=password;
    calcStrength();
})




