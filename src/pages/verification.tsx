import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import NextLink from 'next/link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import CenterLayout from '@layouts/CenterLayout'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import SnackbarContext, { Snack } from 'context/SnackbarContext'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { NextApiRequest } from 'next'
import { useAtom } from 'jotai'
import languagejson from "../language.json"
import {language, tempEmailJot} from "../jotai"
import cookies from "browser-cookies";


export default function SignIn() {
  const [lang, setLanguage] = useAtom(language)
  const [tempEmail, setTempEmail] = useAtom(tempEmailJot)
  const router = useRouter()
  const [verificationCode, setVerificationCode] = React.useState('')
  const [isLoading, setLoading] = React.useState(false)
  const { setSnack } = React.useContext(SnackbarContext)
  
  // React.useEffect(() => {
  //   const ip = cookies.get("user-ip") ?? "";
  //   const getCountry = async (ip: any) => {
  //     const response = await fetch(`https://ipapi.co/${ip}/country`)
  //     const countryCode = await response.text()
  //     switch (countryCode) {
  //       case 'RU':
  //         setLanguage(2)
  //         break
  //       case 'DE':
  //         setLanguage(1)
  //         break
  //       case 'UA':
  //         setLanguage(3)
  //         break
  //       default:
  //         setLanguage(0)
  //     }

  //   }
  //   getCountry(ip)
  // }, [])

  const verify = async() => {
    setLoading(true)
    const v_code = {
      verificationCode,
      tempEmail
    }
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(v_code),
    })
    console.log('res=', response)
    // fetch('/api/auth/verify', {
    //   method: 'POST',
    //   body: JSON.stringify(v_code),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // }).then((res) => {
    //   console.log("res=", res)
      // if (res.data.status == 200) {
      //   router.push('/dashboard')
      //   // console.log('suc')
      //   // setSnack(
      //   //   new Snack({
      //   //     message: 'Verification Success',
      //   //     color: 'success',
      //   //     open: true,
      //   //   })
      //   // )
      // } else {
      //   console.log('fuc')
      //   setSnack(
      //     new Snack({
      //       message: 'Verification Failed',
      //       color: 'error',
      //       open: true,
      //     })
      //   )
      // }
    // })
  }
  return (
    <CenterLayout title="SignIn">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography component="h1" variant="h5">
          {/* {languagejson[lang].SignIn} */}
          Email Verification
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 1,
          }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="v-code"
            value={verificationCode}
            label="Verification Code"
            name="v-code"
            autoComplete="v-code"
            autoFocus
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            sx={{
              display: 'none',
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
            }}
            onClick={e=>verify()}
            >
            Verify
          </Button>
        </Box>
      </Box>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </CenterLayout>
  )
}

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({
    req,
  })

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
