import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { type AlertColor } from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import PlaceIcon from '@mui/icons-material/Place'
import React from 'react'
import CenterLayout from '@layouts/CenterLayout'
import Image from 'next/image'
import {
  Backdrop,
  ButtonBase,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { MINIMAL_PASSWORD_LENGTH } from '@constants/UserSignup'
import SnackbarContext, { Snack } from 'context/SnackbarContext'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import SettingData from '@constants/Setting.json'
import { Dialog, DialogTitle, Divider, ListItemButton } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { useAtom } from 'jotai'
import languagejson from "../language.json"
import {language, tempEmailJot} from "../jotai"

export interface SimpleDialogProps {
  open: boolean
  selectedValue: number
  onClose: (value: number) => void
}

function SimpleDialog(props: SimpleDialogProps) {
  const [lang, setLanguage] = useAtom(language)
  const { onClose, selectedValue, open } = props
  const { name: title, options } = SettingData[lang][0]

  const handleClose = () => {
    onClose(selectedValue)
  }

  const handleListItemClick = (value: number) => {
    onClose(value)
  }


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {options.map((option, i) => (
          <ListItem key={option + i} disableGutters>
            <ListItemButton onClick={() => handleListItemClick(i)}>
              <ListItemText primary={option} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

async function createUser(userData: object) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      status: 'error',
      data: data.message || 'Something went wrong!',
    }
  }

  return {
    status: 'success',
    data: 'New User created!',
  }
}

export default function SignUp() {
  const [lang, setLanguage] = useAtom(language)
  const [tempEmail, setTempEmail] = useAtom(tempEmailJot)
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(0)
  const [options, setOptions] = React.useState(SettingData[lang][0].options)

  const { setSnack } = React.useContext(SnackbarContext)
  const router = useRouter()
  const [isLoading, setLoading] = React.useState(true)
  const [errors, setErrors] = React.useState({
    error: '',
    helperText: '',
  })

  React.useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      } else {
        setLoading(false)
      }
    })
  }, [router])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value: number) => {
    setOpen(false)
    setSelectedValue(value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nickname: string = formData.get('nickname') as string
    const email: string = formData.get('email') as string
    setTempEmail(email)
    const password: string = formData.get('password') as string
    const sex: string = formData.get('sex') as string
    const language: number = selectedValue as number
    console.log(sex)
    const repeatPassword: string = formData.get('repeat-password') as string
    // Validation
    if (!nickname) {
      setErrors({
        error: 'nickname',
        helperText: 'Empty nickname',
      })
      return
    }
    if (!email || !email.includes('@')) {
      setErrors({
        error: 'email',
        helperText: 'Email incorrect',
      })
      return
    }
    if (!password || password.length < MINIMAL_PASSWORD_LENGTH) {
      setErrors({
        error: 'password',
        helperText: 'Password incorrect',
      })
      return
    }
    if (repeatPassword !== password) {
      setErrors({
        error: 'repeat-password',
        helperText: 'Password mismatch',
      })
      return
    }
    setErrors({
      error: '',
      helperText: '',
    })
    setLoading(true)
    // Await for data for any desirable next steps
    const res = await createUser({
      email,
      password,
      nickname,
      birthday,
      sex,
      language
    })
    setLoading(false)
    setSnack(
      new Snack({
        message: res.data,
        color: res.status as AlertColor,
        open: true,
      })
    )
    if (res.status === 'success') {
      router.replace('/dashboard')
    }
  }
  const [birthday, setBirthday] = React.useState<Dayjs | null>(
    dayjs('2014-08-18T21:11:54')
  )

  const [sex, setSex] = React.useState<String | null>('')

  const handleChange = (newValue: Dayjs | null) => {
    setBirthday(newValue)
  }

  const handleChangeSex = (val: string | null) => {
    setSex(val)
  }

  return (
    <CenterLayout title="SignUp">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography component="h1" variant="h5">
          {languagejson[lang].WelcometoReson}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="nickname"
                label="Nickname"
                name="nickname"
                autoComplete="given-name"
                helperText={errors.error === 'nickname' && errors.helperText}
                error={errors.error === 'nickname'}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="diverse"
                name="sex"
                id="sex"
                value={sex}
                onChange = {e => handleChangeSex(e.target.value)}
                row={true}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="female"
                />
                <FormControlLabel
                  value="diverse"
                  control={<Radio />}
                  label="diverse"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={errors.error === 'email' && errors.helperText}
                error={errors.error === 'email'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                helperText={errors.error === 'password' && errors.helperText}
                error={errors.error === 'password'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="repeat-password"
                label="Repeat password"
                type="password"
                id="repeat-password"
                autoComplete="repeat-password"
                helperText={
                  errors.error === 'repeat-password' && errors.helperText
                }
                error={errors.error === 'repeat-password'}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Birth Date"
                  inputFormat="DD/MM/YYYY"
                  value={birthday}
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField required fullWidth {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              alignSelf: 'center',
            }}>
            {languagejson[lang].SignUp}
          </Button>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <ButtonBase
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}>
              <PlaceIcon
                sx={{
                  fontSize: 80,
                }}
              />
              <Typography>{languagejson[lang].Position}</Typography>
            </ButtonBase>
            <ButtonBase
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick = {handleClickOpen}
              >
              <Image
                src="/images/language.png"
                alt="language"
                width={80}
                height={80}
              />
              <Typography>{options[selectedValue]}</Typography>
            </ButtonBase>
          </Box>
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
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </CenterLayout>
  )
}
