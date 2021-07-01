import React, { useState } from 'react'
import { Toolbar } from '../components/Toolbar'
import { AudioEditor } from './AudioEditor'
import { TextContainer } from '../components/TextContainer.js'

export const AudioEditorPage = () => {
  const [state, setState] = useState()
  return (
    <Toolbar>
      <div className={'wrapper'}>
        <AudioEditor />
        <div className={'textWrapper'}>
          <TextContainer />
        </div>
      </div>
    </Toolbar>
  )
}
