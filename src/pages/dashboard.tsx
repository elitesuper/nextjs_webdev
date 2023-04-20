import { getSession, useSession, signOut, } from 'next-auth/react'
import BasicLayout from '@layouts/BasicLayout'
import Box from '@mui/material/Box'
import Image from 'next/image'
import Typography from '@mui/material/Typography'
import CssBaseline from '@mui/material/CssBaseline'
import { NextApiRequest } from 'next'
import { green } from '@mui/material/colors'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import ButtonBase from '@mui/material/ButtonBase'
import { Fade, ListItemIcon, Menu, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import * as MenuData from '@constants/Menu.json'
import { useSwipe } from 'hooks/useSwipe'
import { useRouter } from 'next/router'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'
import Draggable from 'react-draggable'


const { data: MenuDatas } = MenuData

export default function Home() {
  const { data: session } = useSession()
  const [lang, setLanguage] = useAtom(language)
  const energy = 54
  const opportunity = 21
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  // const [isDragging, setDragging] = React.useState(false)
  // const startDrag = () => {
  //     setDragging(true)
  //   },
  //   stopDrag = () => {
  //     setDragging(false)
  //   }

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const router = useRouter()
  const { isDragging } = useSwipe({
    up: () => {
      router.push('/create')
    },
    down: () => {
      router.push('/search')
    },
    left: () => {
      router.push('/calendar')
    },
    right: () => {
      router.push('/messages')
    },
  })

  const routerToProfile = () =>{
    router.push('/profile')
  }

  const fakeContacts = [
      {
        fistname: "Thomas",
        lastname: "Jefferson",
        telephone: 1111111111111,
        address: "white house 2"
      },
      {
        fistname: "George",
        lastname: "Washinton",
        telephone: 222222222222,
        address: "white house 1"
      }
    ]

  useEffect(() => {
    // Todo
    
    const getCurrentSetting = async () => {
      const response = await fetch('/api/setting/currentSetting', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      let settingData = await response.json()
      localStorage.setItem('language', settingData.data[0].language)
      setLanguage(settingData.data[0].language)
    }
    
    getCurrentSetting()
    
  }, [])
  
  const handleDragStart = () => {

  }

  const ImportContacts = async () => {
    const response = await fetch('/api/contact/contact', {
      method: 'POST',
      body: JSON.stringify(fakeContacts),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return (
    <BasicLayout title="Dashboard">
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 1,
        }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            visibility: isDragging ? 'hidden' : 'visible',
          }}>
          {/* <IconButton /* LinkComponent={Link} href="/profile"> */}
          <IconButton LinkComponent={Link} href="/settings">
            <Image
              src="/images/setting.png"
              alt="setting"
              width={50}
              height={50}
            />
          </IconButton>
          {/* <IconButton LinkComponent={Link} href="/property"> */}
          <IconButton onClick={handleClick}>
            <Image src="/images/menu.png" alt="menu" width={50} height={50} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
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
              {languagejson[lang].signOut}
            </MenuItem>
          </Menu>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            textAlign: 'center',
            position: 'relative',
            flexDirection: 'column',
          }}>
          <ButtonBase href="/search" LinkComponent={Link}>
            <Typography
              variant="h4"
              sx={{
                opacity: isDragging ? 1 : 0.5,
              }}>
              {languagejson[lang].NEED}
            </Typography>
          </ButtonBase>

          {isDragging && (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                src="/images/arrow.png"
                alt="left"
                width={100}
                height={100}
                style={{
                  transform: 'rotate(90deg)',
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 12,
              height: '100%',
              width: 24,
              backgroundImage: 'url(/images/statusbar.png)',
              backgroundSize: '100% 100%',
              visibility: isDragging ? 'hidden' : 'visible',
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <IconButton LinkComponent={Link} href="/messages">
            <Badge badgeContent={7} color="error">
              <Image src="/images/mail.png" alt="mail" width={50} height={50} />
            </Badge>
          </IconButton>
          {isDragging && (
            <Image src="/images/arrow.png" alt="left" width={50} height={50} />
          )}
          <Draggable>
            <Box
              draggable 
              onDragStart={()=> handleDragStart()} 
              sx={{
                height: 50,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButton onClick={()=>routerToProfile()}>
                <Image
                  src="/images/main.png"
                  alt="main"
                  width={100}
                  height={100}
                />
              </IconButton>
              <Typography
                variant="h2"
                sx={{
                  position: 'absolute',
                  color: 'white',
                }}>
                I
              </Typography>
            </Box>
          </Draggable>

          {isDragging && (
            <Image
              src="/images/arrow.png"
              alt="left"
              width={50}
              height={50}
              style={{ transform: 'rotate(180deg)' }}
            />
          )}
          <IconButton LinkComponent={Link} href="/calendar">
            <Image
              src="/images/calendar.png"
              alt="calendar"
              width={50}
              height={50}
            />
          </IconButton>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column-reverse',
            textAlign: 'center',
            position: 'relative',
          }}>
          <ButtonBase href="/create" LinkComponent={Link}>
            <Typography
              variant="h4"
              sx={{
                opacity: isDragging ? 1 : 0.5,
              }}>
              {languagejson[lang].CAN}
            </Typography>
          </ButtonBase>
          {isDragging && (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                src="/images/arrow.png"
                alt="left"
                width={100}
                height={100}
                style={{
                  transform: 'rotate(-90deg)',
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 12,
              height: '100%',
              width: 24,
              backgroundImage: 'url(/images/statusbar.png)',
              backgroundSize: '100% 100%',
              visibility: isDragging ? 'hidden' : 'visible',
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            visibility: isDragging ? 'hidden' : 'visible',
          }}>
          <IconButton LinkComponent={Link} href="/messages?group=2">
            <Image
              src="/images/contact.png"
              alt="contact"
              width={50}
              height={50}
              onClick={ImportContacts}
            />
          </IconButton>
          <IconButton LinkComponent={Link} href="/projects">
            <Image
              src="/images/create.png"
              alt="create"
              width={50}
              height={50}
            />
          </IconButton>
        </Box>
      </Box>
    </BasicLayout>
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
