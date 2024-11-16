import { zodResolver } from '@hookform/resolvers/zod'
import { Info, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button.tsx'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Slider } from '@/components/ui/slider.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { useCreateModelStore } from '@/views/buildReputationModel/createModel.store.ts'

const formSchema = z.object({
  codeContribution: z.array(z.number(), {
    message: 'Name must be at least 2 characters.',
  }),
  codeInfluence: z.array(z.number()),
  recentContributionActivity: z.array(z.number()),
  transactionEngagement: z.array(z.number()),
  userReach: z.array(z.number()),
  tve: z.array(z.number()),
})

export function DataWeightings({ onNext }: { onNext: () => void }) {
  const { model, setModel } = useCreateModelStore()

  const [sum, setSum] = useState<number>()
  const [showSumError, setShowSumError] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeContribution: [model?.weights?.codeContribution || 20],
      codeInfluence: [model?.weights?.codeInfluence || 20],
      recentContributionActivity: [model?.weights?.recentContributionActivity || 20],
      transactionEngagement: [model?.weights?.transactionEngagement || 20],
      userReach: [model?.weights?.userReach || 10],
      tve: [model?.weights?.tve || 10],
    },
  })

  const sliderValues = form.watch()

  useEffect(() => {
    const watchForm = form.watch((values) => {
      const currentSum = Object.values(values).reduce((sum, sliderValue) => {
        return sum + sliderValue[0]
      }, 0)
      setSum(currentSum)

      if (currentSum !== 100) {
        setShowSumError(true)
      } else {
        setShowSumError(false)
      }
    })

    // Cleanup subscription
    return () => watchForm.unsubscribe()
  }, [form.watch])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (showSumError) {
      return
    }

    setModel({
      ...model,
      weights: Object.keys(values).reduce((accu, key) => {
        return {
          ...accu,
          [key]: values[key][0],
        }
      }, {}),
    })
    onNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col justify-center rounded-md border p-4">
          <div>Weights Off-Chain Data</div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slider" className="text-sm font-medium">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="col-span-2 flex cursor-default items-center gap-x-1 xl:col-span-1 xl:mt-0">
                      <span>Code Contribution</span>
                      <Info size="16" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Measures the number of code contributions made by a developer
                      <br /> across multiple projects, reflecting overall input and engagement
                      <br /> in the ecosystem.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-sm text-gray-500">{sliderValues.codeContribution}%</span>
            </div>

            <FormField
              control={form.control}
              name="codeContribution"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      max={100}
                      step={10}
                      className="w-full"
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slider" className="text-sm font-medium">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="col-span-2 flex cursor-default items-center gap-x-1 xl:col-span-1 xl:mt-0">
                      <span>Code Influence</span>
                      <Info size="16" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Assesses the developer’s influence within projects based on the
                      <br /> proportion of code they contributed; greater code
                      <br /> ownership signifies higher influence.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-sm text-gray-500">{sliderValues.codeInfluence}%</span>
            </div>

            <FormField
              control={form.control}
              name="codeInfluence"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      max={100}
                      step={10}
                      className="w-full"
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slider" className="text-sm font-medium">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="col-span-2 flex cursor-default items-center gap-x-1 xl:col-span-1 xl:mt-0">
                      <span>Recent Contribution Activity</span>
                      <Info size="16" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Tracks a developer's contribution frequency over the last three
                      <br /> months, indicating current engagement levels.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-sm text-gray-500">
                {sliderValues.recentContributionActivity}%
              </span>
            </div>

            <FormField
              control={form.control}
              name="recentContributionActivity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      max={100}
                      step={10}
                      className="w-full"
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center rounded-md border p-4">
          <div>Weights On-Chain Data</div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slider" className="text-sm font-medium">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="col-span-2 flex cursor-default items-center gap-x-1 xl:col-span-1 xl:mt-0">
                      <span>Transaction Engagement</span>
                      <Info size="16" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Measures the on-chain activity of deployed code, adjusted by the
                      <br /> developer’s contribution, based on transaction volume
                      <br /> within smart contracts.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-sm text-gray-500">{sliderValues.transactionEngagement}%</span>
            </div>

            <FormField
              control={form.control}
              name="transactionEngagement"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      max={100}
                      step={10}
                      className="w-full"
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slider" className="text-sm font-medium">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="col-span-2 flex cursor-default items-center gap-x-1 xl:col-span-1 xl:mt-0">
                      <span>User Reach</span>
                      <Info size="16" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Indicates the engagement level of unique users interacting with
                      <br /> deployed smart contracts, weighted by the developer’s code
                      <br /> contribution.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-sm text-gray-500">{sliderValues.userReach}%</span>
            </div>

            <FormField
              control={form.control}
              name="userReach"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      max={100}
                      step={10}
                      className="w-full"
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slider" className="text-sm font-medium">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="col-span-2 flex cursor-default items-center gap-x-1 xl:col-span-1 xl:mt-0">
                      <span>Total Value Enabled (TVE)</span>
                      <Info size="16" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Evaluates the total financial value engaged within a smart contract,
                      <br /> proportionate to the developer’s code contribution.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-sm text-gray-500">{sliderValues.tve}%</span>
            </div>

            <FormField
              control={form.control}
              name="tve"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Slider
                      max={100}
                      step={10}
                      className="w-full"
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {showSumError && (
          <div className="ml-1 flex items-center gap-x-2 text-red-400">
            <TriangleAlert size="18" />
            <div className="text-sm">
              <div>The total sum of weights should equal to 100.</div>
              <div>
                Currently: <strong>{sum}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  )
}
