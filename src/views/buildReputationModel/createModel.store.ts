import { create } from 'zustand'

export type Model = {
  name: string
  weights?: {
    codeContribution: number
    codeInfluence: number
    recentContributionActivity: number
    transactionEngagement: number
    userReach: number
    tve: number
  }
}

type CreateModelState = {
  model: Model | undefined
  setModel: (model: Model | undefined) => void
}

export const useCreateModelStore = create<CreateModelState>((set) => ({
  model: undefined,
  setModel: (model) => set({ model }),
}))
