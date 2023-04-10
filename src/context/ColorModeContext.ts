import React from 'react'

const ColorModeContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
  mode: 'light',
})

export default ColorModeContext
