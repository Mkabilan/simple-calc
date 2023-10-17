import React, { useReducer, useState } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      const seqDigit = payload.seq + payload.digit;
      let newRealTimeResult; 

      if (payload.digit === "0" && state.currentOperand === "0") {
        newRealTimeResult = evaluate({
          currentOperand: seqDigit,
          previousOperand: state.previousOperand,
          operation: state.operation,
        });
        return { ...state, seq: seqDigit, realTimeResult: newRealTimeResult };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        newRealTimeResult = evaluate({
          currentOperand: seqDigit,
          previousOperand: state.previousOperand,
          operation: state.operation,
        });
        return { ...state, seq: seqDigit, realTimeResult: newRealTimeResult };
      }

      const currentOperand = state.currentOperand || "";
      const newCurrentOperand = `${currentOperand}${payload.digit}`;
      const newSeq = seqDigit;

      newRealTimeResult = evaluate({
        currentOperand: newCurrentOperand,
        previousOperand: state.previousOperand,
        operation: state.operation,
      });

      return {
        ...state,
        currentOperand: newCurrentOperand,
        seq: newSeq,
        realTimeResult: newRealTimeResult,
      };

      case ACTIONS.CHOOSE_OPERATION:
        const seqOp = payload.seq + " " + payload.operation + " ";
        
        if (state.currentOperand == null && state.previousOperand == null) {
          return { ...state, seq: seqOp, operation: payload.operation };
        }
      
        if (state.currentOperand == null) {
          // If there's no current operand, just update the operation and the sequence.
          return { ...state, operation: payload.operation, seq: seqOp };
        }
      
        if (state.previousOperand == null) {
          // If there's no previous operand, set the current operand as the previous operand,
          // clear the current operand, and update the operation and sequence.
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
            seq: seqOp,
          };
        }
      
        // If there are both operands and an operation, calculate the result and store it as the previous operand.
        const newRealTimeResultOp = evaluate({
          currentOperand: state.currentOperand,
          previousOperand: state.previousOperand,
          operation: state.operation,
        });
      
        return {
          ...state,
          previousOperand: newRealTimeResultOp,
          operation: payload.operation,
          currentOperand: null,
          seq: seqOp,
          realTimeResult: newRealTimeResultOp,
        };
      

    case ACTIONS.CLEAR:
      return {};
      case ACTIONS.DELETE_DIGIT:
        if (state.seq == null) return state;
        if (state.seq.length === 1) {
          return { ...state, seq: null, realTimeResult: null };
        }
      
        const newSeqForDelete = state.seq.slice(0, -1);
        const currentDigits = newSeqForDelete.split(" ").pop();
      
        const newRealTimeResultForDelete = evaluate({
          currentOperand: currentDigits,
          previousOperand: state.previousOperand,
          operation: state.operation,
        });
      
        return {
          ...state,
          seq: newSeqForDelete,
          realTimeResult: newRealTimeResultForDelete,
        };
      

      case ACTIONS.EVALUATE:
        if (
          state.operation == null ||
          state.currentOperand == null ||
          state.previousOperand == null
        ) {
          return state;
        }
        const result = evaluate(state);
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: result,
          seq: result,
          realTimeResult: null,
          showResult: true,
        };
      

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      return "";
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return "";
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation, seq = "", realTimeResult }, dispatch] =
    useReducer(reducer, {});
  const [history, setHistory] = useState([]);

  function clearAll() {
    dispatch({ type: ACTIONS.CLEAR });
    setHistory([]);
  }

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">{seq}</div>
            <div className="current-operand">{realTimeResult}</div>
          </div>
          <button
            className="span-two"
            onClick={() => {
              setHistory([...history, "AC"]);
              dispatch({ type: ACTIONS.CLEAR });
            }}
          >
            AC
          </button>
          <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
            DEL
          </button>
          <OperationButton operation="÷" dispatch={dispatch} seq={seq} />
          <DigitButton digit="1" dispatch={dispatch} seq={seq} />
          <DigitButton digit="2" dispatch={dispatch} seq={seq} />
          <DigitButton digit="3" dispatch={dispatch} seq={seq} />
          <OperationButton operation="*" dispatch={dispatch} seq={seq} />
          <DigitButton digit="4" dispatch={dispatch} seq={seq} />
          <DigitButton digit="5" dispatch={dispatch} seq={seq} />
          <DigitButton digit="6" dispatch={dispatch} seq={seq} />
          <OperationButton operation="+" dispatch={dispatch} seq={seq} />
          <DigitButton digit="7" dispatch={dispatch} seq={seq} />
          <DigitButton digit="8" dispatch={dispatch} seq={seq} />
          <DigitButton digit="9" dispatch={dispatch} seq={seq} />
          <OperationButton operation="-" dispatch={dispatch} seq={seq} />
          <DigitButton digit="." dispatch={dispatch} seq={seq} />
          <DigitButton digit="0" dispatch={dispatch} seq={seq} />
          <button
            className="span-two"
            onClick={() => {
              if (
                currentOperand != null &&
                previousOperand != null &&
                operation != null
              ) {
                const calc = `${seq} = ${formatOperand(
                  evaluate({ currentOperand, previousOperand, operation })
                )}`;
                setHistory([...history, calc]);
              }
              dispatch({ type: ACTIONS.EVALUATE });
            }}
          >
            =
          </button>
        </div>
      </div>
      <div className="history">
        <h2>History</h2>
        <ul>
          {history.map((calculation, index) => (
            <li key={index}>{calculation}</li>
          ))}
        </ul>
        <button onClick={clearAll}>Clear All</button>
      </div>
    </div>
        
  );
}

export default App;



// corrected code