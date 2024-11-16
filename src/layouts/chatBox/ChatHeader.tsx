import { Contact } from '@/types/contactTypes'
import { FC, useState } from 'react'
import { Toast } from '@/components/Toast'
import { DocumentDuplicateIcon } from '@/components/icons/DocumentDuplicateIcon'
import { useUserStore } from '@/stores/user.store'

const ChatHeader: FC = () => {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const currentContact = useUserStore((state) => state.currentContact)

  const handleCopyClick = () => {
    if (currentContact?.did) {
      const didValue = currentContact.did.split(':')[1] || currentContact.did
      navigator.clipboard.writeText(didValue)
      setToastMessage('Copied to clipboard')
      setShowToast(true)
    }
  }

  if (!currentContact) {
    return null
  }

  const renderContactInfo = (contact: Contact) => {
    const didValue = contact.did?.split(':')[1] || contact.did || 'Unknown DID'
    return (
      <>
        <h3 className="w-fit text-ellipsis text-xl font-bold text-black">{didValue}</h3>
        <div className="flex items-center text-xs">
          <button
            className="flex-start flex text-[12px] text-gray-600 hover:cursor-pointer"
            onClick={handleCopyClick}
          >
            Click to Copy
            <DocumentDuplicateIcon className="ml-1 mt-px h-3 w-3 text-gray-600" />
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="border-primary-white relative z-10 flex w-full items-center justify-between rounded-tl-xl border-b bg-gray-50 px-5 py-2">
      <div className="flex gap-3">
        <div className="aspect-square h-11 w-11 overflow-hidden rounded-full">
          <img
            src={currentContact.profilePicture || '/placeholder-avatar.png'}
            width={44}
            height={44}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          {renderContactInfo(currentContact)}
        </div>
      </div>

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default ChatHeader
