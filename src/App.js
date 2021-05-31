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

//Добавить возможность добавлять абзацы
//Возможность добавить титульную картинку в текст
//При добавлении слова в словарь (возможность добавлять в словарь конкретное слово) рядом со словом было бы предложение с возможностью проигрывать звук.
