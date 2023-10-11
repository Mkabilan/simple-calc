import { ACTIONS } from "./App"

export default function DigitButton({ dispatch, digit, seq }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit, seq } })}
    >
      {digit}
    </button>
  )
}