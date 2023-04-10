import ColorModeContext from 'context/ColorModeContext'
import Image from 'next/image'
import React from 'react'

export default function Loading() {
  const { mode } = React.useContext(ColorModeContext)
  return (
    <Image
      src={`/images/logo_${mode === 'light' ? 'day' : 'night'}.png`}
      alt="Loading..."
      width={280}
      height={80}
      priority
    />
  )
}
