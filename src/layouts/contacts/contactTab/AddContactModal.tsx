import * as React from 'react'
import { Toast } from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUserStore } from '@/stores/user.store'

interface AddContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddContactModal({ open, onOpenChange }: AddContactModalProps) {
  const [address, setAddress] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [toast, setToast] = React.useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  })
  const pushSign = useUserStore((state) => state.pushSign)

  const showToast = (message: string) => {
    setToast({ message, show: true })
  }

  const handleCloseToast = () => {
    setToast({ message: '', show: false })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address || !message) {
      showToast('Address and message cannot be empty.')
      return
    }

    if (pushSign?.account === address) {
      showToast('You cannot send a request to yourself')
      return
    }

    try {
      // Sending the request
      await pushSign?.chat.send(address, {
        type: 'Text',
        content: message,
      })

      showToast('Request sent successfully')
      onOpenChange(false)
      setAddress('')
      setMessage('')
    } catch (error) {
      console.error('Error sending request:', error)
      showToast('Failed to send request. Please try again.')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Send Request to 0x...</DialogTitle>
            <p className="text-base font-normal text-muted-foreground">
              Write the Pubkey and a Connect message to send request.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="Enter the pubkey"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#9333EA] text-white hover:bg-[#7928CA]">
                Send Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {toast.show && <Toast message={toast.message} onClose={handleCloseToast} />}
    </>
  )
}
