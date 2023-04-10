import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert, { type AlertColor } from '@mui/material/Alert'

export default function SimpleSnackbar({
  open = false,
  message = 'Alert message',
  severity = 'success',
}: {
  open?: boolean
  message?: string
  severity?: AlertColor
}) {
  const [isOpen, setOpen] = React.useState(false)
  if (open && !isOpen) {
    setOpen(true)
  }
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '100%',
        }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
