// constant variables for action creator
const GET_CONVERSATION = "CONVERSATION/GET_CONVERSATION";
const UPDATE_CONVERSATION = "CONVERSATION/UPDATE_CONVERSATION";
const POST_CONVERSATION = "CONVERSATION/POST_CONVERSATION";
const DELETE_CONVERSATION = "CONVERSATION/DELETE_CONVERSATION";

// action creators - define actions (objects with type/data)
const getConversationAC = (data) => ({
  type: GET_CONVERSATION,
  data,
});

const postConversationAC = (data) => ({
  type: POST_CONVERSATION,
  data,
});

const updateConversationAC = (data) => ({
  type: UPDATE_CONVERSATION,
  data,
});

const deleteConversationAC = (data) => ({
  type: DELETE_CONVERSATION,
  data,
});

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
export const getConversation = () => async (dispatch) => {
  const response = await fetch(`/api/conversations`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getConversationAC(data));
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

export const postConversation = (conversation) => async (dispatch) => {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversation),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postConversationAC(data));
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

export const updateConversation = (conversation) => async (dispatch) => {
  const response = await fetch(`/api/conversations/${conversation.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversation),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateConversationAC(data));

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

export const deleteConversation = () => async (dispatch) => {
  const response = await fetch(`/api/conversations`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteConversationAC(data));
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
export default function conversationReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_CONVERSATION: {
      return { ...newState, ...action.data };
    }
    case POST_CONVERSATION: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case UPDATE_CONVERSATION: {
      newState.title = action.data.title;
      return newState;
    }
    case DELETE_CONVERSATION: {
      const newState = { ...state };
      delete newState[action.data["deleted"].id];
      return newState;
    }
    default:
      return state;
  }
}
