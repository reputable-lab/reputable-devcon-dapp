import { gql } from 'graphql-request'

export const GET_REPUTABLE_MODELS = gql`
  query GetReputableModels(
    $first: Int!
    $skip: Int!
    $orderBy: ReputableModel_orderBy!
    $orderDirection: OrderDirection!
  ) {
    reputableModels(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      modelName
      owner
      modelWeights {
        commitWeight
        nbOfContributorWeight
        contributionRecencyWeight
        txWeight
        uniqueFromWeight
        tveWeight
      }
      blockTimestamp
    }
    reputableModelsCount: reputableModels(first: 1000) {
      id
    }
  }
`

export const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/92769/reputable/version/latest'
