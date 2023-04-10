import FullLayout from '@layouts/FullLayout/FullLayout'
import { AvTimer } from '@mui/icons-material'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import Image from 'next/image'

export default function Project() {
  return (
    <FullLayout title="Project 3" menubar={false}>
      <Box sx={{ display: 'flex', p: 2 }}>
        <AvTimer /> <Typography sx={{ ml: 2 }}>in 5 weeks</Typography>
      </Box>
      <table style={{ width: '100vw', borderCollapse: 'collapse' }}>
        <tr style={{ color: 'yellow', textAlign: 'left' }}>
          <th style={{ paddingLeft: 15 }}>TITLE</th>
          <th>PERSONAL</th>
          <th>STATUS</th>
        </tr>
        <tr>
          <td
            style={{
              backgroundImage: 'url(/images/but_rolle3.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              paddingLeft: 10,
            }}>
            <Typography variant="h5">Role I</Typography>
          </td>
          <td>
            <div
              style={{
                background: 'rgb(47,255,79)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
              }}>
              <Image src="/images/male.png" alt="male" width={30} height={30} />
            </div>
            <div
              style={{
                background: 'yellow',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
                marginLeft: 5,
              }}>
              <Image src="/images/male.png" alt="male" width={30} height={30} />
            </div>
            <div
              style={{
                background: 'rgb(47,255,79)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
                marginLeft: 5,
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
          </td>
          <td>
            <div>
              <Image src="/images/S1.png" alt="S1" width={80} height={80} />
            </div>
          </td>
        </tr>
        <tr>
          <td
            style={{
              backgroundImage: 'url(/images/but_rolle4.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              paddingLeft: 10,
            }}>
            <Typography variant="h5">Role II</Typography>
          </td>
          <td>
            <div
              style={{
                background: 'rgb(255,18,239)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
          </td>
          <td>
            <div>
              <Image src="/images/S2.png" alt="S2" width={80} height={80} />
            </div>
          </td>
        </tr>
        <tr>
          <td
            style={{
              backgroundImage: 'url(/images/but_rolle5.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              paddingLeft: 10,
            }}>
            <Typography variant="h5">Role III</Typography>
          </td>
          <td>
            <div
              style={{
                background: 'rgb(47,255,79)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
            <div
              style={{
                background: 'yellow',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
                marginLeft: 5,
              }}>
              <Image src="/images/male.png" alt="male" width={30} height={30} />
            </div>
            <div
              style={{
                background: 'rgb(0,176,240)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
                marginLeft: 5,
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
          </td>
          <td>
            <div>
              <Image src="/images/S3.png" alt="S3" width={80} height={80} />
            </div>
          </td>
        </tr>
        <tr>
          <td
            style={{
              backgroundImage: 'url(/images/but_rolle6.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              paddingLeft: 10,
            }}>
            <Typography variant="h5">Role IV</Typography>
          </td>
          <td>
            <div
              style={{
                background: 'yellow',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
            <div
              style={{
                background: 'rgb(47,255,79)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
                marginLeft: 5,
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
          </td>
          <td>
            <div>
              <Image src="/images/S4.png" alt="S4" width={80} height={80} />
            </div>
          </td>
        </tr>
        <tr>
          <td
            style={{
              backgroundImage: 'url(/images/but_rolle8.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              paddingLeft: 10,
            }}>
            <Typography variant="h5">Role VI</Typography>
          </td>
          <td>
            <div
              style={{
                background: 'rgb(0,176,240)',
                borderRadius: 5,
                padding: 5,
                width: 40,
                height: 40,
                display: 'inline-flex',
              }}>
              <Image
                src="/images/female.png"
                alt="female"
                width={30}
                height={30}
              />
            </div>
          </td>
          <td>
            <div>
              <Image src="/images/S6.png" alt="S6" width={80} height={80} />
            </div>
          </td>
        </tr>
        <tr>
          <td
            style={{
              backgroundImage: 'url(/images/but_rolle9.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              paddingLeft: 10,
            }}>
            <Typography variant="h5">Role VII</Typography>
          </td>
          <td>
            <div>
              <Image
                src="/images/group.png"
                alt="group"
                width={80}
                height={80}
              />
            </div>
          </td>
          <td></td>
        </tr>
      </table>
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
