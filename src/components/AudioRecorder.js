import React, { useEffect } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

export const AudioRecorder = ({ getBlob }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } = useReactMediaRecorder({
    audio: true
  })

  useEffect(() => {
    mediaBlobUrl && getBlob(mediaBlobUrl)
  }, [mediaBlobUrl])

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <div>
      <div className={status === 'recording' ? 'btn active' : 'btn'} onClick={startRecording}>
        Record
      </div>
      <div className={'btn'} onClick={stopRecording}>
        Stop
      </div>
    </div>
  )
}
