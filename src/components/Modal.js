import React, { useEffect, useState } from 'react'
import { ModalContext } from '../context/ModalContext'

export const Modal = ({ children }) => {
  const [modal, setModal] = useState({ content: null, active: false })
  const [modalAdditState, setModalAdditState] = useState(null)

  const setModalHandler = (content) => {
    setModal({ content, active: true })
  }
  const removeModalHandler = () => {
    setModal({ content: null, active: false })
  }

  useEffect(() => {
    console.log(modalAdditState)
  }, modalAdditState)

  return (
    <ModalContext.Provider value={{ setModalHandler, removeModalHandler, modalAdditState, setModalAdditState }}>
      {modal && modal.active && modal.content}
      {children}
    </ModalContext.Provider>
  )
}
