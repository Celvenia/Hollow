// constant variables for action creator
const GET_MESSAGE = "message/GET_MESSAGE"
const GET_MESSAGES = "message/GET_MESSAGES"
const POST_MESSAGE = "message/POST_MESSAGE";
const DELETE_MESSAGES = "message/DELETE_MESSAGES"

// action creators - define actions (objects with type/data)
const getMessageAC = (message) => ({
  type: GET_MESSAGE,
  message
})

const getMessagesAC = (messages) => ({
  type: GET_MESSAGES,
  messages
})

const postMessageAC = (data) => ({
  type: POST_MESSAGE,
  data
});

const deleteMessagesAC = (data) => ({
  type: DELETE_MESSAGES,
  data
})

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
export const getMessages = () => async (dispatch) => {
  const response = await fetch("/api/messages");

  if (response.ok) {
    const data = await response.json();
    dispatch(getMessagesAC(data.messages));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};


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

export const deleteMessages = (conversationId) => async (dispatch) => {

  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: "DELETE"
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteMessagesAC(data));

    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

// state
const initialState = {};

// reducer
export default function messageReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_MESSAGE: {
      return newState;
    }
    case GET_MESSAGES: {
      action.messages.forEach(message => {
        newState[message.id] = message
      })
      return newState;
    }
    case POST_MESSAGE: {
	  newState[action.data.id] = action.data
      return newState;
    }
    case DELETE_MESSAGES: {
      newState[action.data.id] = []
      return newState;
    }
    default:
      return state;
  }
}
