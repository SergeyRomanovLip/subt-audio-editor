import getBlobDuration from 'get-blob-duration'
import React, { useEffect, useRef, useState } from 'react'

export const WaveForm = ({
  collapsed,
  reRecordBlob,
  deleteBlob,
  index,
  audioState,
  audio,
  trimBlob,
  audData,
  changeBlobEng,
  changeBlobRus,
}) => {
  const [existEng, setExistEng] = useState('')
  const [newEng, setNewEng] = useState('')
  const [existRus, setExistRus] = useState('')
  const [newRus, setNewRus] = useState('')

  const [reRecordingState, setReRecordingState] = useState(false)
  const [ownCollapsed, setOwnCollapsed] = useState(false)
  const [preparedAudio, setPreparedAudio] = useState(false)
  const [position, setPosition] = useState(false)
  const [length, setLength] = useState(false)
  const [rect, setRect] = useState(false)
  const [canvasData, setCanvasData] = useState(false)
  const [trim, setTrim] = useState({
    start: 0,
    end: 0,
  })

  const [canvasConfig, setCanvasConfig] = useState({
    height: 100,
    width: 250,
    samples: 500,
  })

  const collapse = () => {
    ownCollapsed ? setOwnCollapsed(false) : setOwnCollapsed(true)
  }

  const canvasSettings = (normalizedData) => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const padding = 5
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.translate(0, canvas.offsetHeight / 2)
    const width = canvas.offsetWidth / normalizedData.length
    return {
      canvas,
      dpr,
      padding,
      ctx,
      width,
    }
  }
  const prepareAudio = async (url) => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()
    let currentBuffer = null
    let normalized = await fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        let filtered = filterData(audioBuffer)
        let normalizedFinal = normalizeData(filtered)
        return normalizedFinal
      })
    return normalized
  }
  const filterData = (audioBuffer) => {
    const rawData = audioBuffer.getChannelData(0)
    const samples = canvasConfig.samples
    const blockSize = Math.floor(rawData.length / samples)
    const filteredData = []
    for (let i = 0; i < samples; i++) {
      filteredData.push(rawData[i * blockSize])
    }
    return filteredData
  }
  const normalizeData = (filteredData) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1)
    return filteredData.map((n) => n * multiplier)
  }
  let canvasRef = useRef()
  let audioRef = useRef()

  const audioInit = () => {
    if (audioRef.current) {
      prepareAudio(audio).then((res) => {
        getBlobDuration(audio).then((res2) => {
          setLength(res2)
          setPosition(audioRef.current.currentTime)
          setPreparedAudio(res)
          setCanvasData(canvasSettings(res))
          setRect(canvasRef.current.getBoundingClientRect())
          draw(res, canvasSettings(res))
        })
      })
    }
  }
  const draw = (normalizedData, canvasData) => {
    if (canvasData) {
      const { canvas, padding, ctx, width } = canvasData

      for (let i = 0; i < normalizedData.length; i++) {
        const x = width * i
        let height = normalizedData[i] * canvas.offsetHeight - padding
        if (height < 0) {
          height = 0
        } else if (height > canvas.offsetHeight / 2) {
          height = height > canvas.offsetHeight / 2
        }
        drawLineSegment(ctx, x, height, width, (i + 1) % 2)
      }
    } else {
      console.log('Ошибка')
    }
  }
  const drawLineSegment = (ctx, x, y, width, isEven) => {
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    y = isEven ? y : -y
    ctx.moveTo(x, 0)
    ctx.lineTo(x, y)
    ctx.arc(x + width / 2, y, width / 2, Math.PI, 0, isEven)
    ctx.lineTo(x + width, 0)
    ctx.stroke()
  }
  const calculatePosition = (rect, length, e) => {
    let x = e.clientX - rect.left
    let perc = x / canvasConfig.width
    let newPosition = length * perc
    return newPosition
  }
  const drawTimeMarker = (position, length, canvasData) => {
    const { canvas, padding, ctx, width } = canvasData
    let pos = (position / length) * canvasConfig.width
    ctx.clearRect(0, -canvasConfig.width, canvas.width, 1500)
    draw(preparedAudio, canvasData)
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(180, 120, 255, 0.5)'
    ctx.beginPath()
    ctx.moveTo(pos, -50)
    ctx.lineTo(pos, 50)
    ctx.stroke()
    ctx.closePath()
  }
  const drawRectangle = (position, length, canvasData, e) => {
    const { canvas, padding, ctx, width } = canvasData
    ctx.clearRect(0, -canvasConfig.width, canvas.width, 1500)
    draw(preparedAudio, canvasData)
    let pos = (positionState.x / length - positionState.startX / length) * canvasConfig.width
    ctx.rect((positionState.startX / length) * canvasConfig.width, -50, pos, 100)
    ctx.fillStyle = 'rgba(180, 120, 255, 0.5)'
    ctx.fill()
  }

  let positionState = {
    mousedown: false,
    startX: null,
    x: null,
  }
  const setCursorPositionHandler = (e) => {
    setPosition(e.currentTarget.currentTime)
  }
  const choiseCursorPosition = (e) => {
    audioRef.current.currentTime = calculatePosition(rect, length, e)
    positionState.mousedown = true
    positionState.startX = calculatePosition(rect, length, e)
    setPosition(calculatePosition(rect, length, e))
  }
  const extendCursorPosition = (e) => {
    if (positionState.mousedown) {
      positionState.x = calculatePosition(rect, length, e)
      drawRectangle(position, length, canvasData, e)
    }
  }
  const fixCursorPosition = (e) => {
    positionState.mousedown = false
    if (positionState.x - positionState.startX > 0.5) {
      setTrim({ start: positionState.startX, end: positionState.x })
      positionState = { mousedown: false, startX: null, x: null }
    } else {
      setTrim({ start: 0, end: 0 })
      setPosition(calculatePosition(rect, length, e))
    }
  }

  useEffect(() => {
    setOwnCollapsed(collapsed)
  }, [collapsed])
  useEffect(audioInit, [audio])
  useEffect(() => {
    canvasData && drawTimeMarker(position, length, canvasData)
  }, [position, canvasData])
  useEffect(() => {
    setExistEng(audData.eng)
    setNewEng(audData.eng)
    setExistRus(audData.rus)
    setNewRus(audData.rus)
  }, [audioState])

  useEffect(() => {
    if ((audioRef, length, rect)) {
      audioRef.current.addEventListener('timeupdate', setCursorPositionHandler)
      canvasRef.current.addEventListener('mousedown', choiseCursorPosition)
      canvasRef.current.addEventListener('mousemove', extendCursorPosition)
      canvasRef.current.addEventListener('mouseup', fixCursorPosition)
    }
    return () => {
      if (audioRef.current && canvasRef.current) {
        audioRef.current.removeEventListener('timeupdate', setCursorPositionHandler)
        canvasRef.current.removeEventListener('mousedown', choiseCursorPosition)
        canvasRef.current.removeEventListener('mousemove', extendCursorPosition)
        canvasRef.current.removeEventListener('mouseup', fixCursorPosition)
      }
    }
  }, [canvasRef, length, rect])

  return (
    <div className={'audio-container'}>
      <div onClick={collapse} className='order-number'>
        <span>{index + 1}</span>
      </div>
      <div className={'input-name'}>
        <textarea
          placeholder={'rus'}
          value={newRus}
          rows={2}
          onChange={(e) => {
            setNewRus(e.target.value)
          }}
        ></textarea>
        {existRus !== newRus ? (
          <span
            onClick={() => {
              changeBlobEng(newEng, audData.id)
              changeBlobRus(newRus, audData.id)
            }}
            className='material-icons'
          >
            check_circle
          </span>
        ) : (
          ''
        )}
        {existRus !== newRus ? (
          <span
            onClick={() => {
              setNewRus(existRus)
            }}
            className='material-icons'
          >
            highlight_off
          </span>
        ) : (
          ''
        )}
      </div>
      <div className={'input-name'}>
        <textarea
          placeholder={'eng'}
          value={newEng}
          rows={2}
          onChange={(e) => {
            setNewEng(e.target.value)
          }}
        ></textarea>
        {existEng !== newEng ? (
          <span
            onClick={() => {
              changeBlobEng(newEng, audData.id)
              changeBlobRus(newRus, audData.id)
            }}
            className='material-icons'
          >
            check_circle
          </span>
        ) : (
          ''
        )}
        {existEng !== newEng ? (
          <span
            onClick={() => {
              setNewEng(existEng)
            }}
            className='material-icons'
          >
            highlight_off
          </span>
        ) : (
          ''
        )}
      </div>

      <div style={{ display: ownCollapsed ? 'none' : 'block' }}>
        <div className='canvas-container'>
          <canvas ref={canvasRef} style={{ width: canvasConfig.width + 'px', height: canvasConfig.height + 'px' }} />
          {/* <div className='glass'></div> */}
        </div>

        <audio preload={'metadata'} ref={audioRef} src={audio} controls />
        <div
          className={`btn ${trim.start !== 0 ? '' : 'unclicable'}`}
          onClick={() => {
            setTrim({
              start: 0,
              end: 0,
            })
            trimBlob(audio, audData.id, trim)
          }}
        >
          Trim
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        {/* <div onClick={collapse} style={{ margin: 0, padding: 1 + 'px', fontSize: 10 }} className='btn'>
          Collapse
        </div> */}
        <div
          onClick={() => {
            deleteBlob(audData.id)
          }}
          style={{ margin: 0, padding: 1 + 'px', fontSize: 10 }}
          className='btn'
        >
          Delete
        </div>
        <div
          onClick={() => {
            if (reRecordingState) {
              setReRecordingState(false)
              reRecordBlob(audData.id, 'stop')
            } else {
              setReRecordingState(true)
              reRecordBlob(audData.id, 'start')
            }
          }}
          style={{ margin: 0, padding: 1 + 'px', fontSize: 10, background: reRecordingState ? 'red' : 'white' }}
          className='btn'
        >
          ReRecord
        </div>
      </div>
    </div>
  )
}
