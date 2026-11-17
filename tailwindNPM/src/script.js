"use strict";
// Récupération des éléments HTML
const display = document.getElementById("display");
const previous = document.getElementById("previous");
const buttons = document.querySelectorAll("button");
// Variables de la calculatrice
let currentValue = "0";
let previousValue = "";
let operator = "";
let shouldResetDisplay = false;
// Mettre à jour l'écran
function updateDisplay() {
    display.textContent = currentValue;
    previous.textContent = operator
        ? `${previousValue} ${operator}`
        : "";
}
// Ajouter un nombre
function appendNumber(number) {
    if (currentValue === "Erreur") {
        currentValue = "0";
    }
    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
    }
    else {
        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }
    updateDisplay();
}
// Ajouter une virgule
function addDecimal() {
    if (shouldResetDisplay) {
        currentValue = "0";
        shouldResetDisplay = false;
    }
    if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}
// Choisir un opérateur
function chooseOperator(newOperator) {
    if (currentValue === "Erreur")
        return;
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    previousValue = currentValue;
    operator = newOperator;
    shouldResetDisplay = true;
    updateDisplay();
}
// Effectuer le calcul
function calculate() {
    if (!operator || previousValue === "")
        return;
    const firstNumber = Number(previousValue);
    const secondNumber = Number(currentValue);
    let result;
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
// Réinitialiser
function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    operator = "";
    shouldResetDisplay = false;
    updateDisplay();
}
// Supprimer le dernier caractère
function deleteNumber() {
    if (shouldResetDisplay || currentValue === "Erreur") {
        currentValue = "0";
        shouldResetDisplay = false;
    }
    else {
        currentValue = currentValue.length > 1
            ? currentValue.slice(0, -1)
            : "0";
    }
    updateDisplay();
}
// Calculer le pourcentage
function calculatePercent() {
    if (currentValue === "Erreur")
        return;
    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
}
// Écouter les clics sur les boutons
buttons.forEach((button) => {
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
// Initialisation
updateDisplay();
