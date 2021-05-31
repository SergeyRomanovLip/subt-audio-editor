import React, { useEffect, useRef, useState } from 'react'

export const TextElement = ({ playingElem, index, elem, lang, playExactElement }) => {
  const thisEl = useRef()
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(thisEl.current.clientWidth)
  }, [thisEl])

  const spaceDevider = (string) => {
    string = string.split(' ')
    var stringArray = new Array()
    for (var i = 0; i < string.length; i++) {
      stringArray.push(string[i])
      if (i != string.length - 1) {
        stringArray.push(' ')
      }
    }
    return stringArray
  }

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
      {/* {spaceDevider(elem[lang]).map((e) => {
        return (
          <span
            onClick={() => {
              console.log(e)
            }}
            className={'textElementForHover'}
          >
            {e}
          </span>
        )
      })} */}
      {elem[lang]}
    </span>
  )
}
