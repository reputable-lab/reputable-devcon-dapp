import { ReputableHub__factory } from '@reputable-lab/reputable-contracts'
import { ModelWeightsStruct } from '@reputable-lab/reputable-contracts/typechain-types/contracts/IReputableHub'
import { ethers } from 'ethers'
import { Model } from '@/views/buildReputationModel/createModel.store.ts'

const REPUTABLE_HUB_ADDRESS = import.meta.env.VITE_REPUTABLE_HUB_ADDRESS

export async function createReputationModel({ provider, model }: { provider: any; model: Model }) {
  const ethersProvider = new ethers.BrowserProvider(provider)
  const signer = await ethersProvider.getSigner()

  // The connected wallet should have funds. Maybe give a link to a faucet for builder/user who doesn't have funds
  // const factory = ReputableHub__factory.connect(REPUTABLE_HUB_ADDRESS, signer)
  const reputableHub = ReputableHub__factory.connect(REPUTABLE_HUB_ADDRESS, signer)

  // Then create contract instance
  // const reputableHub = factory.attach(REPUTABLE_HUB_ADDRESS) as ReputableHub
  const defaultWeights = {
    commitWeight: model.weights?.codeContribution,
    nbOfContributorWeight: model.weights?.codeInfluence,
    contributionRecencyWeight: model.weights?.recentContributionActivity,
    txWeight: model.weights?.transactionEngagement,
    uniqueFromWeight: model.weights?.userReach,
    tveWeight: model.weights?.tve,
  } as ModelWeightsStruct

  const tx = await reputableHub.createReputableModel(
    model.name,
    await signer.getAddress(),
    defaultWeights
  )
  console.log('CreateReputableModel tx:', tx.hash)

  return tx.hash
}
