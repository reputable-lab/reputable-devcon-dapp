import { useState } from 'react'
import { useUserStore } from '@/stores/user.store'
import { AddContactModal } from './AddContactModal'
import { AddContactsBtn } from './AddContactsBtn'
import Contacts from './Contacts'
import { ContactsSearch } from './ContactsSearch'

export default function ContactsBody() {
  const [searchValue, setSearchValue] = useState('')
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const { recentContacts } = useUserStore()

  const filteredContacts = recentContacts.filter((contact) =>
    contact.did.split(':')[1].toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleOpenAddContactModal = () => {
    setIsAddContactModalOpen(true)
  }

  return (
    <div className="flex h-full flex-col space-y-3">
      <ContactsSearch value={searchValue} onSearch={handleSearch} />

      <div className="relative flex h-full flex-col overflow-hidden px-2 py-1">
        <div className="mb-3 flex w-full items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Contacts</h2>
          <AddContactsBtn onClick={handleOpenAddContactModal} />
        </div>

        <div className="hide-scroll flex flex-1 flex-grow overflow-y-auto">
          <Contacts contacts={filteredContacts} />
        </div>
      </div>

      <AddContactModal open={isAddContactModalOpen} onOpenChange={setIsAddContactModalOpen} />
    </div>
  )
}
