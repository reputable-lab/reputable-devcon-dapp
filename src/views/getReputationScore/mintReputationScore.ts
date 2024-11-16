import { ISP, ISP__factory } from '@reputable-lab/reputable-contracts'
import { AbiCoder, BrowserProvider, toBigInt } from 'ethers'

const SIGN_PROTOCOL_ADDRESS = import.meta.env.VITE_REPUTABLE_SIGN_PROTOCOL_ADDRESS
const SCHEMA_ID = import.meta.env.VITE_SIGN_PROTOCOL_SCHEMA_ID

export async function mintReputationScore({
  provider,
  devName,
  reputationScore,
}: {
  provider: any
  devName: string
  reputationScore: number
}) {
  try {
    const ethersProvider = new BrowserProvider(provider)
    const signer = await ethersProvider.getSigner()
    const factory = ISP__factory.connect(SIGN_PROTOCOL_ADDRESS, signer)
    const SP_Contract = factory.attach(SIGN_PROTOCOL_ADDRESS) as ISP

    const attestation = {
      schemaId: SCHEMA_ID,
      linkedAttestationId: 0n,
      attestTimestamp: 0n,
      revokeTimestamp: 0n,
      attester: await signer.getAddress(),
      validUntil: toBigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60), // Valid for 1 year
      dataLocation: 0, // ONCHAIN
      revoked: false,
      recipients: [],
      data: AbiCoder.defaultAbiCoder().encode(
        ['string', 'uint256'],
        [devName, parseInt(reputationScore.toString())]
      ),
    }

    const indexingKey = 'ReputableScore'
    const delegateSignature = '0x' // Empty bytes for no delegation
    const extraData = '0x' // No extra data

    const tx = await SP_Contract.attest(attestation, indexingKey, delegateSignature, extraData)
    await tx.wait()
    return tx
  } catch (error) {
    console.error('Error minting reputation score:', error)
  }
}
