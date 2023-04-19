import FullLayout from '@layouts/FullLayout/FullLayout'
import { Dialog, DialogTitle, Divider, ListItemButton } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import React, { useState } from 'react'
import SettingData from '@constants/Setting.json'
import {language, modusJot, statusJot, firstnameJot, lastnameJot, emailJot, telephoneJot, personalAnalysisJot} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'
import cookies from "browser-cookies";



export interface SimpleDialogProps {
  index: number
  open: boolean
  selectedValue: number
  onClose: (value: number) => void
}

function SimpleDialog(props: SimpleDialogProps) {
  const [lang, setLanguage] = useAtom(language)
  const { onClose, selectedValue, open, index } = props
  const { name: title, options } = SettingData[lang][index]

  const handleClose = () => {
    onClose(selectedValue)
  }

  const handleListItemClick = (value: number) => {

    // const { language: lang, modus: modus, status: status, show_firstname: firstname, show_lastname: lastname, show_email: email, show_telephone: telephone, show_analyse: personalAnalysis,}
    onClose(value)
    console.log(value)
  }


  async function setSetting(settings: object) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  
    const data = await response.json()
  
    if (!response.ok) {
      return {
        status: 'error',
        data: data.message || 'Something went wrong!',
      }
    }
  
    return {
      status: 'success',
      data: 'Please verify with the code that is sent to your email.',
    }
  }

  
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {options.map((option, i) => (
          <ListItem key={option + i} disableGutters>
            <ListItemButton onClick={() => handleListItemClick(i)}>
              <ListItemText primary={option} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default function Settings() {
  const [lang, setLanguage] = useAtom(language)
  const [modus, setModus] = useAtom(modusJot)
  const [status, setStatus] = useAtom(statusJot)
  const [firstname, setFirstname] = useAtom(firstnameJot)
  const [lastname, setLastname] = useAtom(lastnameJot)
  const [email, setEmail] = useAtom(emailJot)
  const [telephone, setTelephone] = useAtom(telephoneJot)
  const [personalAnalysis, setPersonalAnalysis] = useAtom(personalAnalysisJot)
  const [open, setOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [bal, setbal] = React.useState([0,0,0,0,0,0,0,0])
  const [selectedValues, setSelectedValues] = React.useState(
    [[0,1,2,3], [0,1,2], [0,1,2,3], [0,1,2], [0,1,2], [0,1,2], [0,1,2], [0,1,2]]
  )

  React.useEffect(() => {
    const getCurrentSetting = async () => {
      const response = await fetch('/api/setting/currentSetting', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      let settingData = await response.json()
      console.log(settingData)
      setLanguage(settingData.data[0].language)    
      setModus(settingData.data[0].modus)
      setStatus(settingData.data[0].status)
      setFirstname(settingData.data[0].show_firstname)
      setLastname(settingData.data[0].show_lastname)
      setTelephone(settingData.data[0].show_telephone)
      setPersonalAnalysis(settingData.data[0].show_analyse)
      setEmail(settingData.data[0].show_email)
    }
    getCurrentSetting()
  }, [])

  const handleClickOpen = (index: number) => {
    setCurrentIndex(index)
    setOpen(true)
  }

  const handleClose = (value: number) => {
    setOpen(false)
    const values = selectedValues[currentIndex]
    values[bal[currentIndex]] = value

    switch (currentIndex) {
      case 0:
        setLanguage( values[bal[currentIndex]])
        break
      case 1:
        setModus( values[bal[currentIndex]])
        break
      case 2:
        setStatus( values[bal[currentIndex]])
        break 
      case 3:
        setFirstname( values[bal[currentIndex]])
        break
      case 4:
        setLastname( values[bal[currentIndex]])
        break
      case 5:
        setEmail( values[bal[currentIndex]])
        break
      case 6:
        setTelephone( values[bal[currentIndex]])
        break
      default:
        setPersonalAnalysis( values[bal[currentIndex]])
    }
    // console.log( values[bal[currentIndex]])
    // setSelectedValues(values)
  }
  return (
    <FullLayout title={languagejson[lang].Settings}>
      <List
        sx={{
          width: '100vw',
        }}>
        {SettingData[lang].map(({ name, options }, i) => (
          <>
            {i !== 0 && <Divider />}
            <ListItem
              key={name + options + i}
              onClick={() => handleClickOpen(i)}>
              <ListItemText primary={name} />
              {i == 0 ?
                <Typography>{options[lang]}</Typography>
                :
                <Typography>{options[selectedValues[i][0] || 0]}</Typography>
              }
            </ListItem>
          </>
        ))}
      </List>
      <SimpleDialog
        index={currentIndex}
        selectedValue={selectedValues[currentIndex][bal[currentIndex]]}
        open={open}
        onClose={handleClose}
      />
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
