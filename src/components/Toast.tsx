import { FC } from 'react'
import { Alert, AlertTitle, AlertDescription, AlertClose } from './ui/alert'

export const Toast: FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <Alert variant="default" className="fixed bottom-4 right-4 w-64">
    <AlertTitle>Notification</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
    <AlertClose onClick={onClose} />
  </Alert>
)
