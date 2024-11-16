import { useQuery } from '@tanstack/react-query'
import { Loader2, Check, User, FileText, Calculator, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { reputableApi } from '@/externals/reputableApi'
import { Address } from '@/utils/types'
import { getReputationScore } from '@/views/getReputationScore/getReputationScore.sc'

interface Attestation {
  attester: Address
  contributorName: string
  refUID: string
  data: string
  signature: string
}

export function ComputeModel({
  onNext,
}: {
  onNext: (params: { reputationScore: number; developerName: string }) => void
}) {
  const [developerSearchTerm, setDeveloperSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedDeveloper, setSelectedDeveloper] = useState<Attestation | null>(null)
  const [computationProgress, setComputationProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(developerSearchTerm), 300)
    return () => clearTimeout(timer)
  }, [developerSearchTerm])

  const {
    data: attestations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['attestations', debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm.length < 2) return []
      const matchingDevelopers = await reputableApi
        .get(`contributors/attestation?contributorName=${debouncedSearchTerm}`)
        .json<{ attestations: Array<Attestation> }>()
      return matchingDevelopers.attestations
    },
    enabled: debouncedSearchTerm.length >= 2,
  })

  const handleGetScore = async () => {
    if (!selectedDeveloper) return

    setComputationProgress(0)
    const interval = setInterval(() => {
      setComputationProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 500)

    try {
      const score = await getReputationScore({
        developerAttestation: selectedDeveloper,
        modelAddressToUse: '0xc4215fd017151bd9e725b2bb03d2eb9cd0bf1704', //TODO: use the chosen reputable model
      })
      clearInterval(interval)
      setComputationProgress(100)
      onNext({ reputationScore: score, developerName: selectedDeveloper.contributorName })
    } catch (error) {
      console.error('Error calculating reputation score:', error)
      clearInterval(interval)
      setComputationProgress(0)
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Compute Reputation Score</CardTitle>
        <CardDescription>
          Search for a developer, select their attestation, and compute their reputation score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Input
            placeholder="Start typing a developer name..."
            value={developerSearchTerm}
            onChange={(e) => setDeveloperSearchTerm(e.target.value)}
            className="flex-grow"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Try searching for{' '}
          <button className="underline" onClick={() => setDeveloperSearchTerm('cridmann')}>
            cridmann
          </button>{' '}
          or{' '}
          <button className="underline" onClick={() => setDeveloperSearchTerm('tbrent')}>
            tbrent
          </button>
        </p>

        {isError && <p className="text-red-500">Error: {error.message}</p>}

        {attestations && attestations.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Search Results:</h3>
            <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <ul className="divide-y divide-gray-200">
                {attestations.map((attestation, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{attestation.contributorName}</p>
                        <p className="text-sm text-muted-foreground">{attestation.attester}</p>
                      </div>
                    </div>
                    <Button
                      variant={
                        selectedDeveloper?.contributorName === attestation.contributorName
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedDeveloper(attestation)}
                    >
                      {selectedDeveloper?.contributorName === attestation.contributorName ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : null}
                      {selectedDeveloper?.contributorName === attestation.contributorName
                        ? 'Selected'
                        : 'Select'}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {computationProgress > 0 && (
          <div className="mb-4">
            <Progress value={computationProgress} className="w-full" />
            <p className="mt-2 text-center text-sm">
              Computing reputation score: {computationProgress}%
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleGetScore}
          disabled={!selectedDeveloper || computationProgress > 0}
        >
          Get Score
        </Button>
      </CardFooter>
    </Card>
  )
}
