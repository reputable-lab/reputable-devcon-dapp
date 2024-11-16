export type Address = `0x${string}`

// Define the types for the GraphQL response
export type ReputableModel = {
  id: string
  modelName: string
  owner: string
  modelWeights: {
    commitWeight: string
    nbOfContributorWeight: string
    contributionRecencyWeight: string
    txWeight: string
    uniqueFromWeight: string
    tveWeight: string
  }
  blockTimestamp: string
}

export type GetReputableModelsGraphQLResponse = {
  reputableModels: ReputableModel[]
  reputableModelsCount: { id: string }[]
}
