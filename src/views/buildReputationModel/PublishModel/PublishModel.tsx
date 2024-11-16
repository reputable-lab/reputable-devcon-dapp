import { useMutation } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'
import { LoadingButton } from '@/components/ui/loadingButton.tsx'
import { useUserStore } from '@/stores/user.store.ts'
import { useCreateModelStore } from '@/views/buildReputationModel/createModel.store.ts'
import { createReputationModel } from './publishModel.sc.ts'

export function PublishModel() {
  const { provider } = useUserStore()
  const { model } = useCreateModelStore()

  const [txHash, setTxHash] = useState('')

  const createReputationModelMutation = useMutation({
    mutationFn: () => {
      return createReputationModel({ provider, model: model! })
    },
    onSuccess: (hash: string) => {
      setTxHash(hash)
    },
    onError: (err) => {
      console.error('[createReputationModel] ERROR', err)
    },
  })

  return (
    <div className="text-center">
      {!txHash && (
        <div className="flex justify-center">
          <LoadingButton
            isLoading={createReputationModelMutation.isPending}
            onClick={() => createReputationModelMutation.mutate()}
          >
            Mint Reputation Model
          </LoadingButton>
        </div>
      )}

      {txHash && (
        <>
          <div className="flex items-center justify-center gap-x-1.5 text-lg text-green-500">
            <Check size="20" />
            <span>Your model is now published!</span>
          </div>
          <div className="mt-2 overflow-hidden overflow-ellipsis text-sm">
            Transaction hash: {txHash}
          </div>
          <Button asChild className="mt-3">
            <Link to={'/'}>See all reputation models</Link>
          </Button>
        </>
      )}

      {createReputationModelMutation.isError && (
        <div className="mt-4 overflow-hidden text-sm text-red-400">
          {createReputationModelMutation.error.message.toString()}
        </div>
      )}
    </div>
  )
}
