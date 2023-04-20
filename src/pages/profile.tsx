import { useEffect } from 'react'
import FullLayout from '@layouts/FullLayout/FullLayout'
import MenuIcon from '@mui/icons-material/Menu'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { NextApiRequest } from 'next'
import { green } from '@mui/material/colors'
import ButtonGroup from '@mui/material/ButtonGroup'
import InputAdornment from '@mui/material/InputAdornment'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import Link from 'next/link'
import { Collapse } from '@mui/material'
import React from 'react'
import { ArrowDropDown, ArrowLeft } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'
import SnackbarContext, { Snack } from 'context/SnackbarContext'
import { type AlertColor } from '@mui/material/Alert'
import { Fade, ListItemIcon, Menu, MenuItem } from '@mui/material'
import * as MenuData from '@constants/Menu.json'
import {StatusData} from '@constants/Status'
import { getSession, signOut } from 'next-auth/react'

const { data: MenuDatas } = MenuData



import ImageUploader from '../components/elements/ImageUploader'

export default function Profile() {
  const [lang, setLanguage] = useAtom(language)
  const energy = 54
  const opportunity = 21


  const { setSnack } = React.useContext(SnackbarContext)
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [telephone, setTelephone] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [profession, setProfession] = React.useState('')
  const [education, setEducation] = React.useState('')
  const [hobby, setHobby] = React.useState('')
  const [carExist, setCarExist] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [status, setStatus] = React.useState(0)


  const topen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  useEffect(()=>{
      
    getpic();

  },[])

  const handleChange = () => {
    setOpen(!open)
  }

  const saveProfile = () => {

    let userData = {
      email,
      firstName,
      lastName,
      company,
      telephone,
      address,
      profession,
      education,
      hobby,
      carExist
    }

    updateUser(userData)
  }

  const analyze = async () => {
    const response = await fetch('/api/number_analysis/number', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }


  
 function getpic (){
  loadpic()
}

async function loadpic () {
  await fetch('api/user/currentUser').then(res=>res.json()).then(
    res => {
      setEmail(res.data[0].email || "");
      setFirstName(res.data[0].firstName || "");
      setLastName(res.data[0].lastName || "");
      setCompany(res.data[0].company || "");
      setTelephone(res.data[0].telephone || "");
      setAddress(res.data[0].address || "");
      setProfession(res.data[0].profession || "");
      setEducation(res.data[0].education || "");
      setHobby(res.data[0].hobby || "");
      setStatus(parseInt(res.data[0].status) || 0);
      setStatus(res.data[0].carExist || "");
    }
  ).catch(
    err =>{
      
    }
  )
}
  async function updateUser(userData: object) {
    const response = await fetch('/api/profile/profile', {
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
  

    
    setSnack(
      new Snack({
        message: "Profile saved successfully",
        color: "success" as AlertColor,
        open: true,
    }));

    // return {
    //   status: 'success',
    //   data: 'Profile saved successfully.',
    // }

  }

  return (
    <FullLayout title="Profile" appbar={false}>
      <Box
        sx={{
          m: 2,
          textAlign: 'center',
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
         <IconButton LinkComponent={Link} href="/settings">
            <Image
              src="/images/setting.png"
              alt="setting"
              width={50}
              height={50}
            />
          </IconButton>
          
          <Typography
            sx={{
              fontSize: 30,
            }}>
            {`${firstName} ${lastName}`}
          </Typography>
          <IconButton onClick={handleClick}>
            <Image src="/images/menu.png" alt="menu" width={50} height={50} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={topen}
            onClose={handleClose}
            TransitionComponent={Fade}>
            {MenuDatas.map(
              ({ name, href }, i) =>
                i !== 2 && (
                  <MenuItem key={name[0]} dense>
                    <Box
                      component={Link}
                      href={href}
                      sx={{ display: 'inherit' }}>
                      <ListItemIcon>
                        <Image
                          src={`/images/${name[0]}.png`}
                          alt={name[lang]}
                          width={20}
                          height={20}
                        />
                      </ListItemIcon>
                      {name[lang]}
                    </Box>
                  </MenuItem>
                )
            )}
            <MenuItem dense onClick={() => signOut()}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
        <Box
          sx={{
            position: 'relative',
          }}>
          <Box
            sx={{
              background: 'white',
              borderRadius: 2,
              border: '1px solid black',
              padding: '12px',
              display: 'inline-grid',
              width: '300px',
            }}>
            {/* <Image
              src="/images/avatar.png"
              alt="avatar"
              width={150}
              height={150}
            /> */}
            <ImageUploader />
          </Box>
          <Box
            sx={{
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 12,
              height: '150px',
              width: 24,
              backgroundImage: 'url(/images/statusbar.png)',
              backgroundSize: '100% 100%',
            }}>
            <Typography
              sx={{
                transform: 'rotate(90deg)',
                fontSize: 18,
              }}>
              {languagejson[lang].OPPORTUNITY}
            </Typography>
            <Typography
              sx={{
                width: '42px',
                lineHeight: '28px',
                backgroundColor: 'rgb(227,171,177)',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0 6px 6px 0',
                position: 'absolute',
                bottom: `calc(${opportunity}% - 14px)`,
                left: 38,
                paddingLeft: '-2px',
                '&::after': {
                  content: '" "',
                  position: 'absolute',
                  left: '-14px',
                  top: '0',
                  marginLeft: '-14px',
                  borderWidth: '14px',
                  borderStyle: 'solid',
                  borderColor:
                    'transparent rgb(227,171,177) transparent transparent',
                },
              }}>
              {opportunity}%
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 12,
              top: 0,
              height: '150px',
              width: 24,
              backgroundImage: 'url(/images/statusbar.png)',
              backgroundSize: '100% 100%',
            }}>
            <Typography
              sx={{
                transform: 'rotate(-90deg)',
                fontSize: 18,
              }}>
              {languagejson[lang].ENERGY}
            </Typography>
            <Typography
              sx={{
                width: '42px',
                lineHeight: '28px',
                backgroundColor: green[200],
                color: 'black',
                textAlign: 'center',
                borderRadius: '6px 0 0 6px',
                position: 'absolute',
                bottom: `calc(${energy}% - 14px)`,
                right: 38,
                '&::after': {
                  content: '" "',
                  position: 'absolute',
                  left: 'calc(100% + 14px)',
                  top: '0',
                  marginLeft: '-14px',
                  borderWidth: '14px',
                  borderStyle: 'solid',
                  borderColor: `transparent transparent transparent ${green[200]}`,
                },
              }}>
              {energy}%
            </Typography>
          </Box>

            <Typography>{StatusData.mydata[0].name[lang]}</Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                mt: 2,
              }}
              LinkComponent={Link}
              href="/property"
              onClick={analyze}
              >
              {languagejson[lang].Seeyourindividualanalysis}
            </Button>
            <div>
              <Button
                variant="text"
                size="large"
                onClick={handleChange}
                endIcon={open ? <ArrowLeft /> : <ArrowDropDown />}>
                {languagejson[lang].Completetheinformation}
              </Button>
            </div>
            <Collapse in={open}>
              <TextField fullWidth value={email} margin="normal" label="Email" onChange={e => {setEmail(e.target.value)}}/>
              <TextField fullWidth value={firstName} margin="normal" label="Firstname" onChange={e => {setFirstName(e.target.value)}}/>
              <TextField fullWidth value={lastName} margin="normal" label="Surname" onChange={e => {setLastName(e.target.value)}}/>
              <TextField
                fullWidth
                margin="normal"
                label="Firma"
                value={company}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={e => {setCompany(e.target.value)}}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Telephone number"
                value={telephone}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ChatBubbleOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={e => {setTelephone(e.target.value)}}
              />
              <TextField fullWidth value={address} margin="normal" label="Address" onChange={e => {setAddress(e.target.value)}}/>
              <TextField fullWidth value={profession} margin="normal" label="Profession" onChange={e => {setProfession(e.target.value)}}/>
              <TextField fullWidth value={education} margin="normal" label="Education" onChange={e => {setEducation(e.target.value)}}/>
              <TextField fullWidth value={carExist} margin="normal" label="Do you have Car" onChange={e => {setCarExist(e.target.value)}}/>
              <TextField fullWidth value={hobby} margin="normal" label="Hobby" onChange={e => {setHobby(e.target.value)}}/>
              <ButtonGroup variant="contained" sx={{ mt: 2 }} fullWidth>
                <Button onClick={saveProfile}>{languagejson[lang].Savechanges}</Button>
                <Button>{languagejson[lang].Jointheclub}</Button>
                <Button>{languagejson[lang].BuyReson}</Button>
              </ButtonGroup>
            </Collapse>
        </Box>
        
      </Box>
    </FullLayout>
  )
}

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({
    req,
  })

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
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
