import { useState, useEffect } from 'react'
import { Toast } from '@/components/Toast'
import { useUserStore } from '@/stores/user.store'
import MessageWithDate from './message/MessageWithDate'

interface Message {
  fromDID: string
  timestamp: string
  messageContent: string
  messageType: string
  chatId?: string
}

const Chat = () => {
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { pushSign, currentContact, messages, setMessages } = useUserStore()

  const initializeChat = async () => {
    if (!pushSign || !currentContact || !currentContact.did) {
      setToastMessage('Unable to initialize chat. Missing required information.')
      setShowToast(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const contactDID = currentContact.did.split(':')[1] || currentContact.did
      const pastMessages: Message[] = await pushSign.chat.history(contactDID)
      const filteredMessages = pastMessages.map(
        ({ fromDID, timestamp, messageContent, messageType, chatId }) => ({
          chatId,
          fromDID,
          timestamp,
          messageContent,
          messageType,
        })
      )
      setMessages([...filteredMessages].reverse())
    } catch {
      setToastMessage('Error fetching chat history')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentContact && pushSign) {
      initializeChat()
    }
  }, [currentContact, pushSign])

  return (
    <div className="hide-scroll absolute left-0 top-0 flex h-full w-full flex-1 flex-grow flex-col-reverse overflow-y-auto px-3 pb-2">
      {loading ? (
        <div className="absolute left-1/2 top-2 z-10 mx-auto w-fit -translate-x-1/2">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent opacity-60"
            aria-label="Loading"
          />
        </div>
      ) : !currentContact || !currentContact.did ? (
        <div className="text-primary-white/60 mt-2 flex items-start rounded-lg bg-gray-100 px-6 py-2">
          <p className="mx-auto flex text-center text-sm">
            Please select a contact to start chatting.
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-primary-white/60 mt-2 flex items-start rounded-lg bg-gray-100 px-6 py-2">
          <p className="mx-auto flex text-center text-sm">
            Messages are end-to-end encrypted. Only users in this chat can view or listen to them.
          </p>
        </div>
      ) : (
        <div className="z-10 flex flex-col gap-1">
          {messages.map((message, index, arr) => (
            <MessageWithDate
              key={index}
              index={index}
              message={message}
              nextMessage={arr[index + 1]}
            />
          ))}
        </div>
      )}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default Chat
