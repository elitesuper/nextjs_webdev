import { useState, useEffect, useRef } from "react";
import FullLayout from '@layouts/FullLayout/FullLayout'
import {
  AttachFile as AttachFileIcon,
  CoPresentOutlined,
  Mail as MailIcon,
} from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton, Stack, TextField, Typography } from '@mui/material'
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

let socket:any;
let email:string;

type Message = {
  author: string;
  message: string;
};

type Query = {
  email: string;
};

export default function Chat() {
  const router = useRouter()
  const { email } = router.query

  const connectSocketRef = useRef(false);
  const [lang, setLanguage] = useAtom(language)

  const { data: session } = useSession()

  const [messageObj, setMessageObj] = React.useState({})

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  // useEffect(() => {
  //   const socketInitializer = async () => {
  //     console.log("send socket api")
  //     await fetch("/api/socket", {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({email: email})
  //     });
  
  //     socket = io();
  
  //     socket.on("connect", () => {
  //       console.log("connected=", socket.id); // x8WIv7-mJelg7on_ALbx
  //     });
  
  //     socket.on("disconnect", () => {
  //       console.log("disconnected=", socket.id)
  //       socket.emit("disconnected", { id: socket.id });
  //     });
  
  //     socket.on("newIncomingMessage", (msg:Message) => {
  //       console.log(msg.message + ' from ' + msg.author)
  //       setMessages((currentMsg) => [
  //         ...currentMsg,
  //         { author: msg.author, message: msg.message },
  //       ]);
  //       console.log(messages);
  //     });
  //   };
    
  //   if (connectSocketRef.current) return;
  //   connectSocketRef.current = true;
  //   socketInitializer();
  // }, []);

  

  const sendMessage = async () => {
    // console.log(session?.user?.email + 'send to ' + email + '. msg content:' + message)
    // socket.emit("createdMessage", { author: session?.user?.email, message });
    // setMessages((currentMsg) => [
    //   ...currentMsg,
    //   { author: session?.user?.email, message: message },
    // ]);
    // setMessage("");

    const response = await fetch('/api/message/message', {
      method: 'POST',
      body: JSON.stringify(messageObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

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
              padding: 1,
            }}>
            <Image src={`/images/male.png`} alt="male" width={50} height={50} />
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
        <Stack sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          {messages.map((_, i) => (
            <Fragment key={i}>
              <Typography alignSelf={'center'}>1/9/2023</Typography>
              <Box
                alignSelf={'start'}
                bgcolor="success.main"
                sx={{ borderRadius: 2, p: 1, px: 2, m: 1, maxWidth: '80%' }}>
                <Typography>Hello. Nice to meet you.</Typography>
              </Box>
              <Box
                alignSelf={'end'}
                textAlign="right"
                bgcolor="info.main"
                sx={{ borderRadius: 2, p: 1, px: 2, m: 1, maxWidth: '80%' }}>
                <Typography>Hello.</Typography>
              </Box>
            </Fragment>
          ))}
        </Stack>
        <Box
          sx={{
            width: '100vw',
            display: 'flex',
            p: 2,
          }}>
          {/* <TextField sx={{ flexGrow: 1 }} variant="standard" onChange={(e) => setMessage(e.target.value)}/> */}
          <TextField sx={{ flexGrow: 1 }} variant="standard" onChange={(e) => setMessageObj({message: e.target.value})}/>
          <IconButton
            sx={{
              bgcolor: 'info.main',
              borderRadius: '50%',
              width: 40,
              height: 40,
              ml: 2,
            }}
            onClick={() => sendMessage()}
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
            <AttachFileIcon />
          </IconButton>
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
