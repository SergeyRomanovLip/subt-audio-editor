import getBlobDuration from 'get-blob-duration'
import React, { useContext, useEffect, useRef, useState } from 'react'
import WavEncoder from 'wav-encoder'
import { AudioRecorder } from '../components/AudioRecorder'
import { WaveForm } from '../components/WaveForm'
import { ToolbarContext } from '../context/ToolbarContext'
import { idGenerator } from '../utils/idGenerator'
import { AppContext } from './../context/AppContext'

export const AudioEditor = () => {
  const [audioState, setAudioState] = useState([])
  const { appDispatch, appState } = useContext(AppContext)
  const { setControllers } = useContext(ToolbarContext)
  const [collapsed, setCollapsed] = useState(false)
  const fileRef = useRef()
  const audioRecorderRef = useRef()

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
        resolve(base64)
      }
    })
  }
  const deleteBlob = (id) => {
    setAudioState((prev) => {
      let newState = prev.filter((el) => {
        return el.id !== id
      })
      newState.length === 0 && appDispatch({ type: 'UPDATE-AUDIO', payload: [] })
      return [...newState]
    })
  }
  const reRecordBlob = (id, status) => {
    if (status === 'start') {
      audioRecorderRef.current.reRecordItem(id)
    } else if (status === 'stop') {
      audioRecorderRef.current.stopReRecordItem(id)
    }
  }
  const getBlob = async (blob, id, foo) => {
    foo && foo()
    let base64Audio = await promiseReader(blob)
    let duration = await getBlobDuration(blob)
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
              e.duration = duration
              return e
            } else {
              return e
            }
          })
        : [...prev, { blob, base64Audio, duration, id: idGenerator(), eng: '', rus: '' }]
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
        }
        WavEncoder.encode(formattedArray).then((buffer) => {
          let blob = new Blob([buffer], { type: 'audio/wav' })
          let uriBlob = URL.createObjectURL(blob)
          getBlob(uriBlob, id)
        })
      })
  }
  const downloadProject = () => {
    // console.log(String.)
    return 'data:text/json;charset=utf-8,' + localStorage.getItem('project')
    // return new Promise((resolve, reject) => {
    //   let reader = new FileReader()
    //   let blob = new Blob(appState.blob)
    //   console.log(blob)
    //   reader.readAsBinaryString(blob)
    //   reader.onloadend = function () {
    //     let binary = reader.result
    //     console.log(binary)
    //   }
    // })
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
  const createNewProject = () => {
    let conf = window.confirm('All unsaved data will be lost')
    conf && setAudioState([])
    conf && appDispatch({ type: 'UPDATE-AUDIO', payload: [] })
  }
  useEffect(() => {
    if (audioState.length > 0) {
      appDispatch({ type: 'UPDATE-AUDIO', payload: audioState })
    }
  }, [audioState])
  useEffect(() => {
    setControllers([
      <a download='project.json' className='btn' href={downloadProject()}>
        Save project
      </a>,
      <input type='file' id='file-input-id' ref={fileRef} onChange={openProject} style={{ display: 'none' }}></input>,
      <div className='btn' onClick={createNewProject}>
        Create project
      </div>,
      <div
        className='btn'
        onClick={() => {
          fileRef.current.click()
        }}
      >
        Open project
      </div>,
    ])
  }, [audioState, appState, collapsed])
  useEffect(initializing, [])

  return (
    <div className='audioContainer'>
      <AudioRecorder ref={audioRecorderRef} getBlob={getBlob} reRecordBlob={reRecordBlob} />
      <div>
        <div className='btn' onClick={colapse}>
          Collapse
        </div>
        <ul>
          {audioState.length > 0 &&
            audioState.map((el, index) => {
              return (
                <li key={index}>
                  <WaveForm
                    collapsed={collapsed}
                    deleteBlob={deleteBlob}
                    reRecordBlob={reRecordBlob}
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
