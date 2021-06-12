import firebase from 'firebase/app'
import { collection, addDoc } from 'firebase/firestore'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDgWfcnCFhuzp5mAzfJgVNtHw8agL2JSqk',
  authDomain: 'subt-audio-editor.firebaseapp.com',
  projectId: 'subt-audio-editor',
  storageBucket: 'subt-audio-editor.appspot.com',
  messagingSenderId: '692733242355',
  appId: '1:692733242355:web:dea2a21a95de69a6984086',
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storageRoot = firebase.storage().ref()

export const tryFirebase = async () => {
  firestore
    .collection('users')
    .add({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch((error) => {
      console.error('Error adding document: ', error)
    })
}

// export const createNewProject = async()=>{
//   firestore.
// }

export const getExistingProjects = async () => {
  let listOfFiles = await firestore.collection('projects').get()
  let projects = listOfFiles.docs.map((e) => e.data())
  return projects
}
export const addNewPartOfProject = async (projectArray, projectName, callback) => {
  if (projectArray) {
    callback(true)
    let listOfFiles = await storageRoot.child(`/projects/${projectName}`).list()
    let existsFiles = listOfFiles.items.map((e) => {
      return JSON.parse(e.name).id
    })
    let existsNames = listOfFiles.items.map((e) => {
      return JSON.parse(e.name)
    })
    let projectDescription = projectArray.map((e, i) => {
      return { order: i, eng: e.eng, rus: e.rus, id: e.id, duration: e.duration }
    })
    try {
      await firestore.collection('projects').doc(projectName).set({
        projectName,
        projectDescription,
      })
      console.log('done')
    } catch (e) {
      console.log(e)
    }

    await Promise.all(
      projectArray.map(async (e, i) => {
        let pieceName = JSON.stringify({ order: i, eng: e.eng, rus: e.rus, id: e.id, duration: e.duration })
        if (existsFiles.includes(e.id)) {
          let ref = await storageRoot.child(`/projects/${projectName}/${pieceName}`)
          await ref.delete()
          await storageRoot
            .child(`/projects/${projectName}/${pieceName}`)
            .putString(e.base64Audio.split(',')[1], 'base64', { contentType: 'audio/wav' })
        } else {
          await storageRoot
            .child(`/projects/${projectName}/${pieceName}`)
            .putString(e.base64Audio.split(',')[1], 'base64', { contentType: 'audio/wav' })
        }
        console.log('Done')
      })
    )
    callback(false)
  }
}
