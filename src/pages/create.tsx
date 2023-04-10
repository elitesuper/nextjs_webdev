import BasicLayout from '@layouts/BasicLayout'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'

export default function Home() {
  const [lang, setLanguage] = useAtom(language)
  return (
    <BasicLayout title="Create">
      <div className="page">
        <div className="create">
          <div className="header">
            <div>{languagejson[lang].Ican}</div>
            <TextField
              placeholder="What can you do?"
              id="input-with-icon-textfield"
              sx={{
                width: '100%',
                'background-color': 'white',
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="main">
            <div className="feeling">
              <span>{languagejson[lang].Bad}</span>
              <Slider
                value={30}
                color="secondary"
                sx={{
                  display: 'inline',
                  flex: 1,
                  margin: '0 30px',
                }}
              />
              <span>{languagejson[lang].Verygood}</span>
            </div>
            <div className="example">
              <span>{languagejson[lang].Showexample}:</span>
              <div className="item">
                <CameraAltIcon
                  sx={{
                    fontSize: 80,
                  }}
                />
              </div>
              <div className="item">
                <KeyboardVoiceIcon
                  sx={{
                    fontSize: 80,
                  }}
                />
              </div>
              <div className="item">
                <FolderOpenIcon
                  sx={{
                    fontSize: 80,
                  }}
                />
              </div>
            </div>
            <div className="location">
              <LocationOnIcon
                sx={{
                  fontSize: 50,
                  marginRight: '20px',
                }}
              />
              <TextField
                placeholder="Where?"
                id="input-with-icon-textfield"
                sx={{
                  width: '100%',
                  'background-color': 'white',
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="calendar">
              <CalendarMonthIcon
                sx={{
                  fontSize: 50,
                  marginRight: '20px',
                }}
              />
              <TextField
                placeholder="When?"
                id="input-with-icon-textfield"
                sx={{
                  marginRight: '20px',
                }}
                variant="outlined"
              />
              <TextField
                placeholder="how often"
                id="input-with-icon-textfield"
                sx={{
                  marginRight: '20px',
                }}
                variant="outlined"
              />
            </div>
            <div className="timer">
              <AvTimerIcon
                sx={{
                  fontSize: 50,
                  marginRight: '20px',
                }}
              />
              <TextField
                placeholder="from"
                id="input-with-icon-textfield"
                variant="outlined"
                sx={{
                  marginRight: '20px',
                }}
              />
              <span
                style={{
                  marginRight: 20,
                }}>
                -
              </span>
              <TextField
                placeholder="until"
                id="input-with-icon-textfield"
                sx={{
                  marginRight: '20px',
                }}
                variant="outlined"
              />
            </div>
            <TextField
              id="outlined-multiline-static"
              multiline
              sx={{
                width: '100%',
                marginTop: '20px',
              }}
              rows={4}
              placeholder="Description..."
            />
            <div className="actions">
              <Button
                sx={{
                  width: '150px',
                }}
                variant="contained">
                {languagejson[lang].Publish}
              </Button>
              <Button
                sx={{
                  width: '150px',
                }}
                variant="contained"
                disabled>
                {languagejson[lang].Send}
              </Button>
              <Button
                sx={{
                  width: '150px',
                }}
                variant="outlined">
                {languagejson[lang].Save}
              </Button>
            </div>
          </div>
          <div className="list">
            {['Moderate weddings', 'Rent a bike', 'Deliver a package'].map(
              (text) => (
                <div className="item" key={text}>
                  <span className="name">{text}</span>
                  <ChatBubbleOutlineIcon
                    sx={{
                      fontSize: 40,
                      marginLeft: '20px',
                    }}
                  />
                  <SendIcon
                    sx={{
                      fontSize: 40,
                      marginLeft: '20px',
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
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
