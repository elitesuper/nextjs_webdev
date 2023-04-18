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
import PaymentIcon from '@mui/icons-material/Payment';
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'
import { useState } from 'react'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { SelectChangeEvent } from '@mui/material/Select';


export default function Home() {
  const [lang, setLanguage] = useAtom(language)
  const [slideValue, setSlideValue] = useState(0)
  const [data, setData] = useState([])
  const router = useRouter();

  const[can, setCan] = useState({slideValue:0, when:null, from:null, until:null, desc:"", price:0, payType:0});

  const handleWhenDateChange = (date:any) =>{
    setCan({...can, when:date})
  }
  const handleFromTimeChange = (time:any) =>{
    setCan({...can, from:time})
  }
  const handleUntilTimeChange = (time:any) =>{
    setCan({...can, until:time})
  }
  const handlePayTypeChange = (e:SelectChangeEvent) => {
    setCan({...can, payType: e.target.value})
  }

  const handleClose = () => {
    router.back()
  }

  const submitpublishorsave = () => {
    if(can.desc == "")
      return;
    setData([...data, can])
  }
  return (
    <BasicLayout title={languagejson[lang].CAN}>
      <div className="page">
        <div className="create">
          <div className="header">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleClose}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <TextField
              placeholder="What can you do?"
              id="input-with-icon-textfield"
              sx={{
                width: '100%',
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
              <Typography>{languagejson[lang].Bad}</Typography>
              <Slider
                value={can.slideValue}
                color="secondary"
                sx={{
                  display: 'inline',
                  flex: 1,
                  margin: '0 30px',
                }}
                onChange={e => {
                  if (e && e.target){
                    setCan({...can, slideValue:e.target.value})
                  } 
                }}
              />
              <Typography>{languagejson[lang].Verygood}</Typography>
            </div>
            <div className="example">
              <Typography>{languagejson[lang].Showexample}:</Typography>
              <div className='example-btn-group'>
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
              <Box>
                <CalendarMonthIcon
                  sx={{
                    fontSize: 50,
                    marginRight: '20px',
                  }}
                />
              </Box>
              <Box
                sx={{
                  width:'100%',
                  display:'flex',
                  justifyContent:'space-between'
                }}
              >
                <DatePicker 
                  label="When"
                  value={can.when}
                  onChange={handleWhenDateChange}
                  renderInput={(props) => <TextField sx={{width:'45%'}} {...props} />}
                />
                <TextField
                  sx={{ width:'45%' }}
                  placeholder="how often"
                  id="input-with-icon-textfield"
                  variant="outlined"
                />
              </Box>
            </div>
            <div className="timer">
              <Box>
                <AvTimerIcon
                  sx={{
                    fontSize: 50,
                    marginRight: '20px',
                  }}
                />
              </Box>
              <Box
                sx={{
                  width:'100%',
                  display:'flex',
                  justifyContent:'space-between'
                }}
              >
                <TimePicker
                  value={can.from}
                  onChange={handleFromTimeChange}
                  id="input-with-icon-textfield"
                  variant="outlined"
                  renderInput={(props) => <TextField sx={{
                    width: '45%',
                  }} {...props} />}
                />
                <TimePicker
                  value={can.until}
                  onChange={handleUntilTimeChange}
                  id="input-with-icon-textfield"
                  variant="outlined"
                  renderInput={(props) => <TextField sx={{
                    width: '45%',
                  }} {...props} />}
                />
              </Box>
            </div>
            <div className="timer">
              <Box>
                <PaymentIcon
                  sx={{
                    fontSize: 50,
                    marginRight: '20px',
                  }}
                />
              </Box>
              <Box
                sx={{
                  width:'100%',
                  display:'flex',
                  justifyContent:'space-between'
                }}
              >
                <TextField
                  value={can.price}
                  sx={{
                    width:'45%'
                  }}
                  placeholder="Price"
                  onChange={e=>setCan({...can, price:e.target.value})}
                />
                <FormControl sx={{ width:'45%' }}>
                  <Select
                    value={can.payType}
                    onChange={handlePayTypeChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={0}>per Piece</MenuItem>
                    <MenuItem value={1}>per Hour</MenuItem>
                    <MenuItem value={2}>per Unit</MenuItem>
                    <MenuItem value={3}>for Free</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
