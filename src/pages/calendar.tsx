import FullLayout from '@layouts/FullLayout/FullLayout'
import { Divider, ListSubheader, Tab, Tabs } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/system'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'

export default function Calendar() {
  const list = [
    {
      name: 'Event 1',
      date: '21.12.2022',
      left: '3:33 h',
    },
    {
      name: 'Event 2',
      date: '21.12.2022',
      left: '5:33 h',
    },
    {
      name: 'Event 3',
      date: '22.12.2022',
      left: '2:11 h',
    },
    {
      name: 'Event 4',
      date: '24.12.2022',
      left: '3 d',
    },
  ]
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <FullLayout title="MY EVENTS" menubar={false}>
      <Tabs value={value} onChange={handleChange} sx={{ width: '100vw' }}>
        <Tab label="Week" />
        <Tab label="Month" />
        <Tab label="Year" />
      </Tabs>
      <List
        sx={{
          width: '100vw',
        }}
        subheader={
          <ListSubheader sx={{ bgcolor: 'transparent' }}>Today</ListSubheader>
        }>
        {list.map(({ name, date, left }, i) => (
          <>
            {i !== 0 && <Divider />}
            <ListItem key={name}>
              <Stack sx={{ flexGrow: 1 }}>
                <Typography variant="h3">{name}</Typography>
                <Typography variant="h6">Date: {date}</Typography>
              </Stack>
              <Typography variant="h4">in {left}</Typography>
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
