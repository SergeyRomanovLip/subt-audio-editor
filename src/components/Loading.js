import React, { useState } from 'react'
import { LoadingContext } from '../context/LoadingContext'

export const Loading = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const loadingSwitch = (state) => {
    if (state) {
      setLoading(state)
    } else {
      setLoading((prev) => {
        prev ? setLoading(false) : setLoading(true)
      })
    }
  }

  return (
    <LoadingContext.Provider value={{ loadingSwitch }}>
      {loading && (
        <div className='overlay'>
          <div className='lds-default'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  )
}
