import React, { useContext, useEffect, useState } from 'react'
import { getExistingProjects } from '../backend/firebase'
import { ModalContext } from '../context/ModalContext'
import { idGenerator } from '../utils/idGenerator'

export const ModalProjectChooser = ({ callback }) => {
  const { removeModalHandler } = useContext(ModalContext)
  const [projects, setProjects] = useState(null)
  const [choosen, setChoosen] = useState(null)
  const setChoosenHandler = (projectName) => {
    if (choosen === projectName) {
      setChoosen(null)
    } else {
      setChoosen(projectName)
    }
  }
  useEffect(() => {
    getExistingProjects().then((res) => {
      console.log(res)
      setProjects(res)
    })
  }, [])

  if (projects) {
    return (
      <div className='overlay'>
        <div className='modal'>
          <div className='modal-header'>Выберите проект</div>
          <div className='modal-body'>
            {projects.map((pjct, i) => {
              return (
                <div
                  onClick={() => {
                    setChoosenHandler(pjct)
                  }}
                  className={choosen === pjct && 'choosen'}
                  key={i + idGenerator()}
                >
                  {pjct.projectName}
                </div>
              )
            })}
          </div>
          <div className='modal-buttons'>
            <div
              onClick={() => {
                callback(choosen).then((e) => {
                  removeModalHandler()
                })
              }}
              className='btn'
            >
              open
            </div>
            <div
              className='btn'
              onClick={() => {
                removeModalHandler()
              }}
            >
              close
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <div>wait</div>
  }
}
