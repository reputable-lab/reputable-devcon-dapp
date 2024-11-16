import { ReputableHub, ReputableHub__factory } from '@reputable-lab/reputable-contracts'
import { JsonRpcProvider, Wallet } from 'ethers'
import { Address } from '@/utils/types.ts'

const REPUTABLE_HUB_ADDRESS = import.meta.env.VITE_REPUTABLE_HUB_ADDRESS

export async function getReputationScore({
  developerAttestation,
  modelAddressToUse,
}: {
  developerAttestation: any
  modelAddressToUse: Address
}) {
  const connectWallet = Wallet.createRandom()
  const provider = new JsonRpcProvider('https://sepolia.unichain.org')
  const walletWithProvider = connectWallet.connect(provider)
  const factory = ReputableHub__factory.connect(REPUTABLE_HUB_ADDRESS, walletWithProvider)

  // Then create contract instance
  const reputableHub = factory.attach(REPUTABLE_HUB_ADDRESS) as ReputableHub

  const proveResult = await reputableHub.proveReputableScore(
    {
      offchainAttestationId: developerAttestation.refUID,
      data: developerAttestation.data,
      attester: developerAttestation.attester,
      signature: developerAttestation.signature,
    },
    modelAddressToUse
  )

  return Number(proveResult)
}
