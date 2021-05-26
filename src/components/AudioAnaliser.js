import React from 'react'

export const AudioAnaliser = () => {
  let canvas = document.getElementById('audio_visual')
  let ctx = canvas.getContext('2d')
  let audioElement = document.getElementById('source')
  let audioCtx = new AudioContext()
  let analyser = audioCtx.createAnalyser()
  analyser.fftSize = 2048
  let source = audioCtx.createMediaElementSource(audioElement)
  source.connect(analyser)
  source.connect(audioCtx.destination)
  let data = new Uint8Array(analyser.frequencyBinCount)
  requestAnimationFrame(loopingFunction)

  function draw(data) {
    data = [...data]
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let space = canvas.width / data.length
    data.forEach((value, i) => {
      ctx.beginPath()
      ctx.moveTo(space * i, canvas.height) //x,y
      ctx.lineTo(space * i, canvas.height - value) //x,y
      ctx.stroke()
    })
  }

  analyser.getByteFrequencyData(data)
  function loopingFunction() {
    requestAnimationFrame(loopingFunction)
    analyser.getByteFrequencyData(data)
    draw(data)
  }

  audioElement.onplay = () => {
    audioCtx.resume()
  }
  return (
    <div>
      <audio id='source' src='../my/audio/file.mp3'></audio>
      <canvas id='audio_visual'></canvas>
      <canvas id='audio_visual' height='500' width='500'></canvas>
    </div>
  )
}
