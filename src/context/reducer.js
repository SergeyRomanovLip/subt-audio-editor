import { addNewPartOfProject } from '../backend/firebase'

export const reducer = (state, action) => {
  console.log(state)
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 }
    case 'SUB':
      return { count: state.count - 1 }
    case 'UPDATE-AUDIO':
      localStorage.setItem('project', JSON.stringify(action.payload.audioState))
      return { ...state, project: action.payload.audioState }
    case 'SAVE-PROJECT':
      addNewPartOfProject(action.payload.audioState, action.payload.projectName, action.payload.callback)
    default:
      return state
  }
}
