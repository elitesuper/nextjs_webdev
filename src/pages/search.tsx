import BasicLayout from '@layouts/BasicLayout'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import RadioGroup from '@mui/material/RadioGroup'
import { useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Search from '@mui/icons-material/Search'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  Tab,
  Tabs,
} from '@mui/material'
import { AvTimer, Group, LocationOn, Share, Star } from '@mui/icons-material'
import Image from 'next/image'
import {language} from "../jotai"
import languagejson from "../language.json"
import { useAtom } from 'jotai'
import {useEffect, useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import cookies from "browser-cookies";


mapboxgl.accessToken = "pk.eyJ1IjoicmVkMzAxMSIsImEiOiJjbGdjOXp0enAwOXZ5M2hzeGl6ank5Y29yIn0.NaiYYAmHiHFDJ6SRcqrmkg";


function TabPanel(props: {
  children: React.ReactNode
  value: number
  index: number
}) {
  const { value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <List dense>
          {['Result1', 'Result2'].map((text) => (
            <ListItem
              key={text}
              disablePadding
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="share">
                    <Share
                      sx={{
                        color: 'black',
                      }}
                    />
                  </IconButton>
                  <IconButton edge="end" aria-label="star">
                    <Star color="success" />
                  </IconButton>
                </>
              }>
              <ListItemButton>
                <ListItemText
                  primary={text}
                  sx={{
                    color: 'black',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}
export default function Home() {
  const [lang, setLanguage] = useAtom(language)
  const [value, setValue] = useState(0)

  const mapContainer = useRef(null);
  // const map = useRef(null);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({lng:null, lat:null});
  const [zoom, setZoom] = useState(6);

  useEffect(() => {

    if (center.lng == null || center.lat == null) return;

    const initializeMap = () => {

      console.log("ddddddddddddddddddddddddddddd")
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [center.lng, center.lat],
        zoom: zoom,
      });

      setMap(map);
    };

    if (map == null) {
      initializeMap();
    }
  }, [center]);

  // useEffect(() => {

  //   if (center.lng == null || center.lat == null) return;


  //   if (map.current) return; // initialize map only once

  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: 'mapbox://styles/mapbox/streets-v12',
  //     center: [center.lng, center.lat],
  //     zoom: zoom
  //   });

  // },[center]);

  useEffect(()=>{

    const getCountry = async () => {
      const response = await fetch(`https://ipapi.co/json`)
      const countryCode = await response.json();

      setCenter({lng:countryCode.longitude, lat:countryCode.latitude})
    }
    getCountry()

  },[])

  const handleChange = (
    event: React.SyntheticEvent | Event,
    newValue: number
  ) => {
    setValue(newValue)
  }

  const searchValue = (value:any) =>{
    if (value == "") return;
    // Use Mapbox Geocoding API to search for location
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {

        const [longitude, latitude] = data.features[0].center;

        if(map != null){
          map.flyTo({
            center: [longitude, latitude],
            zoom: zoom,
          });
        }
        // // Move map to searched location
      });
  }

  return (
    <BasicLayout title="Create">
      <div className="page">
        <div className="search">
          <div className="header">
            <div>{languagejson[lang].Ineed}</div>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{
                background: 'white',
                color: 'black',
                display: 'flex',
                padding: '5px 10px 0',
                borderRadius: '10px',
                alignItems: 'center',
              }}>
              <FormControlLabel
                sx={{
                  flex: 1,
                }}
                value="service"
                control={<Radio />}
                label="Service"
              />
              <FormControlLabel
                sx={{
                  flex: 1,
                }}
                value="help"
                control={<Radio />}
                label="Help"
              />
              <FormControlLabel
                sx={{
                  flex: 1,
                }}
                value="information"
                control={<Radio />}
                label="Information"
              />
            </RadioGroup>
          </div>
          <div className="main">
            <TextField
              placeholder="What you're looking for?"
              sx={{
                width: '100%',
                'background-color': 'white',
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Where?"
              sx={{
                width: '100%',
                'background-color': 'white',
                marginTop: '20px',
              }}
              variant="outlined"
              onChange={(e) => searchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image
                      src="/images/global.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Image
                      src="/images/marker.png"
                      width={32}
                      height={32}
                      alt=""
                    />
                  </InputAdornment>
                ),
              }}
            />
            <div className="maps">
              {/* <Image
                src="/images/google_maps.png"
                width={300}
                height={200}
                alt=""
              /> */}
              {/* <div ref={mapContainer} className="map-container" /> */}
              <div id="map" style={{ height: '200px' }} />
            </div>

            <div className="actions">
              <Button
                color="error"
                variant="outlined"
                startIcon={<Star color="success" />}>
                {languagejson[lang].SAVERESULT}
              </Button>
              <Button
                color="error"
                variant="outlined"
                startIcon={
                  <Share
                    sx={{
                      color: 'black',
                    }}
                  />
                }>
                {languagejson[lang].SHARERESULT}
              </Button>
              <Button variant="contained">FULL</Button>
            </div>
          </div>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab label="Search" {...a11yProps(0)} />
              <Tab label="Favourties" {...a11yProps(1)} />
              <Tab label="Results" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {languagejson[lang].ItemOne}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {languagejson[lang].ItemTwo}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {languagejson[lang].ItemThree}
          </TabPanel>
          <div className="list">
            {['Lawyer', 'Support group', 'Humanitarian Organization'].map(
              (text, i) => (
                <div className="item" key={text}>
                  <span className="name">{text}</span>
                  {i === 1 ? (
                    <Group
                      sx={{
                        fontSize: 24,
                        marginLeft: '20px',
                        cursor:'pointer'
                      }}
                    />
                  ) : null}
                  <LocationOn
                    sx={{
                      fontSize: 24,
                      marginLeft: '20px',
                      cursor:'pointer'
                    }}
                  />
                  <AvTimer
                    sx={{
                      fontSize: 24,
                      marginLeft: '20px',
                      cursor:'pointer'
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </BasicLayout>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
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
