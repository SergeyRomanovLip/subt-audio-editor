import React, { useReducer } from 'react'
import { AudioEditor } from './pages/AudioEditor.js'
import { reducer } from './context/reducer'
import { AppContext } from './context/AppContext.js'
import { TextContainer } from './components/TextContainer.js'
import { Toolbar } from './components/Toolbar.js'

export const App = () => {
  const [appState, appDispatch] = useReducer(reducer, {})

  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      <Toolbar>
        <div className={'wrapper'}>
          <AudioEditor />
          <div className={'textWrapper'}>
            <TextContainer />
          </div>
        </div>
      </Toolbar>
    </AppContext.Provider>
  )
}
