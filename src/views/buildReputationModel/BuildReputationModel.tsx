import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from '@/components/ProgressBar.tsx'
import { Button } from '@/components/ui/button.tsx'
import { DataWeightings } from '@/views/buildReputationModel/DataWeightings.tsx'
import { ModelInformation } from '@/views/buildReputationModel/ModelInformation.tsx'
import { PublishModel } from '@/views/buildReputationModel/PublishModel/PublishModel.tsx'
import { useCreateModelStore } from '@/views/buildReputationModel/createModel.store.ts'

const percentStepOne = 3
const percentStepTwo = 36
const percentStepThree = 69

export function BuildReputationModel() {
  const { model } = useCreateModelStore()

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [percent, setPercent] = useState(3)

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
          <h1 className="text-4xl">Build Reputation Model</h1>
          <h2 className="mt-1">Input data for monitoring new users</h2>
        </div>
      </div>

      <div className="mt-11">
        <div className="inline-flex w-full rounded-lg bg-purple-50 p-1">
          <div className="grid w-full grid-cols-3 gap-1">
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveStep(1)
                  setPercent(percentStepOne)
                }}
                className={`w-full rounded-md px-10 py-2 text-sm font-medium transition-all duration-200 ${
                  activeStep === 1
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-purple-600/60 hover:bg-white/50 hover:text-purple-600'
                }`}
              >
                Model Information
              </button>
            </div>
            {/*<div>*/}
            {/*  <button*/}
            {/*    type="button"*/}
            {/*    onClick={() => {*/}
            {/*      setActiveStep(2)*/}
            {/*      setPercent(percentStepTwo)*/}
            {/*    }}*/}
            {/*    className={`w-full rounded-md px-10 py-2 text-sm font-medium transition-all duration-200 ${*/}
            {/*      activeStep === 2*/}
            {/*        ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'*/}
            {/*        : 'text-purple-600/60 hover:bg-white/50 hover:text-purple-600'*/}
            {/*    }`}*/}
            {/*  >*/}
            {/*    Data Parameters*/}
            {/*  </button>*/}
            {/*</div>*/}
            {!!model?.name ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(2)
                    setPercent(percentStepTwo)
                  }}
                  className={`w-full rounded-md px-10 py-2 text-sm font-medium transition-all duration-200 ${
                    activeStep === 2
                      ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                      : 'text-purple-600/60 hover:bg-white/50 hover:text-purple-600'
                  }`}
                >
                  Data Weightings
                </button>
              </div>
            ) : (
              <div
                className={`w-full rounded-md px-10 py-2 text-center text-sm font-medium transition-all duration-200 ${
                  activeStep === 3
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                    : 'text-purple-600/60'
                }`}
              >
                Data Weightings
              </div>
            )}
            <div
              className={`w-full rounded-md px-10 py-2 text-center text-sm font-medium transition-all duration-200 ${
                activeStep === 3
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-purple-600/60'
              }`}
            >
              Publish
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar percent={percent} />
      </div>

      <div className="mt-6 flex justify-center rounded-md border p-4">
        <div className="w-1/2">
          {activeStep === 1 ? (
            <ModelInformation
              onNext={() => {
                setActiveStep(2)
                setPercent(percentStepTwo)
              }}
            />
          ) : (
            ''
          )}

          {/*{activeStep === 2 ? (*/}
          {/*  <DataParameters*/}
          {/*    onNext={() => {*/}
          {/*      setActiveStep(3)*/}
          {/*      setPercent(percentStepThree)*/}
          {/*    }}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  ''*/}
          {/*)}*/}

          {activeStep === 2 ? (
            <DataWeightings
              onNext={() => {
                setActiveStep(3)
                setPercent(percentStepThree)
              }}
            />
          ) : (
            ''
          )}

          {activeStep === 3 ? <PublishModel /> : ''}
        </div>
      </div>
    </>
  )
}
