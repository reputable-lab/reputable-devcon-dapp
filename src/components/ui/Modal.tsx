import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface ModalProps {
  children: React.ReactNode
  onClose?: () => void
  title?: string
}

export function Modal({ children, onClose, title = 'Dialog' }: ModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="h-[90vh] max-w-[90vw] overflow-hidden p-0 sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[1200px]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
