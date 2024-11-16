'use client'

import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user.store'
import ChatBackground from './ChatBackground'
import ChatBox from './chatBox/ChatBox'
import { ContactsTab } from './contacts/ContactsTab'

export function ChatContainer() {
  const { currentContact } = useUserStore()

  const hasContact = currentContact && Object.keys(currentContact).length > 0

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col px-4">
      <div className="flex h-16 items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="w-fit hover:bg-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>

      <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden rounded-lg border bg-background">
        {/* Sidebar */}
        <div className="w-[320px] border-r">
          <ContactsTab />
        </div>

        {/* Main Content */}
        <div className="flex flex-1">{hasContact ? <ChatBox /> : <ChatBackground />}</div>
      </div>
    </div>
  )
}
