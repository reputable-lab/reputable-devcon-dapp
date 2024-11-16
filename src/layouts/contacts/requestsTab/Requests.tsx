import { RequestItem } from '@/types/RequestItem'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toast } from '@/components/Toast'
import { useUserStore } from '@/stores/user.store'
import { RequestsItem } from './RequestsItem'

export function Requests() {
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { provider, pushSign, recentRequests, setRecentRequests } = useUserStore()

  useEffect(() => {
    const initializeRequests = async () => {
      if (!provider || !pushSign) {
        console.log('Provider or pushSign not available')
        return
      }

      try {
        const requestsLists = await pushSign.chat.list('REQUESTS')

        const filterRecentRequest: RequestItem[] = requestsLists.map((request: any) => ({
          profilePicture: request.profilePicture || '',
          did: request.did || '',
          msg: request.msg?.messageContent || 'No message',
          name: request.name || '',
          about: request.about || '',
        }))
        console.log('Filtered recent requests:', filterRecentRequest)

        setRecentRequests(filterRecentRequest)
      } catch (error) {
        console.error('Error fetching requests:', error)
        setToastMessage('Error fetching requests')
        setShowToast(true)
      } finally {
        setIsLoading(false)
      }
    }

    initializeRequests()
  }, [provider, pushSign, setRecentRequests])

  return (
    <div className="relative h-full w-full flex-1 space-y-4 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : recentRequests.length === 0 ? (
        <p className="text-center text-muted-foreground">No requests to show</p>
      ) : (
        <div className="space-y-4">
          {recentRequests.map((request, index) => (
            <RequestsItem key={index} request={request as RequestItem} />
          ))}
        </div>
      )}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}
