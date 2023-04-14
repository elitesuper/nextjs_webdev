import FullLayout from '@layouts/FullLayout/FullLayout'
import {
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/system'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'

import io from "socket.io-client";

export default function Messages() {
  const [lang, setLanguage] = useAtom(language)
  const [users, setUsers] = React.useState<any>([])
  const list = [
    {
      name: 'Nickname 1',
      message: 'new message',
      icon: 'male',
      background: 'rgb(47,255,79)',
      new: 7,
    },
    {
      name: 'Nickname 2',
      message: 'new message',
      icon: 'male',
      background: '#ff0',
      new: 1,
    },
    {
      name: 'Nickname 3',
      message: 'last message',
      icon: 'female',
      background: 'rgb(47,255,79)',
      new: 0,
    },
    {
      name: 'Nickname 4',
      message: 'last message',
      icon: 'female',
      background: 'rgb(0,176,240)',
      new: 0,
    },
    {
      name: 'Nickname 5',
      message: 'last message',
      icon: 'female',
      background: 'rgb(255,18,239)',
      new: 0,
    },
    {
      name: 'Nickname 6',
      message: 'last message',
      icon: 'group',
      background: 'rgb(47,255,79)',
      new: 0,
    },
  ]

  const list1 = [
    {
      name: 'GRP-Name 1',
      membership: 11,
      new: 7,
    },
    {
      name: 'GRP-Name 2',
      membership: 3,
      new: 1,
    },
    {
      name: 'GRP-Name 3',
      membership: 6,
      new: 0,
    },
    {
      name: 'GRP-Name ...',
      membership: 2,
      new: 0,
    },
  ]

  React.useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/api/user/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      let userData = await response.json()
      setUsers([...userData.data])
    }
    getUser()
  }, [])

  React.useEffect(() => {
    console.log("users data updated=", users)
  }, [users])

  const router = useRouter()
  const group = parseInt(router.query.group as string) || 0
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    router.replace('/messages?group=' + newValue)
  }
  const AddContact = (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
      <Typography sx={{ flexGrow: 1 }}>{languagejson[lang].Newcontact}</Typography>
      <IconButton>
        <Image src="/images/create.png" alt="create" width={32} height={32} />
      </IconButton>
    </Box>
  )
  return (
    <FullLayout title={languagejson[lang].Message}>
      <Tabs value={group} onChange={handleChange}>
        <Tab label={languagejson[lang].chats} />
        <Tab label={languagejson[lang].group} />
        <Tab label={languagejson[lang].contacts} />
      </Tabs>
      {/* BEGIN: CHATS SECTION */}
      {group === 0 && (
        <List
          sx={{
            width: '100vw',
          }}>
          {users.map((user:any, i:number) => (
            <>
              {i !== 0 && <Divider />}
              <ListItemButton
                key={user._id}
                href={`/chat?email=${user.email}`}
                LinkComponent={Link}>
                <Stack sx={{ flexGrow: 1 }}>
                  <Typography variant="h4">{user.nickname}</Typography>
                  <Typography>{user.email}</Typography>
                </Stack>
                <IconButton
                  LinkComponent={Link}
                  href="/profile"
                  sx={{
                    background: (user.sex != null ? (user.sex == 'male' ? 'rgb(0,176,240)' : 'rgb(255,18,239)') : 'rgb(47,255,79)'),
                    borderRadius: 2,
                  }}>
                  <Badge badgeContent={0} color="error">
                    <Image
                      src={`/images/${(user.sex != null ? user.sex : 'male')}.png`}
                      alt={(user.sex != null ? user.sex : '')}
                      width={50}
                      height={50}
                    />
                  </Badge>
                </IconButton>
              </ListItemButton>
            </>
          ))}
        </List>
      )}
      {/* END: CHATS SECTION */}
      {/* BEGIN: GROUPS SECTION */}
      {group === 1 && (
        <List
          sx={{
            width: '100vw',
          }}>
          {list1.map((item, i) => (
            <>
              {i !== 0 && <Divider />}
              <ListItem key={item.name}>
                <ListItemText>
                  <Typography variant="h4">{item.name}</Typography>
                </ListItemText>
                <IconButton LinkComponent={Link} href="/profile">
                  <Badge
                    badgeContent={item.membership}
                    color="success"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}>
                    <Badge badgeContent={item.new} color="error">
                      <Image
                        src={`/images/group.png`}
                        alt="group"
                        width={50}
                        height={50}
                      />
                    </Badge>
                  </Badge>
                </IconButton>
              </ListItem>
            </>
          ))}
        </List>
      )}
      {/* END: GROUP SECTION */}
      {/* BEGIN: CONTACTS SECTION */}
      {group === 2 && (
        <List
          sx={{
            width: '100vw',
          }}
          subheader={AddContact}>
          {users.map((user:any, i:number) => (
            <>
              {i !== 0 && <Divider />}
              <ListItemButton
                key={user._id}
                href="/profile"
                LinkComponent={Link}>
                <Stack sx={{ flexGrow: 1 }}>
                  <Typography variant="h4">{user.nickname}</Typography>
                  <Typography>{user.email}</Typography>
                </Stack>
                <IconButton
                  sx={{
                    background: (user.sex != null ? (user.sex == 'male' ? 'rgb(0,176,240)' : 'rgb(255,18,239)') : 'rgb(47,255,79)'),
                    borderRadius: 2,
                  }}>
                  <Badge badgeContent={0} color="error">
                    <Image
                      src={`/images/${(user.sex != null ? user.sex : 'male')}.png`}
                      alt={(user.sex != null ? user.sex : '')}
                      width={50}
                      height={50}
                    />
                  </Badge>
                </IconButton>
              </ListItemButton>
            </>
          ))}
        </List>
      )}
      {/* END: CONTACTS SECTION */}
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
