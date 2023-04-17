import * as React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import {
  PaletteMode,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
} from '@mui/material'
import '../styles/globals.scss'
import '../styles/search.css'
import ColorModeContext from 'context/ColorModeContext'
import { SessionProvider } from 'next-auth/react'
import SnackbarContext, { Snack } from 'context/SnackbarContext'
import { LocalizationProvider } from '@mui/x-date-pickers'
import DateFnsUtils from '@date-io/date-fns'

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = React.useState<PaletteMode>('dark')
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        )
      },
      mode,
    }),
    [mode]
  )

  // Update the theme only if the mode changes
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

  const [snack, setSnack] = React.useState(
    new Snack({
      open: false,
    })
  )

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setSnack(
      new Snack({
        color: snack.color,
        open: false,
      })
    )
  }

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <SnackbarContext.Provider
            value={{
              snack,
              setSnack,
            }}>
            <Head>
              <meta name="description" content="Reson App" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="icon" href="/favicon.png" />
            </Head>
            <Component {...pageProps} />
            <Snackbar
              open={snack.open}
              autoHideDuration={snack.autoHideDuration}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}>
              <Alert
                onClose={handleClose}
                severity={snack.color}
                sx={{
                  width: '100%',
                }}>
                {snack.message || 'A New Message'}
              </Alert>
            </Snackbar>
          </SnackbarContext.Provider>
        </SessionProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </LocalizationProvider>
  )
}
