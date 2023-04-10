import React from 'react'
import { type AlertColor } from '@mui/material/Alert'

const AUTOHIDE_DURATION = 6000

class Snack {
  message?: string
  color?: AlertColor
  autoHideDuration?: number
  open: boolean

  constructor(data: Snack) {
    this.message = data.message || ''
    this.color = data.color || 'info'
    this.autoHideDuration = data.autoHideDuration || AUTOHIDE_DURATION
    this.open = data.open
  }
}

export { Snack }

type SnackDefaultValue = {
  snack: Snack
  setSnack: React.Dispatch<React.SetStateAction<Snack>>
}

export default React.createContext<SnackDefaultValue>({
  snack: new Snack({
    open: false,
  }),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSnack: () => {},
})
