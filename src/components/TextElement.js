import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from './../context/AppContext'

export const TextElement = ({ playingElem, index, elem, lang, playExactElement }) => {
  const thisEl = useRef()

  return (
    <span
      ref={thisEl}
      onClick={() => {
        playExactElement(elem, index)
      }}
      style={{ background: playingElem === index ? 'lightgray' : 'white', cursor: 'pointer' }}
    >
      {' '}
      {elem[lang]}
    </span>
  )
}
