import React, { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

export const AudioRecorder = ({ getBlob }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
  })

  useEffect(() => {
    mediaBlobUrl && getBlob(mediaBlobUrl)
  }, [mediaBlobUrl])

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <div>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  )
}
