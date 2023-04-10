import FullLayout from '@layouts/FullLayout/FullLayout'
import {
  Badge,
  Box,
  Checkbox,
  Divider,
  IconButton,
  ListItemButton,
} from '@mui/material'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/system'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'

export default function CopyProject() {
  const [lang, setLanguage] = useAtom(language)
  const list = [
    {
      name: 'RESON App',
      date: '21.12.2022',
      members: 2,
    },
    {
      name: 'Project 2',
      date: '20.12.2022',
      members: 12,
    },
    {
      name: 'Project 3',
      date: '12.12.2022',
      members: 5,
    },
    {
      name: 'Project 4',
      date: '11.12.2022',
      members: 6,
    },
    {
      name: 'Project 5',
      date: '23.02.2022',
      members: 6,
    },
  ]

  /*const initial = Array(list.length)
  initial.fill(false)
  const [checked, setChecked] = useState(initial)

  const handleClick = (i: number) => {
    const values = checked
    values[i] = !values[i]
    setChecked(values)
  }*/

  const router = useRouter()
  return (
    <FullLayout title="Projects" menubar={false} appbar={false}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          width: '100vw',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Image src={`/images/right.png`} alt="right" width={60} height={60} />

        <Typography sx={{ flexGrow: 1 }} variant="h5">
          {languagejson[lang].COPYPROJECTS}
        </Typography>

        <IconButton onClick={router.back}>
          <Image src={`/images/back.png`} alt="back" width={32} height={32} />
        </IconButton>
      </Box>
      <List
        sx={{
          width: '100vw',
        }}>
        {list.map(({ name, date, members }, i) => (
          <>
            {i !== 0 && <Divider />}
            <ListItemButton key={name}>
              <Checkbox />
              <Stack sx={{ flexGrow: 1 }}>
                <Typography variant="h4">{name}</Typography>
                <Typography variant="h6">{languagejson[lang].Lastupdate}: {date}</Typography>
              </Stack>

              <Badge badgeContent={members} color="success">
                <Image
                  src="/images/group.png"
                  alt="group"
                  width={40}
                  height={40}
                />
              </Badge>

              <IconButton href="/newproject" LinkComponent={Link}>
                <Image
                  src="/images/turnon.png"
                  alt="turnon"
                  width={40}
                  height={40}
                />
              </IconButton>
            </ListItemButton>
          </>
        ))}
      </List>
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
