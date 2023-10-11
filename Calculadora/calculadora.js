function onButtonClick() {
    const buttons = document.querySelector(".calc-buttons")
    let result = 0
    let operation = "addition"
    let state = "running"

    buttons.addEventListener("click", (event) => {

        const option = event.target.value

        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(option)) {
            if (state === "finished") {
                result = 0
                updateValue("0", "clear")
                state = "reset"
            }
            updateValue(parseInt(option))
        } else if (option === "backspace") {
            const value = getValue()
            updateValue(value.slice(0, value.length - 1), "backspace")
        } else if (option === "clear") {
            result = 0
            state = "reset"
            updateValue("0", "clear")
        } else if (["addition", "subtraction", "multiplication", "division"].includes(option)) {
            if (state === "reset") {
                result = resolveOperation(result, parseInt(getValue()), "addition")
                state = "running"
            }
            else if (state === "running") {
                result = resolveOperation(result, parseInt(getValue()), operation)
            }
            else if (state === "finished") {
                state = "running"
            }
            operation = option
            updateValue("0", "clear")
        } else if (option === "equal") {
            result = resolveOperation(result, parseInt(getValue()), operation)
            updateValue(result, "equal")
            state = "finished"
        }
    })

}

function updateValue(value, opt = "number") {
    const resultado = document.querySelector(".resultado")

    if (opt === "clear") {
        resultado.innerText = 0
    }
    else if (opt === "backspace"){
        if (resultado.innerText.length === 1) {
            resultado.innerText = 0
        } else {
            resultado.innerText = value
        }
    } 
    else if (resultado.innerText === "0" || opt === "equal"){
        resultado.innerText = value
    } 
    else {
        resultado.innerText += value
    }   
}

function getValue(){
    const resultado = document.querySelector(".resultado")
    return resultado.innerText
}

function resolveOperation(firstValue, secondValue, operation) {
    if (operation === "addition") {
        return firstValue + secondValue
    } 
    else if (operation === "subtraction") {
        return firstValue - secondValue
    }
    else if (operation === "multiplication") {
        return firstValue * secondValue
    }
    else if (operation == "division") {
        if (secondValue !== 0)
            return firstValue / secondValue
    }
}

onButtonClick()