import { useState, useEffect, useRef } from "react";
import FullLayout from '@layouts/FullLayout/FullLayout'
import {
  AttachFile as AttachFileIcon,
  CoPresentOutlined,
  Mail as MailIcon,
} from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { NextApiRequest } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'
import io from "socket.io-client";
import { formatTime, timestampToFormattedDate } from "@lib/utils";

let socket:any;

type Message = {
  author: string;
  message: string;
};

type Query = {
  email: string;
};
type MediaType = {
  content: string
  type: string
}

interface MediaViewerProps {
  open: boolean;
  handleClose: () => void;
  content: MediaType;
}


export default function Chat() {
  const router = useRouter()
  const { email } = router.query

  const [lang, setLanguage] = useAtom(language)

  const { data: session } = useSession()

  const [username, setUsername] = useState("");
  const [pic, setPic] = useState("");
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState({content:"", type:""});

  const handleClick = (content, type) => {

    setSelectedContent({content:content, type:type});

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_CHAT_URI);
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');

      // Fetch existing messages from the server
      socket.emit('getMessages', {to:email, author:session?.user.email});
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on('messages', (msgs:any) => {
      setMessages(msgs);
    });
    socket.on('newMessage', (msg:any) => {
      setMessages((prevState) => [...prevState, msg]);
    });
  }, []);

  const sendMessage = (e:any) => {
    e.preventDefault();
    const message = {
      author: session?.user.email,
      type:'text',
      content: inputValue,
      to:email,
      date: timestampToFormattedDate(Date.now()),
      time: formatTime(),
      read: false
    }
    if (!message) return;
    if (inputValue.trim() == '') return;
    socket.emit('sendMessage', message);
    const fetchData = async() => { 
      const responseData = {message:message.content}
      try{
        await fetch('/api/message/message', {
          method: 'POST',
          body: JSON.stringify(responseData),
          headers: {
            'Content-Type': 'application/json',
          },
        })

      } catch (error){
        console.log(error)
      }
    }
  
    fetchData();
    setInputValue('');
  };

  useEffect(() => {
  
      const fetchData = async() => { 
        
        const responseData = {email:email}
        try{
          const response = await fetch('/api/user/getuser', {
            method: 'POST',
            body: JSON.stringify(responseData),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const res = await response.json();

          setPic(res.data[0].picpath)

        } catch (error){
          console.log(error)
        }
    }
    
    fetchData();
  }, [])
  const CheckDate = (message, messages, i) => {

    if(messages[i-1] === undefined){
      return message.date
    }
    if(messages[i-1].date ==! messages.date){
      return messages.date
    }
  }
  const handleClipboardPaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (!blob) return;
        await asyncupload(blob);
      }
    }
  };

  async function asyncupload(file:any) {
    const data = await file.arrayBuffer();
    const xhr = new XMLHttpRequest(); 
    xhr.upload.onprogress = (event) => {
      const percentCompleted = Math.round((event.loaded * 100) / event.total);
      console.log('Upload Progress: ' + percentCompleted + '%');
    };
  
    xhr.open('POST', '/api/upload');
  
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = () => {
      if (xhr.status === 200) {
  
        const response = JSON.parse(xhr.response) 

        const message = {
          author: session?.user.email,
          type:'media',
          filetype: response.type,
          content: response.data,
          to:email,
          date: timestampToFormattedDate(Date.now()),
          time: formatTime(),
          read: false
        }
        socket.emit('sendMessage', message);
        
      } else {
        console.error('Failed to upload file');
      }
    };
    
    xhr.send(JSON.stringify({
      name: file.name,
      type: 'chat',
      data: Array.from(new Uint8Array(data)),
    }));
  }
  
  const messageElement = (type, content, time, filetype) => {
    return <div>
      {type == "media" ? 
        (filetype == "image" ? <ChatImage content={content} filetype={filetype} handleClick={handleClick} />
          : <video src={`/api/view?name=${content}`} width={160} height={90} onClick={() => handleClick(content, filetype)}></video>)
        :<Typography variant="body1" >{content}</Typography>
      }  
      <Typography sx={{fontSize:'10px'}}>{time}</Typography>
    </div>
  }
  useEffect(() => {
    // ...socket.io setup and message handling...

    const unreadMessages = messages.filter((item) => (item?.to === session?.user?.email && !item?.read));

    console.log("unreadMessages", unreadMessages);

    if(unreadMessages.length > 0){
      unreadMessages.map((item)=>{
        socket.emit('readMessage', {...item, read:true})
      })
    }

    // Scroll to the bottom when new messages arrive
    const chatWindow = chatWindowRef.current;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <FullLayout title="Chat" appbar={false}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            width: '100vw',
            background: '#3339',
            alignItems: 'center',
            textAlign: 'center',
          }}>
          <Box
            sx={{
              background: 'rgb(47,255,79)',
              borderRadius: 2,
              width: 70,
              height: 70,
              // padding: 1,
            }}>
            <Image src={(pic == "" || pic == undefined) ? `/images/male.png` : `/api/view?name=${pic}`} alt="male" width={70} height={70} />
          </Box>
          <Typography sx={{ flexGrow: 1 }}>{email}</Typography>

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={router.back}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Stack 
          ref = {chatWindowRef}
          sx={{ 
            flex: 1, 
            overflowY: 'scroll', 
            p: 1 
          }}>
          {messages.map((message, i) => (
            <Fragment key={i}>
              <Typography alignSelf={'center'}>{CheckDate(message, messages, i)}</Typography>
              {
                (message.author != session?.user.email) ? <Box
                alignSelf={'start'}
                bgcolor="success.main"
                sx={{ borderRadius: 2, p: 1, px: 2, m: 1, maxWidth: '80%' }}>
                {/* <Typography>{message.content}</Typography>
                <Typography sx={{fontSize:'10px'}}>{message.time}</Typography> */}
                {messageElement(message?.type, message?.content, message?.time, message.filetype)}
              </Box> :
              <Box
                alignSelf={'end'}
                textAlign="right"
                bgcolor="info.main"
                sx={{ borderRadius: 2, p: 1, px: 2, m: 1, maxWidth: '80%' }}>
                {messageElement(message?.type, message?.content, message?.time, message.filetype)}
              </Box>
              }
              
             
            </Fragment>
          ))}
        </Stack>
        <Box
          sx={{
            width: '100vw',
            display: 'flex',
            p: 2,
          }}>
          <TextField 
            value={inputValue} 
            sx={{ flexGrow: 1 }} 
            variant="standard" 
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={handleClipboardPaste}
            onKeyPress={(e) => {
              if(e.key === 'Enter'){
                sendMessage(e)
              }
            }}
            />
          <IconButton
            sx={{
              bgcolor: 'info.main',
              borderRadius: '50%',
              width: 40,
              height: 40,
              ml: 2,
            }}
            onClick={(e) => sendMessage(e)}
            >
            <MailIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'info.main',
              borderRadius: '50%',
              width: 40,
              height: 40,
              ml: 1,
            }}>
            <label htmlFor="icon-button-file">
              <AttachFileIcon />
            </label>
            <input
              accept="*.*"
              id="icon-button-file"
              type="file"
              onChange={(e) => asyncupload(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </IconButton>
        </Box>
      </Box>
      <MediaViewer
        open={open}
        handleClose={handleClose}
        content={selectedContent}
      />
    </FullLayout>
  )
}


export function MediaViewer( {open, handleClose, content}: MediaViewerProps ){
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Media Viewer
        </DialogTitle>
        <DialogContent>
          {content.type == 'image' ? <img src={`/api/view?name=${content.content}`} alt={content.content} width="100%"/>: <video src={`/api/view?name=${content.content}`} width="100%" controls/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <a href={`/api/view?name=${content.content}`} download>
          <Button color="primary">
            Download
          </Button>
          </a>
        </DialogActions>
      </Dialog>
    </>
  )
}

export function ChatImage ({content, filetype, handleClick} : any){
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    
    const tempImage = document.createElement("img") as HTMLImageElement;
    tempImage.crossOrigin = 'anonymous';
    
    tempImage.onload = () => {
      setImageDimensions({ width: tempImage.width * 10, height: tempImage.height * 10 });
      URL.revokeObjectURL(img.src);  // Release memory
    };
  
    // Assign the src after the onload is attached
    tempImage.src = img.src;
  };
  
  return (<div>
      <Image
        src={`/api/view?name=${content}`}
        alt={content}
        width={imageDimensions.width}
        height={imageDimensions.height}
        onClick={() => handleClick(content, filetype)}
        onLoad={handleImageLoad}
    />
  </div>)
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
