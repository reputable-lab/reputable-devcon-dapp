import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user.store'

interface AddContactsBtnProps {
  onClick?: () => void
}

export function AddContactsBtn({ onClick }: AddContactsBtnProps) {
  const { toggleNewContactsModal } = useUserStore()

  const handleClick = () => {
    toggleNewContactsModal()
    if (onClick) {
      onClick()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="rounded-full bg-primary/10 hover:scale-105 hover:bg-primary/20"
    >
      <UserPlus className="h-4 w-4" />
      <span className="sr-only">Add new contact</span>
    </Button>
  )
}
