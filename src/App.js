import React, { createContext, useReducer } from 'react'
import { AudioEditor } from './pages/AudioEditor.js'
import { reducer } from './context/reducer'
import { AppContext } from './context/AppContext.js'
import { TextContainer } from './components/TextContainer.js'
import { ToolbarContext } from './context/ToolbarContext.js'

export const App = () => {
  const [appState, appDispatch] = useReducer(reducer, {})

  return (
    <ToolbarContext.Provider>
      <AppContext.Provider value={{ appState, appDispatch }}>
        <div className={'wrapper'}>
          <AudioEditor />
          <div className={'textWrapper'}>
            <TextContainer />
          </div>
        </div>
      </AppContext.Provider>
    </ToolbarContext.Provider>
  )
}
