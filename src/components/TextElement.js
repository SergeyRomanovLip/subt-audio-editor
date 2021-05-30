import React, { useEffect, useRef, useState } from 'react'

export const TextElement = ({ playingElem, index, elem, lang, playExactElement }) => {
  const thisEl = useRef()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(thisEl.current.clientWidth)
  }, [thisEl])

  useEffect(() => {
    console.log(width)
  }, [width])

  return (
    <span
      className='text-item'
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
