import { FC } from 'react'
import MessageInput from './MessageInput'

// Defining the SendMessageContainer component
const SendMessageContainer: FC = () => {
  return (
    <div className="z-10 flex items-center rounded-bl-xl border-t border-gray-200 bg-gray-50 py-1 pl-5">
      <MessageInput />
    </div>
  )
}

// Exporting the SendMessageContainer component
export default SendMessageContainer
