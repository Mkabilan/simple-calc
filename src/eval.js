export function evaluateExpression(expression) {
  if (isInvalid(expression)) return 0;
  const lastChar = expression[expression.length - 1];
  if (!isDigit(lastChar)) {
    if (lastChar === "*" || lastChar === "/") {
      expression.push("1");
    } else {
      expression.push("0");
    }
  }
  const operandStack = [];
  const operatorStack = [];

  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  const applyOperator = () => {
    const operator = operatorStack.pop();
    const rightOperand = operandStack.pop();
    const leftOperand = operandStack.pop();
    if (operator === "/" && rightOperand === 0) {
      throw new Error("Division by zero");
    }

    switch (operator) {
      case "+":
        operandStack.push(leftOperand + rightOperand);
        break;
      case "-":
        operandStack.push(leftOperand - rightOperand);
        break;
      case "*":
        operandStack.push(leftOperand * rightOperand);
        break;
      case "/":
        operandStack.push(leftOperand / rightOperand);
        break;
    }
  };

  for (const token of expression) {
    if (!isNaN(token)) {
      operandStack.push(parseFloat(token));
    } else if (token in precedence) {
      const currentPrecedence = precedence[token];
      while (
        operatorStack.length > 0 &&
        currentPrecedence <= precedence[operatorStack[operatorStack.length - 1]]
      ) {
        applyOperator();
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    applyOperator();
  }

  if (operandStack.length === 1 && operatorStack.length === 0) {
    return operandStack[0];
  } else {
    throw new Error("Invalid expression");
  }
}

export function isDigit(char) {
  return /^\d+(\.\d*)?$/.test(char);
}

function isInvalid(exp) {
  if (!exp || !isDigit(exp[0] || isDigit(exp[1]))) {
    console.log("Invalid expression");
    return true;
  } else {
    return false;
  }
}