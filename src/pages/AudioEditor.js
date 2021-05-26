import React, { useEffect, useRef, useState } from 'react'
import WavEncoder from 'wav-encoder'
import { AudioRecorder } from '../components/AudioRecorder'
import { WaveForm } from '../components/WaveForm'
import { idGenerator } from '../utils/idGenerator'

export const AudioEditor = () => {
  const [audioState, setAudioState] = useState([])

  const getBlob = async (blob, index) => {
    if (index >= 0) {
      setAudioState((prev) => {
        let prevId = 0
        let prevNam = 0
        let newArray = prev.filter((e, i) => {
          if (i === index) {
            prevId = e.id
            prevNam = e.nam
          }
          return i !== index
        })
        return [...newArray, { blob, id: prevId, nam: prevNam }]
      })
    } else {
      setAudioState((prev) => [...prev, { blob, id: idGenerator(), nam: 'unnamed' }])
    }
  }
  const changeBlobName = (e) => {
    console.log('new name: ', e)
  }

  const trimBlob = async (sound, index, trim) => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    let { start, end } = trim
    let audioContext = new AudioContext()
    let cropped = await fetch(sound)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then(function (decodedData) {
        let computedStart = (decodedData.length * start) / decodedData.duration
        let computedEnd = (decodedData.length * end) / decodedData.duration
        const newBuffer = audioContext.createBuffer(
          decodedData.numberOfChannels,
          computedEnd - computedStart,
          decodedData.sampleRate
        )
        for (var i = 0; i < decodedData.numberOfChannels; i++) {
          newBuffer.copyToChannel(decodedData.getChannelData(i).slice(computedStart, computedEnd), i)
        }
        let formattedArray = {
          channelData: Array.apply(null, { length: newBuffer.numberOfChannels - 1 - 0 + 1 })
            .map((v, i) => i + 0)
            .map((i) => newBuffer.getChannelData(i)),
          sampleRate: newBuffer.sampleRate,
          // length: newBuffer.length
        }
        WavEncoder.encode(formattedArray).then((buffer) => {
          let blob = new Blob([buffer], { type: 'audio' })
          let uriBlob = URL.createObjectURL(blob)
          getBlob(uriBlob, index)
        })
      })
  }

  return (
    <div className='container'>
      <AudioRecorder getBlob={getBlob} />
      <div>
        <ul>
          {audioState.length > 0 &&
            audioState.map((el, index) => {
              return (
                <li key={index}>
                  <WaveForm
                    audio={el.blob}
                    trimBlob={trimBlob}
                    index={index}
                    audData={el}
                    changeBlobName={changeBlobName}
                  />
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
