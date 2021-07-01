import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { auth, firestore, generateUserDocument } from 'backend/firebaseConfig'
import { LoaderContext } from 'context/LoaderContext'

export const SignUp = () => {
  const { loadingHandler } = useContext(LoaderContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [FIO, setFIO] = useState('')
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [key, setKey] = useState('')
  const [error, setError] = useState(null)
  const history = useHistory()

  const errorHandler = (error) => {
    setError(error)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault()
    loadingHandler(true)
    try {
      let id = null
      let maxNumOfUsers = null
      const ref = firestore.collection('companies').where('name', '==', company).where('key', '==', key)
      await ref.get().then((doc) =>
        doc.forEach(async (doc) => {
          id = doc.id
          maxNumOfUsers = doc.data().maxNumOfUsers
        })
      )
      let existNumOfUsers = await firestore
        .collection('companies')
        .doc(id)
        .collection('users')
        .where('FIO', '!=', null)
        .get()
        .then((snap) => {
          return snap.size
        })
      if (id && existNumOfUsers + 1 <= maxNumOfUsers) {
        console.log('Данные верны')
        const { user } = await auth.createUserWithEmailAndPassword(email, password)
        generateUserDocument(user, { FIO, email, position, company, id })
      } else if (id && existNumOfUsers + 1 > maxNumOfUsers) {
        alert('Достигнуто максимальное количество сотрудников для вашей компании')
      } else {
        alert('Вы не правильно указали данные вашей компании')
      }
    } catch (error) {
      errorHandler(error.message)
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
    } else if (name === 'FIO') {
      setFIO(value)
    } else if (name === 'position') {
      setPosition(value)
    } else if (name === 'company') {
      setCompany(value)
    } else if (name === 'key') {
      setKey(value)
    }
  }
  return (
    <div className='infoWindow'>
      <div className='infoWindow-header'>
        Sign Up
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            history.push('/')
          }}
          class='material-icons'
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
            type='text'
            className='infoWindow-body-form-input'
            name='FIO'
            value={FIO}
            placeholder='Full name'
            id='FIO'
            onChange={(event) => onChangeHandler(event)}
          />
          <input
            autoComplete='on'
            type='text'
            className='infoWindow-body-form-input'
            name='position'
            value={position}
            placeholder='Position'
            id='position'
            onChange={(event) => onChangeHandler(event)}
          />
          <input
            autoComplete='on'
            type='text'
            className='infoWindow-body-form-input'
            name='company'
            value={company}
            placeholder='Your company'
            id='company'
            onChange={(event) => onChangeHandler(event)}
          />
          <input
            autoComplete='on'
            type='text'
            className='infoWindow-body-form-input'
            name='key'
            value={key}
            placeholder='Key'
            id='key'
            onChange={(event) => onChangeHandler(event)}
          />
          <input
            autoComplete='on'
            type='email'
            className='infoWindow-body-form-input'
            name='userEmail'
            value={email}
            placeholder='Your Email'
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
              createUserWithEmailAndPasswordHandler(event, email, password)
            }}
          >
            Sign up
          </div>
          <Link className={'infoWindow-body-form-input'} to='/signIn'>
            You've already have an account? Click here
          </Link>
        </form>
      </div>
    </div>
  )
}
