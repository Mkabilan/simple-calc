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
      const lastDig = calcStackCopy.pop();
      if(isDigit(lastDig)) {
        const res1 = state.calcStack
        ? evaluateExpression(calcStackCopy.concat(lastDig + payload.digit))
        : 0;
        return {
          ...state,
          calcStack: state.calcStack
            ? state.calcStack.slice(0, -1).concat(lastDig + payload.digit)
            : [payload.digit],
            res: res1,
        };
      }

      const res1 = state.calcStack
        ? evaluateExpression([...state.calcStack.concat(payload.digit)])
        : 0;
      return {
        ...state,
        calcStack: state.calcStack
          ? state.calcStack.concat(payload.digit)
          : [payload.digit],
        res: res1,
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
      };

    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      const _stack = state.calcStack ? state.calcStack.slice(0, -1) : [];
      return {
        ...state,
        calcStack: _stack,
        res: evaluateExpression([..._stack]),
      };

    case ACTIONS.EVALUATE:
      if(!state.calcStack) return state;
      const res = evaluateExpression([...state.calcStack]);
      return {
        ...state,
        res: res,
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
  const [{ calcStack = [], res = 0 }, dispatch] = useReducer(reducer, {});
  const [history, setHistory] = useState([]);
  const calcStackCopy = calcStack ? [...calcStack] : [];
  const disable = calcStack.length === 0 || !isDigit(calcStackCopy.pop());
  
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
            <div className="previous-operand">{seq}</div>
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
          <OperationButton operation="/" dispatch={dispatch} disabled={disable} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} disabled={disable} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} disabled={disable} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} disabled={disable} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button
            className="span-two"
            onClick={() => {
              setHistory([...history, `${seq} = ${res}`]);
            }}
            disabled={!isDigitEntered} // Disable "=" button if no digit entered
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