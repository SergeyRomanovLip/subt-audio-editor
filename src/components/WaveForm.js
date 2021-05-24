import React, { useEffect, useRef, useState } from 'react'

export const WaveForm = ({ audio }) => {
  const [position, setPosition] = useState(0)
  const [length, setLength] = useState(0)

  let canvasRef = useRef()
  let audioRef = useRef()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', (e) => {
        setPosition(e.currentTarget.currentTime)
      })
      audioRef.current.addEventListener('canplay', (e) => {
        console.log(e.currentTarget.duration)
        setLength(e.currentTarget.duration)
      })
    }
  }, [audio])

  useEffect(() => {
    setPosition(audioRef.current.currentTime)
    visualizeAudio(audio)
    canvasRef.current.addEventListener('mousemove', () => {
      console.log('yep')
    })
  }, [audio])

  const visualizeAudio = async (url) => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()
    let currentBuffer = null
    await fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        let filtered = filterData(audioBuffer)
        let normalized = normalizeData(filtered)
        draw(normalized)
      })
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

  const draw = (normalizedData) => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const padding = 5
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.translate(0, canvas.offsetHeight / 2)
    const width = canvas.offsetWidth / normalizedData.length
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
      <audio ref={audioRef} src={audio} controls loop />
    </div>
  )
}
