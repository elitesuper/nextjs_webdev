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
import {language} from "../jotai"
import cookies from "browser-cookies";


export default function SignIn() {
  const [lang, setLanguage] = useAtom(language)
  const { setSnack } = React.useContext(SnackbarContext)
  const router = useRouter()
  const [isLoading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({
    error: '',
    helperText: '',
  })
  
  React.useEffect(() => {
    const ip = cookies.get("user-ip") ?? "";
    const getCountry = async (ip: any) => {
      const response = await fetch(`https://ipapi.co/${ip}/country`)
      const countryCode = await response.text()
      switch (countryCode) {
        case 'RU':
          setLanguage(2)
          break
        case 'DE':
          setLanguage(1)
          break
        case 'UA':
          setLanguage(3)
          break
        default:
          setLanguage(0)
      }

    }
    getCountry(ip)
  }, [])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email: string = formData.get('email') as string
    const password: string = formData.get('password') as string
    // Validation
    if (!email || !email.includes('@')) {
      setErrors({
        error: 'email',
        helperText: 'Email incorrect',
      })
      return
    }
    if (!password) {
      setErrors({
        error: 'password',
        helperText: 'Email incorrect',
      })
      return
    }
    setErrors({
      error: '',
      helperText: '',
    })
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    setLoading(false)
    if (res?.ok && !res.error) {
      console.log("login res=", res)
      setSnack(
        new Snack({
          message: 'Sign in success',
          color: 'success',
          open: true,
        })
      )
      router.replace('/dashboard')
    } else {
      setSnack(
        new Snack({
          message: res?.error as string | 'Something went wrong!',
          color: 'error',
          open: true,
        })
      )
    }
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
          {languagejson[lang].SignIn}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 1,
          }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={languagejson[lang].EmailAddress}
            name="email"
            autoComplete="email"
            autoFocus
            helperText={errors.error === 'email' && errors.helperText}
            error={errors.error === 'email'}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={languagejson[lang].Password}
            type="password"
            id="password"
            autoComplete="current-password"
            helperText={errors.error === 'password' && errors.helperText}
            error={errors.error === 'password'}
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
            }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2" component={NextLink}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
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
