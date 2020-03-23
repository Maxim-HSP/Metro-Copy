export const initialState = {
  loading: false,
  previewVisible: false,
  previewImage: '',
  fileList: [],
}

export function reducer(state, action) {
  switch (action.type) {
    case 'PREVIEW':
      return { ...state, previewImage: action.payload, previewVisible: true }
    case 'CANCEL':
      return { ...state, previewVisible: false }
    case 'CHANGE':
      return { ...state, fileList: action.payload }
    case 'TOGGLELOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}
