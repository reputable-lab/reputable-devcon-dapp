import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Toast } from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useUserStore } from '@/stores/user.store'

const formSchema = z.object({
  message: z.string().min(1, "Message can't be empty"),
})

const MessageInput = () => {
  const { pushSign, currentContact } = useUserStore()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 224)}px`
    }
  }, [form.watch('message')])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!pushSign || !currentContact || !currentContact.did) {
      setToastMessage('Unable to send message. Missing required information.')
      setShowToast(true)
      return
    }

    try {
      const contactDID = currentContact.did.split(':')[1] || currentContact.did
      await pushSign.chat.send(contactDID, {
        content: values.message,
        type: 'Text',
      })
      form.reset()
    } catch {
      setToastMessage('Error sending message')
      setShowToast(true)
    }
  }

  const isInputDisabled = !currentContact || !currentContact.did || isSubmitting

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-end space-x-2 bg-background p-4"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    ref={(e) => {
                      field.ref(e)
                      textareaRef.current = e
                    }}
                    placeholder={
                      isInputDisabled
                        ? 'Select a contact to start chatting'
                        : 'Type your message here...'
                    }
                    disabled={isInputDisabled}
                    className="min-h-[40px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        form.handleSubmit(onSubmit)()
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={isInputDisabled}>
            {isSubmitting ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </Form>
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  )
}

export default MessageInput
