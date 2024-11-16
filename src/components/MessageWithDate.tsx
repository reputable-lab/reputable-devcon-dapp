// Import necessary dependencies
import React from 'react'

interface MessageWithDateProps {
  index: number
  message: {
    chatId: string
    fromDID: string
    timestamp: string
    messageContent: string
    messageType: string
  }
  nextMessage?: {
    fromDID: string
  }
}

const MessageWithDate: React.FC<MessageWithDateProps> = ({ index, message, nextMessage }) => {
  const { fromDID, timestamp, messageContent } = message

  // Function to format the timestamp to a readable date and time
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div className="message-container">
      {/* Display timestamp if it's the first message or if the sender has changed */}
      {(index === 0 || fromDID !== nextMessage?.fromDID) && (
        <div className="message-timestamp text-sm text-gray-500">{formatDate(timestamp)}</div>
      )}
      <div className={`message ${fromDID === 'yourDID' ? 'message-sent' : 'message-received'}`}>
        <div className="message-content rounded-lg bg-gray-100 p-2">{messageContent}</div>
      </div>
    </div>
  )
}

export default MessageWithDate
