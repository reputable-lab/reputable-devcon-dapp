import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { ComputeModel } from '@/views/getReputationScore/ComputeModel'
import { ScoreResult } from '@/views/getReputationScore/ScoreResult'

export function GetReputationScore() {
  const [activeStep, setActiveStep] = useState<1 | 2>(1)
  const [percent, setPercent] = useState(3)
  const [reputationScore, setReputationScore] = useState<number>(0)
  const [developerName, setDeveloperName] = useState('')

  const handleNext = ({
    reputationScore,
    developerName,
  }: {
    reputationScore: number
    developerName: string
  }) => {
    setReputationScore(reputationScore)
    setDeveloperName(developerName)
    setActiveStep(2)
    setPercent(53)
  }

  return (
    <>
      <Button asChild variant="secondary" size="sm" className="mt-2">
        <Link to="/">
          <ChevronLeft size="18" />
          <span>Home</span>
        </Link>
      </Button>

      <div className="mt-5 flex items-center">
        <div className="flex-1">
          <h1 className="text-4xl">Get Reputation Score on-chain</h1>
          <h2 className="mt-1">Search, select, and compute trusted reputation scores</h2>
        </div>
      </div>

      <div className="mt-11">
        <div className="inline-flex w-full rounded-lg bg-purple-50 p-1">
          <div className="grid w-full grid-cols-2 gap-1">
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveStep(1)
                  setPercent(3)
                }}
                className={`w-full rounded-md px-10 py-2 text-sm font-medium transition-all duration-200 ${
                  activeStep === 1
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-purple-600/60 hover:bg-white/50 hover:text-purple-600'
                }`}
              >
                Compute
              </button>
            </div>
            <div
              className={`w-full rounded-md px-10 py-2 text-center text-sm font-medium transition-all duration-200 ${
                activeStep === 2
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-purple-600/60'
              }`}
            >
              Result
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar percent={percent} />
      </div>

      <div className="mt-6 rounded-md border p-4">
        {activeStep === 1 ? (
          <ComputeModel onNext={handleNext} />
        ) : (
          <ScoreResult developerName={developerName} reputationScore={reputationScore} />
        )}
      </div>
    </>
  )
}
