// RÉCUPÉRATION DES ÉLÉMENTS HTML
const display = document.getElementById("display") as HTMLDivElement;
const previous = document.getElementById("previous") as HTMLDivElement;

const buttons = document.querySelectorAll<HTMLButtonElement>("button");

// VARIABLES
let currentValue: string = "0";
let previousValue: string = "";
let operator: string = "";
let shouldResetDisplay: boolean = false;


// AFFICHER LES VALEURS
function updateDisplay(): void {
    display.textContent = currentValue;

    previous.textContent = operator
        ? `${previousValue} ${operator}`
        : "";
}


// AJOUTER UN NOMBRE
function appendNumber (number: string): void {

    if (currentValue === "Erreur") {
        currentValue = "0";
    }

    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
    } else {
        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }

    updateDisplay();
}


// AJOUTER UNE VIRGULE
function addDecimal(): void {

    if (shouldResetDisplay) {
        currentValue = "0";
        shouldResetDisplay = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}


// CHOISIR UN OPÉRATEUR
function chooseOperator(newOperator: string): void {

    if (currentValue === "Erreur") return;

    if (operator && !shouldResetDisplay) {
        calculate();
    }

    if (currentValue === "Erreur") return;

    previousValue = currentValue;
    operator = newOperator;
    shouldResetDisplay = true;

    updateDisplay();
}


// EFFECTUER LE CALCUL
function calculate(): void {

    if (!operator || previousValue === "") return;

    const firstNumber = Number(previousValue);
    const secondNumber = Number(currentValue);

    let result: number;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                currentValue = "Erreur";
                previousValue = "";
                operator = "";
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentValue = String(Number(result.toPrecision(12)));

    previousValue = "";
    operator = "";
    shouldResetDisplay = true;

    updateDisplay();
}


// RÉINITIALISER LA CALCULATRICE
function clearCalculator(): void {

    currentValue = "0";
    previousValue = "";
    operator = "";
    shouldResetDisplay = false;

    updateDisplay();
}


// SUPPRIMER LE DERNIER CHIFFRE
function deleteNumber(): void {

    if (shouldResetDisplay || currentValue === "Erreur") {
        currentValue = "0";
        shouldResetDisplay = false;
    } else {
        currentValue = currentValue.length > 1
            ? currentValue.slice(0, -1)
            : "0";
    }

    updateDisplay();
}


// CALCULER LE POURCENTAGE
function calculatePercent(): void {

    if (currentValue === "Erreur") return;

    currentValue = String(Number(currentValue) / 100);

    updateDisplay();
}


// GESTION DES BOUTONS
buttons.forEach((button: HTMLButtonElement) => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;
        const action = button.dataset.action;
        const selectedOperator = button.dataset.operator;

        if (number !== undefined) {
            appendNumber(number);
        }

        if (selectedOperator !== undefined) {
            chooseOperator(selectedOperator);
        }

        switch (action) {

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteNumber();
                break;

            case "decimal":
                addDecimal();
                break;

            case "percent":
                calculatePercent();
                break;

            case "equals":
                calculate();
                break;
        }

    });

});


// INITIALISATION
updateDisplay();