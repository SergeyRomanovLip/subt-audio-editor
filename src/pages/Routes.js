import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { WelcomePage } from './WelcomePage'
import { AudioEditorPage } from './AudioEditorPage'
import { AuthPage } from '../auth/AuthPage'

export const Routes = () => {
  return (
    <Router></Router>
    <Switch>
      <Route path='/editor'>
        <AudioEditorPage />
      </Route>
      <Route path='/'>
        <WelcomePage />
      </Route>
      <Route path='/auth' exact>
        <AuthPage />
      </Route>
      {/* <Redirect to={} /> */}
    </Switch>
  )
}
