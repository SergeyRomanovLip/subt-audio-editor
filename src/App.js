import React, { useReducer, useState } from 'react'
import { AudioEditor } from './pages/AudioEditor.js'
import { reducer } from './context/reducer'
import { Loading } from './components/Loading'
import { AppContext } from './context/AppContext.js'
import { TextContainer } from './components/TextContainer.js'
import { Toolbar } from './components/Toolbar.js'
import { Modal } from './components/Modal.js'

export const App = () => {
  const [appState, appDispatch] = useReducer(reducer, {})
  const [projectName, setProjectName] = useState('testProject')

  console.log(appState)

  return (
    <AppContext.Provider value={{ appState, appDispatch, projectName }}>
      <Modal>
        <Loading>
          <Toolbar>
            <div className={'wrapper'}>
              <AudioEditor />
              <div className={'textWrapper'}>
                <TextContainer />
              </div>
            </div>
          </Toolbar>
        </Loading>
      </Modal>
    </AppContext.Provider>
  )
}

//Добавить возможность добавлять абзацы
//Возможность добавить титульную картинку в текст
//При добавлении слова в словарь (возможность добавлять в словарь конкретное слово) рядом со словом было бы предложение с возможностью проигрывать звук.
