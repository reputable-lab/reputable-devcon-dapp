'use client'

import { useMutation } from '@tanstack/react-query'
import { Loader2, ExternalLink, Check, Github } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user.store'
import { mintReputationScore } from './mintReputationScore'

export function ScoreResult({
  developerName,
  reputationScore,
}: {
  developerName: string
  reputationScore: number
}) {
  const { provider, isConnected } = useUserStore()
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [isGithubClicked, setIsGithubClicked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mintScoreMutation = useMutation({
    mutationFn: () => mintReputationScore({ provider, devName: developerName, reputationScore }),
    onSuccess: (tx) => {
      if (tx && tx.hash) {
        setTransactionHash(tx.hash)
      } else {
        throw new Error('Transaction failed')
      }
    },
    onError: (error) => {
      console.error('Error minting score:', error)
    },
  })

  const handleGithubClick = () => {
    setIsGithubClicked(true)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleMintScore = () => {
    if (isConnected) {
      mintScoreMutation.mutate()
    }
  }

  return (
    <>
      <div className="mx-auto flex w-1/2 flex-col items-center gap-y-10 rounded-md border border-primary bg-primary/10 px-4 py-12">
        <div className="text-xl text-primary">{developerName}</div>
        <div className="size-[120px]">
          <img
            src={`https://github.com/${developerName}.png?size=180`}
            alt={`${developerName}'s avatar`}
            className="w-[120px] rounded-full"
          />
        </div>
        <div className="font-righteous text-6xl text-primary">{reputationScore}</div>
      </div>

      <div className="mb-8 mt-12 space-y-4 text-center">
        {!isGithubClicked && (
          <Button onClick={handleGithubClick}>
            <Github className="mr-2 h-4 w-4" />
            Verify GitHub Identity
          </Button>
        )}

        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isGithubClicked && !isLoading && !transactionHash && (
          <Button onClick={handleMintScore} disabled={mintScoreMutation.isPending}>
            {mintScoreMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              'Mint Score on-chain'
            )}
          </Button>
        )}

        {transactionHash && (
          <>
            <div className="flex items-center justify-center gap-x-1.5 text-lg text-green-500">
              <Check size="20" />
              <span>Score successfully minted!</span>
            </div>
            <div className="mt-4 text-center">
              <a
                href={`https://unichain-sepolia.blockscout.com/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                View transaction on-chain
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </>
        )}
      </div>

      {mintScoreMutation.isError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {mintScoreMutation.error instanceof Error
              ? mintScoreMutation.error.message
              : 'An error occurred while minting the score. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
