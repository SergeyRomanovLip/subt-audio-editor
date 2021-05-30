import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

export const AudioRecorder = forwardRef(({ getBlob }, ref) => {
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream, clearBlobUrl } = useReactMediaRecorder({
    audio: true
  })
  const [id, setId] = useState(undefined)

  useImperativeHandle(
    ref,
    () => ({
      reRecordItem(id) {
        setId(id)
        clearBlobUrl()
        startRecording()
      }
    }),
    []
  )

  useEffect(() => {
    console.log(id)
  }, [id])

  useEffect(() => {
    mediaBlobUrl && getBlob(mediaBlobUrl, id, setId(undefined))
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
})
