import getBlobDuration from 'get-blob-duration'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from './../context/AppContext'
import { TextElement } from './TextElement'

export const TextContainer = () => {
  const { appState } = useContext(AppContext)
  const [playingElem, setPlayingElem] = useState(false)
  const audioRef = useRef()

  const delay = (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('done')
      }, ms * 1000 + 100)
    })
  }

  const playExactElement = async (elem, index) => {
    setPlayingElem({ blob: elem.base64Audio, index: index })
    let duration = await getBlobDuration(elem.base64Audio)
    audioRef.current.play()
    await delay(duration)
  }

  const text = useCallback(
    {
      playStatus: false,
      stop: function () {
        this.playStatus = false
        console.log(this.playStatus)
      },
      play: async function (playingElem) {
        this.playStatus = true
        let length = appState.project?.length
        for await (let [i, e] of appState.project.entries()) {
          if (this.playStatus) {
            if (playingElem && playingElem.index && playingElem.index > i) {
              console.log('do nothing')
            } else {
              setPlayingElem({ blob: e.base64Audio, index: i })
              let duration = await getBlobDuration(e.base64Audio)
              audioRef.current.play()
              await delay(duration)
              if (i === length - 1) {
                console.log('Finish')
                setPlayingElem(false)
              }
            }
          } else {
            break
          }
        }
        // setPlayingElem(false)
      }
    },
    [appState]
  )

  return (
    <div className={'textContainer'}>
      <audio ref={audioRef} src={playingElem && playingElem.blob} className={'player'}></audio>
      <div
        onClick={() => {
          text.play(playingElem)
        }}
        className={'btn'}
      >
        play
      </div>
      <div
        onClick={() => {
          text.stop()
        }}
        className={'btn'}
      >
        stop
      </div>
      <div className='langWindow'>
        {appState.project
          ? appState.project.map((elem, index) => {
              return (
                <TextElement key={index} playExactElement={playExactElement} playingElem={playingElem.index} index={index} elem={elem} lang={'eng'} />
              )
            })
          : null}
      </div>
      <div className='langWindow'>
        {appState.project
          ? appState.project.map((elem, index) => {
              return (
                <TextElement key={index} playExactElement={playExactElement} playingElem={playingElem.index} index={index} elem={elem} lang={'rus'} />
              )
            })
          : null}
      </div>
    </div>
  )
}