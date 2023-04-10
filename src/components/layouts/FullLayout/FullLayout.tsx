import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import BasicLayout from '@layouts/BasicLayout/BasicLayout'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Menubar from '@elements/Menubar'
import { useRouter } from 'next/router'
import {language, modusJot, statusJot, firstnameJot, lastnameJot, emailJot, telephoneJot, personalAnalysisJot} from "../../../jotai"
import { useAtom } from 'jotai'

type FullLayoutProps = {
  children: React.ReactNode
  title?: string
  appbar?: boolean
  menubar?: boolean
}

export default function FullLayout({
  children,
  title = 'Reson App',
  appbar = true,
  menubar = true,
}: FullLayoutProps) {
  const [lang, setLanguage] = useAtom(language)
  const [modus, setModus] = useAtom(modusJot)
  const [status, setStatus] = useAtom(statusJot)
  const [firstname, setFirstname] = useAtom(firstnameJot)
  const [lastname, setLastname] = useAtom(lastnameJot)
  const [email, setEmail] = useAtom(emailJot)
  const [telephone, setTelephone] = useAtom(telephoneJot)
  const [personalAnalysis, setPersonalAnalysis] = useAtom(personalAnalysisJot)

  const router = useRouter()
  const handleClose = () => {
    console.log('damn is damn')
    let settingData = {
      lang, modus, status, firstname, lastname, email, telephone, personalAnalysis
    }
    if (router.pathname.substring(1,router.pathname.length) == 'settings') {
      console.log('fucking is fucking')
      fetch('/api/setting/setting', {
        method: 'POST',
        body: JSON.stringify(settingData),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => console.log(res))
    }
    console.log(router.pathname.substring(1,router.pathname.length))
    router.back()
  }
  return (
    <BasicLayout title={title}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <CssBaseline />
        {appbar && (
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                }}>
                {title}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleClose}>
                <ArrowBackIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}
        <Box
          sx={{
            overflow: 'auto',
            flexGrow: 1,
          }}>
          {children}
        </Box>
        {menubar && <Menubar />}
      </Box>
    </BasicLayout>
  )
}
