import FullLayout from '@layouts/FullLayout/FullLayout'
import {
  AvTimer as AvTimerIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material'
import {
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import Box from '@mui/material/Box'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'

export default function NewProject() {
  const router = useRouter()
  const [lang, setLanguage] = useAtom(language)
  return (
    <FullLayout title="New Project" appbar={false}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Box
          sx={{
            px: 2,
            display: 'flex',
            width: '100vw',
            backgroundImage: 'url(/images/but_rolle2.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            alignItems: 'center',
            textAlign: 'center',
          }}>
          <Image src={`/images/start.png`} alt="start" width={80} height={80} />

          <Typography sx={{ flexGrow: 1 }} variant="h5">
            {languagejson[lang].NEWPROJECT}
          </Typography>

          <IconButton onClick={router.back}>
            <Image src={`/images/back.png`} alt="back" width={32} height={32} />
          </IconButton>
        </Box>

        <Container>
          <TextField fullWidth margin="dense" label="Title" size="small" />
          <TextField fullWidth margin="dense" label="Target" size="small" />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={4}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AvTimerIcon />
            <TextField
              size="small"
              sx={{ flexGrow: 1, ml: 2 }}
              margin="dense"
              label="Deadline"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon />
            <TextField
              size="small"
              sx={{ flexGrow: 1, ml: 2 }}
              margin="dense"
              label="Location"
            />
          </Box>
        </Container>

        <Box
          sx={{
            px: 2,
            display: 'flex',
            width: '100vw',
            backgroundImage: 'url(/images/but_rolle1.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            alignItems: 'center',
          }}>
          <Typography sx={{ flexGrow: 1 }} variant="h5">
            <span style={{ color: 'black' }}>{languagejson[lang].ADD}</span>{languagejson[lang].NEWROLE}
          </Typography>

          <IconButton>
            <Image src={`/images/plus.png`} alt="plus" width={32} height={32} />
          </IconButton>
        </Box>
        <List
          sx={{
            width: '100vw',
          }}>
          {['I', 'II', 'III'].map((role, i) => (
            <ListItem
              key={role}
              sx={{
                px: 2,
                backgroundImage: `url(/images/but_rolle${3 + i}.png)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}>
              <ListItemText>{languagejson[lang].ROLE} {role}</ListItemText>

              <Image
                src="/images/group.png"
                alt="group"
                width={24}
                height={24}
              />
              <IconButton>
                <Image src="/images/new.png" alt="new" width={24} height={24} />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
          <Button color="success" variant="contained" sx={{ width: 90 }}>
            {languagejson[lang].START}
          </Button>
          <Button color="primary" variant="contained" sx={{ width: 90 }}>
            {languagejson[lang].SAVE}
          </Button>
          <Button color="secondary" variant="contained" sx={{ width: 90 }}>
            {languagejson[lang].SHARE}
          </Button>
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
