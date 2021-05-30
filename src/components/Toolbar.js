import React, { useState } from 'react'
import { ToolbarContext } from './../context/ToolbarContext'
import { idGenerator } from './../utils/idGenerator'

export const Toolbar = ({ children }) => {
  const [controllers, setControllers] = useState([])

  return (
    <ToolbarContext.Provider value={{ setControllers }}>
      <div className='toolbar'>
        {controllers.map((e, i) => {
          return (
            <div key={i + idGenerator()} className='toolbar-item'>
              {e}
            </div>
          )
        })}
      </div>
      {children}
    </ToolbarContext.Provider>
  )
}
