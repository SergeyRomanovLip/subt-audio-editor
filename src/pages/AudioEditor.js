import React, { useEffect, useRef, useState } from 'react'
import { AudioRecorder } from '../components/AudioRecorder'
import { WaveForm } from '../components/WaveForm'

export const AudioEditor = () => {
  const [audioState, setAudioState] = useState([])

  const getBlob = async (blob) => {
    setAudioState((prev) => [...prev, blob])
  }

  return (
    <div className='container'>
      <AudioRecorder getBlob={getBlob} />
      <div>
        <ul>
          {audioState.length > 0 &&
            audioState.map((el, i) => {
              return (
                <li key={i}>
                  <WaveForm audio={el} />
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
