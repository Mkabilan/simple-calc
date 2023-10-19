import { ACTIONS } from "./App";

export default function OperationButton({ dispatch, operation, disabled }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
      disabled={disabled}
    >
      {operation}
    </button>
  );
}