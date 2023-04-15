import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as MenuData from '@constants/Menu.json'

const { data: MenuDatas } = MenuData

export default function Menubar() {
  const [value, setValue] = React.useState(0)

  return (
    <BottomNavigation
      sx={{
        width: '100vw',
        background: '#002060',
      }}
      // showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}>
      {MenuDatas.map(({ name, href }) => (
        <BottomNavigationAction
          key={name[0]}
          href={href}
          LinkComponent={Link}
          icon={
            <Image
              width={name[0] === 'main' ? 100 : 40}
              height={name[0] === 'main' ? 100 : 40}
              src={`/images/${name[0]}.png`}
              alt={name[0]}
            />
          }
        />
      ))}
    </BottomNavigation>
  )
}
