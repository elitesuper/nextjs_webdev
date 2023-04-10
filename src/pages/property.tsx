import FullLayout from '@layouts/FullLayout/FullLayout'
import { Divider } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'

export default function Property() {
  const [lang, setLanguage] = useAtom(language)
  const list = [
    {
      name: 'Pro3',
      dir: 'S1',
    },
    {
      name: 'Pro4',
      dir: 'S4',
    },
    {
      name: 'Pro5',
      dir: 'S5',
    },
    {
      name: 'Pro6',
      dir: 'S6',
    },
    {
      name: 'Pro7',
      dir: 'S6',
    },
  ]
  return (
    <FullLayout title="Property">
      <Box
        sx={{
          background: '#fff4',
          position: 'relative',
        }}>
        <Typography
          variant="h3"
          sx={{
            '&:first-letter': {
              fontSize: '130%',
            },
            'line-height': '1.5',
            ml: 3,
          }}>
          {languagejson[lang].HEALTH}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}>
          <IconButton LinkComponent={Link} href="/score">
            <Image src="/images/S2.png" alt="S2" width={140} height={140} />
          </IconButton>
        </Box>
      </Box>
      <Typography
        sx={{
          p: 2,
          pr: 14,
          '&:first-letter': {
            fontSize: '130%',
          },
          textTransform: 'uppercase',
        }}>
          {languagejson[lang].Youhaveexcellentphysicalconditionandhealth}
      </Typography>
      <List
        sx={{
          width: '100vw',
          background: '#fff4',
        }}>
        {list.map((item, i) => (
          <>
            {i !== 0 && <Divider />}
            <ListItem key={item.name}>
              <ListItemText
                primary={<Typography variant="h4">{item.name}</Typography>}
              />
              <Image
                src={`/images/${item.dir}.png`}
                alt={item.dir}
                width={100}
                height={100}
              />
            </ListItem>
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
