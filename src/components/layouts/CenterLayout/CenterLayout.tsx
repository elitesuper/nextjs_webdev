import * as React from 'react'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import BasicLayout from '@layouts/BasicLayout/BasicLayout'

type CenterLayoutProps = {
  children: React.ReactNode
  title?: string
}

export default function CenterLayout({
  children,
  title = 'Reson App',
}: CenterLayoutProps) {
  return (
    <BasicLayout title={title}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <CssBaseline />
        {children}
      </Container>
    </BasicLayout>
  )
}
