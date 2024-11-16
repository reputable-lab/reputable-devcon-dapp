import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useCreateModelStore } from '@/views/buildReputationModel/createModel.store.ts'

const formSchema = z.object({
  reputationModelName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

export function ModelInformation({ onNext }: { onNext: () => void }) {
  const { model, setModel } = useCreateModelStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reputationModelName: model?.name || '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setModel({ name: values.reputationModelName })
    onNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="reputationModelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reputation Model Name</FormLabel>
              <FormControl>
                <Input placeholder="Developers DeFi on Mainnet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  )
}
