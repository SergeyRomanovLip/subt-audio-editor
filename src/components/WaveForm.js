import React, { useEffect, useRef, useState } from 'react'

export const WaveForm = ({ audio }) => {
  const [preparedAudio, setPreparedAudio] = useState(null)
  const [position, setPosition] = useState(0)
  const [length, setLength] = useState(0)
  const [canvasData, setCanvasData] = useState(null)

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
    const samples = 1000
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', (e) => {
        setPosition(e.currentTarget.currentTime)
      })
      audioRef.current.addEventListener('loadedmetadata', (e) => {
        e.currentTarget.currentTime = 10000
        audioRef.current.addEventListener('timeupdate', (e) => {
          setLength(e.currentTarget.duration)
        })
      })
      prepareAudio(audio).then((res) => {
        setPreparedAudio(res)
        setPosition(audioRef.current.currentTime)
      })
    }
  }, [audio])

  const changeCursorPosition = (e) => {
    let rect = e.target.getBoundingClientRect()
    let x = e.clientX - rect.left
    let perc = x / 300
    let newPosition = length * perc
    setPosition(newPosition)
  }

  useEffect(() => {
    if (preparedAudio) {
      setCanvasData(canvasSettings(preparedAudio))
      canvasRef.current.addEventListener('click', (e) => {
        changeCursorPosition(e)
      })
    }
  }, [preparedAudio])

  useEffect(() => {
    if (canvasData) {
      draw(preparedAudio, canvasData)
    }
  }, [canvasData])

  useEffect(() => {
    console.log(position, length)
    if (position) {
      drawTimeMarker(position, length, canvasData)
    }
  }, [position])

  useEffect(() => {
    console.log(length)
  }, [length])

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

  const drawTimeMarker = (position, length, canvasData) => {
    if (canvasData && length !== 1000) {
      const { canvas, padding, ctx, width } = canvasData
      let pos = (position / length) * 300 //ЗАМЕНИТЬ!!!
      ctx.clearRect(0, -300, canvas.width, 1500)
      draw(preparedAudio, canvasData)
      ctx.lineWidth = 3
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(pos, -50)
      ctx.lineTo(pos, 50)
      ctx.stroke()
      ctx.closePath()
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
  return (
    <div>
      <canvas ref={canvasRef} />
      <audio preload={'metadata'} ref={audioRef} src={audio} controls loop />
    </div>
  )
}
