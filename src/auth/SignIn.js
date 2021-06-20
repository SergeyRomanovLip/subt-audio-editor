import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { auth } from 'backend/firebaseConfig'
import { LoaderContext } from 'context/LoaderContext'

export const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { loadingHandler } = useContext(LoaderContext)
  const history = useHistory()
  const signInWithEmailAndPasswordHandler = async (event, email, password) => {
    loadingHandler(true)
    event.preventDefault()
    try {
      await auth.signInWithEmailAndPassword(email, password).catch((error) => {
        errorHandler(error.message)
      })
    } catch (e) {
      alert(e)
    } finally {
      loadingHandler(false)
    }
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget

    if (name === 'userEmail') {
      setEmail(value)
    } else if (name === 'userPassword') {
      setPassword(value)
    }
  }

  const errorHandler = (error) => {
    setError(error)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  return (
    <div className='infoWindow'>
      <div className='infoWindow-header'>
        Sign In
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            history.push('/')
          }}
          className='material-icons'
        >
          home
        </span>
      </div>
      <hr></hr>
      <div className='infoWindow-body'>
        {error !== null && (
          <div style={{ backgroundColor: 'darkred', color: 'white' }} className={'infoWindow-body-form-input'}>
            {error}
          </div>
        )}
        <form className=''>
          <input
            autoComplete='on'
            type='email'
            className='infoWindow-body-form-input'
            name='userEmail'
            value={email}
            placeholder='Your email'
            id='userEmail'
            onChange={(event) => onChangeHandler(event)}
          />
          <input
            autoComplete='on'
            type='password'
            className='infoWindow-body-form-input'
            name='userPassword'
            value={password}
            placeholder='Your Password'
            id='userPassword'
            onChange={(event) => onChangeHandler(event)}
          />
          <div
            className='infoWindow-body-form-button'
            onClick={(event) => {
              signInWithEmailAndPasswordHandler(event, email, password)
            }}
          >
            Sign in
          </div>
          <Link className={'infoWindow-body-form-input'} to='/auth/signUp'>
            If you dont have an account click here
          </Link>
        </form>
      </div>
    </div>
  )
}
export default SignIn
