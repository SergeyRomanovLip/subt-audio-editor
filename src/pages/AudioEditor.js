import React, { useContext, useEffect, useRef, useState } from 'react'
import WavEncoder from 'wav-encoder'
import { AudioRecorder } from '../components/AudioRecorder'
import { WaveForm } from '../components/WaveForm'
import { idGenerator } from '../utils/idGenerator'
import { AppContext } from './../context/AppContext'

export const AudioEditor = () => {
  const [audioState, setAudioState] = useState([])
  const { appDispatch, appState } = useContext(AppContext)
  const [collapsed, setCollapsed] = useState(false)
  const fileRef = useRef()

  const initializing = () => {
    if (localStorage.getItem('project')) {
      setAudioState(JSON.parse(localStorage.getItem('project')))
    }
  }
  const colapse = () => {
    collapsed ? setCollapsed(false) : setCollapsed(true)
  }
  const promiseReader = async (bl) => {
    let blob = await fetch(bl)
    blob = await blob.blob()
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        let base64 = reader.result
        console.log(base64)
        resolve(base64)
      }
    })
  }
  const getBlob = async (blob, id) => {
    let base64Audio = await promiseReader(blob)
    setAudioState((prev) => {
      let exist = false
      prev.forEach((e) => {
        if (e.id === id) {
          exist = true
        }
      })
      let newState = exist
        ? prev.map((e) => {
            if (e.id === id) {
              e.blob = blob
              e.base64Audio = base64Audio
              return e
            } else {
              return e
            }
          })
        : [...prev, { blob, base64Audio, id: idGenerator(), eng: '', rus: '' }]
      return [...newState]
    })
  }
  const changeBlobEng = (eng, id) => {
    setAudioState((prev) => {
      let newState = prev.map((e) => {
        if (e.id === id) {
          e.eng = eng
          return e
        } else {
          return e
        }
      })
      return [...newState]
    })
  }
  const changeBlobRus = (rus, id) => {
    setAudioState((prev) => {
      let newState = prev.map((e) => {
        if (e.id === id) {
          e.rus = rus
          return e
        } else {
          return e
        }
      })
      return [...newState]
    })
  }
  const trimBlob = async (sound, id, trim) => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    let { start, end } = trim
    let audioContext = new AudioContext()
    let cropped = await fetch(sound)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then(function (decodedData) {
        let computedStart = (decodedData.length * start) / decodedData.duration
        let computedEnd = (decodedData.length * end) / decodedData.duration
        const newBuffer = audioContext.createBuffer(decodedData.numberOfChannels, computedEnd - computedStart, decodedData.sampleRate)
        for (var i = 0; i < decodedData.numberOfChannels; i++) {
          newBuffer.copyToChannel(decodedData.getChannelData(i).slice(computedStart, computedEnd), i)
        }
        let formattedArray = {
          channelData: Array.apply(null, { length: newBuffer.numberOfChannels - 1 - 0 + 1 })
            .map((v, i) => i + 0)
            .map((i) => newBuffer.getChannelData(i)),
          sampleRate: newBuffer.sampleRate
        }
        WavEncoder.encode(formattedArray).then((buffer) => {
          let blob = new Blob([buffer], { type: 'audio/wav' })
          let uriBlob = URL.createObjectURL(blob)
          getBlob(uriBlob, id)
        })
      })
  }

  const downloadProject = () => {
    return 'data:text/json;charset=utf-8,' + localStorage.getItem('project')
  }

  const openProjectPromise = async (file) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader()
      fr.onloadend = function (json) {
        resolve(json.currentTarget.result)
      }
      fr.readAsText(file)
    })
  }

  const openProject = async (e) => {
    let json = await openProjectPromise(fileRef.current.files[0])
    setAudioState(JSON.parse(json))
  }

  useEffect(() => {
    if (audioState.length > 0) {
      appDispatch({ type: 'UPDATE-AUDIO', payload: audioState })
    }
  }, [audioState])

  useEffect(initializing, [])

  return (
    <div className='audioContainer'>
      <AudioRecorder getBlob={getBlob} />
      <div>
        <div className='btn' onClick={colapse}>
          colapse
        </div>
        <a download='project.json' className='btn' href={downloadProject()}>
          download project
        </a>
        <input type='file' id='file-input-id' ref={fileRef} onChange={openProject}></input>
        <ul>
          {audioState.length > 0 &&
            audioState.map((el, index) => {
              return (
                <li key={index}>
                  <WaveForm
                    collapsed={collapsed}
                    audioState={audioState}
                    audio={el.base64Audio}
                    trimBlob={trimBlob}
                    index={index}
                    audData={el}
                    changeBlobEng={changeBlobEng}
                    changeBlobRus={changeBlobRus}
                  />
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
