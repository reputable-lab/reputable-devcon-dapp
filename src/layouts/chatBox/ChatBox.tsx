import Chat from './Chat'
import ChatHeader from './ChatHeader'
import SendMessageContainer from './message/SendMessageContainer'

// Defining the ChatBox component
const ChatBox = () => {
  return (
    <div className="flex flex-1 flex-grow flex-col justify-between rounded-l-xl border border-gray-300 bg-white">
      {/* Including the ChatHeader component */}
      <ChatHeader />

      {/* Including the Chat component inside a div with some styling */}
      <div className="hide-scroll relative flex-grow overflow-y-auto">
        <Chat />
      </div>

      {/* Including the SendMessageContainer component */}
      <SendMessageContainer />
    </div>
  )
}

// Exporting the ChatBox component
export default ChatBox
