import React, { useState } from 'react'
import { ModalContext } from '../context/ModalContext'

export const Modal = ({ children }) => {
  const [modal, setModal] = useState({ content: null, active: false })

  const setModalHandler = (content) => {
    setModal({ content, active: true })
  }
  const removeModalHandler = () => {
    setModal({ content: null, active: false })
  }

  return (
    <ModalContext.Provider value={{ setModalHandler, removeModalHandler }}>
      {modal && modal.active && modal.content && (
        <div className='overlay'>
          <div className='modal'>
            <div className='modal-header'>{modal.content.header}</div>
            <div className='modal-body'>{modal.content.body}</div>
            <div className='modal-buttons'>
              {modal.content.buttons.map((e) => {
                return e
              })}
            </div>
          </div>
        </div>
      )}
      {children}
    </ModalContext.Provider>
  )
}
