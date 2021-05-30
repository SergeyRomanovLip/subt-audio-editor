export const reducer = (state, action) => {
  console.log(state)
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 }
    case 'SUB':
      return { count: state.count - 1 }
    case 'UPDATE-AUDIO':
      console.log(action)
      localStorage.setItem('project', JSON.stringify(action.payload))
      return { ...state, project: action.payload }
    default:
      return state
  }
}
