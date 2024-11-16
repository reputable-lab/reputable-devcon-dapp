import { UserCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserProfileProps {
  address: string
  chainId: string
}

export function UserProfile({ address, chainId }: UserProfileProps = { address: '', chainId: '' }) {
  // Format the address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Get network name
  const getNetworkName = (id: string) => {
    return id === '1301' ? 'Unichain Sepolia Testnet' : id
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 bg-gray-100">
        <AvatarFallback>
          <UserCircle className="h-6 w-6 text-gray-600" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {address ? formatAddress(address) : 'Not Connected'}
        </span>
        <span className="text-sm text-gray-500">{chainId && `(${getNetworkName(chainId)})`}</span>
      </div>
    </div>
  )
}
