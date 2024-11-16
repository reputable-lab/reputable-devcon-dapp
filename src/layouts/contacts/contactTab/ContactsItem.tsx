import { FC } from 'react'
import { useUserStore } from '@/stores/user.store'

interface IContactsItem {
  chat: any
}

const ContactsItem: FC<IContactsItem> = ({ chat }) => {
  const { pushSign, setCurrentContact } = useUserStore()

  const handleClick = () => {
    setCurrentContact(chat)
  }

  if (!pushSign || !chat) return null

  const pubKey = chat.did.split(':')[1]

  return (
    <li
      className="flex cursor-pointer items-center justify-between rounded-lg border-b border-gray-200 px-2 hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="my-2 flex items-center">
        <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-red-200">
          <img
            src={chat.profilePicture}
            alt="profile picture"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-black">
            {pubKey.slice(0, 8)}...{pubKey.slice(-4)}
          </h3>

          <p className="w-24 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium">
            {chat.msg.content}
          </p>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-black"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </li>
  )
}

export default ContactsItem
