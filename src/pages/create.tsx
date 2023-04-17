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
import { useState } from 'react'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import '../styles/create.css'


export default function Home() {
  const [lang, setLanguage] = useAtom(language)
  const [slideValue, setSlideValue] = useState(0)
  const [data, setData] = useState([])

  const[can, setCan] = useState({slideValue:0, when:null, from:null, until:null, desc:""});

  const handleWhenDateChange = (date:any) =>{
    setCan({...can, when:date})
  }
  const handleFromTimeChange = (time:any) =>{
    setCan({...can, from:time})
  }
  const handleUntilTimeChange = (time:any) =>{
    setCan({...can, until:time})
  }

  const submitpublishorsave = () => {
    if(can.desc == "")
      return;
    setData([...data, can])
  }
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
                color:'black !important',
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
                value={slideValue}
                color="secondary"
                sx={{
                  display: 'inline',
                  flex: 1,
                  margin: '0 30px',
                }}
                onChange={e=>setCan({...can, slideValue:e.target.value})}
              />
              <span>{languagejson[lang].Verygood}</span>
            </div>
            <div className="example">
              <span>{languagejson[lang].Showexample}:</span>
              <div className="item create_example_btn" onClick={()=>{alert("Voice Open")}}>
                <CameraAltIcon
                  sx={{
                    fontSize: 80,
                  }}
                />
              </div>
              <div className="item create_example_btn" onClick={()=>{alert("Voice Open")}}>
                <KeyboardVoiceIcon
                  sx={{
                    fontSize: 80,
                  }}
                />
              </div>
              <div className="item create_example_btn" onClick={()=>{alert("Folder Open")}}>
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
              <DatePicker 
                label="When"
                value={can.when}
                onChange={handleWhenDateChange}
                renderInput={(props) => <TextField sx={{
                  marginRight: '20px',
                  // border:'solid 2px gray',
                }} {...props} />}
              />
              <TextField
                placeholder="how often"
                id="input-with-icon-textfield"
                sx={{
                  marginRight: '20px'
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
              <TimePicker
                value={can.from}
                onChange={handleFromTimeChange}
                id="input-with-icon-textfield"
                variant="outlined"
                renderInput={(props) => <TextField sx={{
                  marginRight: '20px',
                  // border:'solid 2px gray',
                }} {...props} />}
              />
              <span
                style={{
                  marginRight: 20,
                }}>
                -
              </span>
              <TimePicker
                value={can.until}
                onChange={handleUntilTimeChange}
                id="input-with-icon-textfield"
                variant="outlined"
                renderInput={(props) => <TextField sx={{
                  marginLeft: '20px',
                  // border:'solid 2px gray',
                }} {...props} />}
              />
            </div>
            <TextField
              value={can.desc}
              onChange={e=>{setCan({can, desc:e.target.value})}}
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
                onClick={()=>{submitpublishorsave()}}
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
            {data.length > 0 && data.map(
              (item, index) => (
                <div className="item" key={index}>
                  <span className="name">{item.desc}</span>
                  <ChatBubbleOutlineIcon
                    sx={{
                      fontSize: 40,
                      marginLeft: '20px',
                      cursor:'pointer'
                    }}
                    onClick={()=>{alert("Chat!")}}
                  />
                  <SendIcon
                    sx={{
                      fontSize: 40,
                      marginLeft: '20px',
                      cursor:'pointer'
                    }}
                    onClick={()=>{alert("Send!")}}
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
