export function evaluateExpression(expression) {
  const sanitizedExpression = sanitizeExpression(expression);
  if (sanitizedExpression === null) return "";

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
      default:
        throw new Error("Unknown operator: " + operator);
    }
  }

  for (const token of sanitizedExpression) {
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

function sanitizeExpression(expression) {
  let sanitizedExpression = [];
  let isLastTokenOperator = true;

  for (let i = 0; i < expression.length; i++) {
    if (isDigit(expression[i])) {
      let number = expression[i];
      i++;
      while (i < expression.length && (isDigit(expression[i]) || expression[i] === '.')) {
        number += expression[i];
        i++;
      }
      sanitizedExpression.push(number);
      i--;
      isLastTokenOperator = false;
    } else if (expression[i] === '+' || expression[i] === '-' || expression[i] === '*' || expression[i] === '/') {
      sanitizedExpression.push(expression[i]);
      isLastTokenOperator = true;
    }
  }

  return isLastTokenOperator ? null : sanitizedExpression;
}
