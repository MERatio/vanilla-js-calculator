// DOM nodes reference
const previousOperandText = document.querySelector('.previous-operand');
const currentOperandText = document.querySelector('.current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const plusButton = document.querySelector('.add');
const decimalButton = document.querySelector('.decimal');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const equalsButton = document.querySelector('.equals');

// Global variables
let previousOperand = '';
let currentOperand = '0';
let currentOperator = '';
let isLimit = false;

function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(num1, num2, operator) {
  if (operator === '+') {
    return add(num1, num2);
  } else if (operator === '-') {
    return subtract(num1, num2);
  } else if (operator === 'x') {
    return multiply(num1, num2);
  } else {
    return divide(num1, num2);
  }
}

function handleNumbers(e) {
  if (isLimit) return;

  if (currentOperand.length >= 20) {
    handleLimit('Max Limit');
  } else {
    let number = e.target.textContent.toString();
    if (currentOperand.length <= 1 && currentOperand === '0') {
      if (number === '0') {
        return;
      } else {
        currentOperand = '';
        currentOperandText.textContent = '';
      }
    }
    currentOperand += number;
    currentOperandText.textContent += number;
  }
}

function handleDecimal() {
  if (isLimit || currentOperand.includes('.')) return;
  if (currentOperand.length >= 20) {
    handleLimit('Max Limit');
  } else if (currentOperand === '0') {
    currentOperand = '0.';
    currentOperandText.textContent = '0.';
  } else {
    currentOperand += '.';
    currentOperandText.textContent += '.';
  }
}

function handleOperators(e) {
  if (isLimit) return;

  let operator = e.target.textContent;

  if (!isNaN(previousOperand) && !isNaN(currentOperand)) {
    handleEquals();
  }

  if (isLimit) return;

  previousOperand = currentOperand;
  previousOperandText.textContent = `${formatNumber(
    parseFloat(currentOperand),
    2
  )} ${operator}`;
  currentOperand = '0';
  currentOperandText.textContent = '0';
  currentOperator = operator;
}

function handleEquals() {
  if (!isCompleteExpression() || isLimit) return;

  if (currentOperand === '0' && currentOperator === '÷') {
    if (previousOperand === '0') {
      handleLimit('Error');
    } else {
      handleLimit('To Infinity and Beyond');
    }
  } else {
    let output = operate(
      parseFloat(previousOperand),
      parseFloat(currentOperand),
      currentOperator
    );

    console.log(previousOperand, currentOperand, currentOperator);

    if (output.toString().length >= 20) {
      handleLimit('Max Limit');
    } else {
      let formattedOutput = formatNumber(output, 2).toString();
      previousOperand = '';
      previousOperandText.textContent = '';
      currentOperand = output.toString();
      currentOperandText.textContent = formattedOutput;
    }
  }
}

function handleDelete() {
  if (isLimit) {
    return;
  } else if (currentOperand.length === 1) {
    currentOperand = '0';
    currentOperandText.textContent = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
    currentOperandText.textContent = currentOperand;
  }
}

function handleLimit(msg) {
  previousOperandText.textContent = '';
  currentOperandText.textContent = msg;
  isLimit = true;
}

function isCompleteExpression() {
  return previousOperand && currentOperand && currentOperator;
}

function init() {
  previousOperand = '';
  previousOperandText.textContent = '';
  currentOperand = '0';
  currentOperandText.textContent = '0';
  currentOperator = '';
  isLimit = false;
}

// Format a number, add correct comma in numbers and the maximum decimal digits
function formatNumber(num, maximumFractionDigits) {
  return num.toLocaleString('en-US', { maximumFractionDigits });
}

// Click event listeners
numberButtons.forEach(numberButton =>
  numberButton.addEventListener('click', handleNumbers)
);
operatorButtons.forEach(operatorButton =>
  operatorButton.addEventListener('click', handleOperators)
);
decimalButton.addEventListener('click', handleDecimal);
equalsButton.addEventListener('click', handleEquals);
clearButton.addEventListener('click', init);
deleteButton.addEventListener('click', handleDelete);

// Keydown event listener / Keyboard support
window.addEventListener('keydown', e => {
  let keyCode = e.which || e.keyCode;
  // If keyCode is enter key
  if (keyCode === 13) {
    equalsButton.click();
  } else {
    document.activeElement.blur(); // Remove the focused element
  }
  // If the key is =
  if (keyCode === 61) {
    // If the shift key is pressed/hold
    if (e.shiftKey) {
      plusButton.click();
    } else {
      equalsButton.click();
    }
  } else {
    let key = document.querySelector(`[data-key="${keyCode}"]`);
    key ? key.click() : undefined;
  }
});

init();
