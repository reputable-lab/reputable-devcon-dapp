import { RequestItem } from '@/types/RequestItem'
import { useQuery } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { Toast } from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user.store'

interface RequestsItemProps {
  request: RequestItem
}

export function RequestsItem({ request }: RequestsItemProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { pushSign, updateRecentRequest } = useUserStore()

  const pubKey = request.did.split(':')[1] || request.did

  const handleAcceptRequest = async () => {
    if (pushSign) {
      await pushSign.chat.accept(pubKey)
      updateRecentRequest(request.did)
      setToastMessage('Request accepted')
      setShowToast(true)
    }
  }

  const handleRejectRequest = async () => {
    if (pushSign) {
      await pushSign.chat.reject(pubKey)
      updateRecentRequest(request.did)
      setToastMessage('Request rejected')
      setShowToast(true)
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['requestData', request.did],
    queryFn: async () => {
      // Fetch additional data if needed
      return request
    },
    initialData: request,
  })

  if (isLoading) return <div className="p-4 text-center">Loading...</div>
  if (error) return <div className="p-4 text-center text-red-500">Error loading request data</div>

  return (
    <div className="flex justify-between border-b border-gray-200 px-4 py-3 hover:bg-gray-50">
      <div className="flex items-center">
        <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
          <img
            src={data.profilePicture || '/placeholder.svg?height=40&width=40'}
            width={40}
            height={40}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {pubKey.slice(0, 8)}...{pubKey.slice(-4)}
          </h3>
          <p className="text-xs text-gray-500">{data.msg}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-600"
          onClick={handleAcceptRequest}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Accept request</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
          onClick={handleRejectRequest}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Reject request</span>
        </Button>
      </div>
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}
