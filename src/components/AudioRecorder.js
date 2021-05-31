import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

export const AudioRecorder = forwardRef(({ getBlob }, ref) => {
  const [id, setId] = useState(undefined)
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
  })

  useImperativeHandle(
    ref,
    () => ({
      reRecordItem(id) {
        setId(id)
        clearBlobUrl()
        startRecording()
      },
      stopReRecordItem(id) {
        stopRecording()
      },
    }),
    []
  )

  useEffect(() => {
    mediaBlobUrl && getBlob(mediaBlobUrl, id, setId(undefined))
  }, [mediaBlobUrl])

  return (
    <div>
      <div
        className={status === 'recording' ? 'btn active' : 'btn'}
        onClick={() => {
          if (status === 'recording') {
            stopRecording()
          } else if (status === 'idle' || status === 'stopped') {
            startRecording()
          }
        }}
      >
        Record
      </div>
    </div>
  )
})
