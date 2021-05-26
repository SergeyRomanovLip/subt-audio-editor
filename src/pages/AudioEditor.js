import React, { useEffect, useRef, useState } from 'react'
import WavEncoder from 'wav-encoder'
import { AudioRecorder } from '../components/AudioRecorder'
import { WaveForm } from '../components/WaveForm'

export const AudioEditor = () => {
  const [audioState, setAudioState] = useState([])

  const getBlob = async (blob) => {
    setAudioState((prev) => [...prev, blob])
  }

  const trimBlob = async (sound) => {
    console.log(sound)
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    let start = 0.5
    let end = 2.5
    let audioContext = new AudioContext()
    let cropped = await fetch(sound)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then(function (decodedData) {
        console.log(decodedData)
        let computedStart = (decodedData.length * start) / decodedData.duration
        let computedEnd = (decodedData.length * end) / decodedData.duration
        console.log(computedStart)
        console.log(computedEnd)
        const newBuffer = audioContext.createBuffer(decodedData.numberOfChannels, computedEnd - computedStart, decodedData.sampleRate)
        for (var i = 0; i < decodedData.numberOfChannels; i++) {
          newBuffer.copyToChannel(decodedData.getChannelData(i).slice(computedStart, computedEnd), i)
        }
        console.log(newBuffer)
        let formattedArray = {
          channelData: Array.apply(null, { length: newBuffer.numberOfChannels - 1 - 0 + 1 })
            .map((v, i) => i + 0)
            .map((i) => newBuffer.getChannelData(i)),
          sampleRate: newBuffer.sampleRate
          // length: newBuffer.length
        }
        WavEncoder.encode(formattedArray).then((buffer) => {
          let blob = new Blob([buffer], { type: 'audio' })
          let uriBlob = URL.createObjectURL(blob)
          getBlob(uriBlob)
        })
      })
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
                  <WaveForm audio={el} trimBlob={trimBlob} i={i} />
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
