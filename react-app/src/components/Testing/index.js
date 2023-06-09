import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { continueConversation, getConversation } from '../../store/conversation'
import { getMessages } from '../../store/message'

export default function Testing() {
    const dispatch = useDispatch()

    // const handleQueryClick = () => {
    //     const test = {
    //         "conversation_id": 1,
    //         "message": "Testing"
    //       }
          
    //     dispatch(continueConversation(test))
    //     dispatch(getMessages())
    // }


  return (
    <div>Testing</div>
  )
}
