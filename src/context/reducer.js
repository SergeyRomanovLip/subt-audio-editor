import { addNewPartOfProject } from '../backend/firebase'

export const reducer = (state, action) => {
  console.log(state)
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 }
    case 'SUB':
      return { count: state.count - 1 }
    case 'UPDATE-AUDIO':
      addNewPartOfProject(action.payload.audioState, action.payload.projectName)
      localStorage.setItem('project', JSON.stringify(action.payload.audioState))
      return { ...state, project: action.payload.audioState }
    default:
      return state
  }
}
