import { signOutUser } from './firebaseConfig'

export const signOutHandler = (event) => {
  event.preventDefault()
  signOutUser()
  localStorage.clear()
}
