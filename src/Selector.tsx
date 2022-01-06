import { useCallback } from "react"
import { WindowEvent } from "./types"
import { SelectionActionType, SelectionDispatch } from "./useSelectionReducer"

interface SelectorProps {
  current: string | null
  options: string[]
  actionType: SelectionActionType
  dispatch: SelectionDispatch
}

function Selector({ current, options, actionType, dispatch }: SelectorProps): JSX.Element {
  const onSelect = useCallback<(event: WindowEvent) => void>((event: WindowEvent) => {
    dispatch({
      type: actionType,
      choice: event.target.value === "" ? null : event.target.value,
    })
  }, [actionType, dispatch])

  return (
    <select value={current === null ? "" : current} onChange={onSelect}>
      <option value=''>-- choose --</option>
      {options.map(k => <option key={k} value={k}>{k}</option>)}
    </select>
  )
}

export default Selector