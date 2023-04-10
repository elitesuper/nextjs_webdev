import FullLayout from '@layouts/FullLayout/FullLayout'
import { Divider } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'

export default function Score() {
  const [lang, setLanguage] = useAtom(language)

  const list = [
    {
      name: 'READY',
      dir: 'S1',
    },
    {
      name: 'SMART',
      dir: 'S2',
    },
    {
      name: 'SPECI',
      dir: 'S3',
    },
    {
      name: 'PROFI',
      dir: 'S4',
    },
    {
      name: 'TALENTI',
      dir: 'S5',
    },
    {
      name: 'EXPERT',
      dir: 'S6',
    },
  ]
  return (
    <FullLayout title="Property">
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
                primary={
                  <Typography
                    variant="h3"
                    sx={{
                      '&:first-letter': {
                        fontSize: '130%',
                      },
                    }}>
                    {item.name}
                  </Typography>
                }
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
