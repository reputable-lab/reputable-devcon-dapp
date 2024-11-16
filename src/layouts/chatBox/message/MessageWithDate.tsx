import React from 'react'
import { useUserStore } from '@/stores/user.store'

interface MessageWithDateProps {
  message: {
    fromDID: string
    timestamp: string
    messageContent: string
    messageType: string
    chatId?: string // Changed to optional
  }
  nextMessage: {
    timestamp: string
  } | null
  index: number
}

const MessageWithDate: React.FC<MessageWithDateProps> = ({ message, nextMessage, index }) => {
  const pushSign = useUserStore((state) => state.pushSign)

  const messageDate = new Date(message.timestamp).toLocaleDateString()
  const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const nextMessageDate = nextMessage ? new Date(nextMessage.timestamp).toLocaleDateString() : null

  const pubKey = message.fromDID.split(':')[1]

  return (
    <div>
      {index === 0 && <div className="my-2 text-center text-xs text-gray-400">{messageDate}</div>}

      <div className={`flex ${pubKey === pushSign?.account ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`flex w-fit gap-1 rounded-3xl px-4 py-2 text-sm font-medium ${
            pubKey === pushSign?.account
              ? 'bg-coral-pink/40 rounded-tr-none text-black'
              : 'bg-purple/40 rounded-tl-none'
          }`}
        >
          <div>
            <p className="max-w-[260px] break-all">
              {message.messageContent.split('::')[1] || message.messageContent}
            </p>

            <div
              className={`prevent-select text-xs text-gray-500 ${
                pubKey === pushSign?.account ? 'text-right' : 'text-left'
              }`}
            >
              {messageTime}
            </div>
          </div>
        </div>
      </div>

      {nextMessageDate && messageDate !== nextMessageDate && (
        <div className="my-2 text-center text-xs text-gray-400">{nextMessageDate}</div>
      )}
    </div>
  )
}

export default MessageWithDate
