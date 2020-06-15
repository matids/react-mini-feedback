import React from 'react'

import Feedback from 'react-mini-feedback'
import 'react-mini-feedback/dist/index.css'

const App = () => {
  return <Feedback onSend={console.log} />
}

export default App
