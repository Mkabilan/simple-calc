import { ACTIONS } from "./App"

export default function OperationButton({ dispatch, operation, seq }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation, seq } })
      }
    >
      {operation}
    </button>
  )
}