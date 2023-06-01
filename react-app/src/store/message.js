// constant variables for action creator
const GET_MESSAGE = "message/GET_MESSAGE"
const POST_MESSAGE = "message/POST_MESSAGE";

// action creators - define actions (objects with type/data)
const getMessageAC = (message) => ({
  type: GET_MESSAGE,
  message
})

const postMessageAC = (data) => ({
  type: POST_MESSAGE,
  data
});

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
export const postMessage = (message) => async (dispatch) => {

  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message: message})
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postMessageAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
}

// state
const initialState = {};

// reducer
export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGE: {
      const newState = { ...state };
      return newState;
    }
    case POST_MESSAGE: {
      const newState = { ...state};
	  newState[action.data.id] = action.data
      return newState;
    }
    default:
      return state;
  }
}
