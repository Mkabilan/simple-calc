import React, { useReducer, useState } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";
import { evaluateExpression, isDigit } from "./eval";

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
      const calcStackCopy = state.calcStack ? [...state.calcStack] : [];
      const res1 = evaluateExpression(calcStackCopy.concat(payload.digit));
      return {
        ...state,
        calcStack: state.calcStack
          ? state.calcStack.concat(payload.digit)
          : [payload.digit],
        res: res1,
        showSteps: true, // Show steps when digits are added after evaluating
      };

    case ACTIONS.CHOOSE_OPERATION:
      const res2 = state.calcStack
        ? evaluateExpression([...state.calcStack])
        : 0;
      return {
        ...state,
        calcStack: state.calcStack
          ? state.calcStack.concat(payload.operation)
          : [payload.operation],
        res: res2,
        showSteps: true, // Show steps when operators are added after evaluating
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.calcStack) {
        const updatedStack = [...state.calcStack];
        const lastItem = updatedStack.pop();

        if (isDigit(lastItem)) {
          const updatedDigit = String(lastItem).slice(0, -1);
          if (updatedDigit) {
            updatedStack.push(updatedDigit);
          }
        } else if (lastItem) {
          updatedStack.push("");
        }

        return {
          ...state,
          calcStack: updatedStack,
          res: evaluateExpression(updatedStack),
        };
      }
      return state;

    case ACTIONS.EVALUATE:
      if (!state.calcStack) return state;
      const res = evaluateExpression([...state.calcStack]);
      const updatedRes = state.calcStack.length === 1 ? "" : res;
      const newCalcStack = state.calcStack.length === 1 ? [] : [updatedRes];
      return {
        ...state,
        calcStack: newCalcStack,
        res: updatedRes,
        showSteps: false,
      };

    default:
      return state;
  }
}

const getSequence = (calcStack) => {
  let seq = "";
  calcStack.forEach((item) => {
    seq += item + " ";
  });
  return seq;
};

function App() {
  const [{ calcStack = [], res = 0, showSteps = true }, dispatch] = useReducer(
    reducer,
    {}
  );
  const [history, setHistory] = useState([]);

  function clearAll() {
    dispatch({ type: ACTIONS.CLEAR });
    setHistory([]);
  }

  const seq = getSequence(calcStack);
  const isDigitEntered = calcStack.some(isDigit);

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-grid">
          <div className="output">
            {showSteps ? (
              <div className="previous-operand">{seq}</div>
            ) : null}
            <div className="current-operand">{res}</div>
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
          <OperationButton operation="/" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button
            className="span-two"
            onClick={() => {
              setHistory([...history, `${seq} = ${res}`]);
              dispatch({ type: ACTIONS.EVALUATE });
            }}
            disabled={!isDigitEntered}
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
