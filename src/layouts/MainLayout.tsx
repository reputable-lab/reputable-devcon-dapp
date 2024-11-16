import { CHAIN_NAMESPACES, IAdapter, WEB3AUTH_NETWORK } from '@web3auth/base'
import { getDefaultExternalAdapters } from '@web3auth/default-evm-adapter'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { UserProfile } from '@/components/UserProfile'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user.store'
import { unichainSepoliaConfig } from '@/utils/unichainSepoliaConfig'
import RPC from '../utils/ethersRPC'

const clientId =
  'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: unichainSepoliaConfig.chainId,
  chainName: unichainSepoliaConfig.displayName,
  rpcTarget: unichainSepoliaConfig.rpcTarget,
  nativeCurrency: {
    name: unichainSepoliaConfig.tickerName,
    symbol: unichainSepoliaConfig.ticker,
    decimals: 18,
  },
  rpcUrls: [unichainSepoliaConfig.rpcTarget],
  blockExplorerUrls: [unichainSepoliaConfig.blockExplorer],
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
}
const web3auth = new Web3Auth(web3AuthOptions)

const adapters = getDefaultExternalAdapters({ options: web3AuthOptions })
adapters.forEach((adapter: IAdapter<unknown>) => {
  web3auth.configureAdapter(adapter)
})

export default function MainLayout() {
  const {
    setProvider,
    isInitialized,
    initializePushProtocol,
    setAddress: setStoreAddress,
  } = useUserStore()

  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal()
        setProvider(web3auth.provider)

        if (web3auth.connected) {
          setLoggedIn(true)
        } else {
          setLoggedIn(false)
        }
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [setProvider])

  useEffect(() => {
    if (!loggedIn) {
      return
    }

    async function getUserAddress() {
      const accountAddress = await RPC.getAccounts(web3auth.provider)
      setAddress(accountAddress)
      setStoreAddress(accountAddress)

      const chainId = await RPC.getChainId(web3auth.provider)
      setChainId(chainId)
    }

    getUserAddress()
  }, [loggedIn, setStoreAddress])

  useEffect(() => {
    if (loggedIn && !isInitialized && address) {
      initializePushProtocol()
    }
  }, [loggedIn, isInitialized, address, initializePushProtocol])

  const login = async () => {
    try {
      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider)
      if (web3auth.connected) {
        setLoggedIn(true)
        const accountAddress = await RPC.getAccounts(web3authProvider)
        setAddress(accountAddress)
        setStoreAddress(accountAddress)
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      await web3auth.logout()
      setProvider(undefined)
      setLoggedIn(false)
      setAddress('')
      setStoreAddress(undefined)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="container relative mb-52 mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {loggedIn && <UserProfile address={address} chainId={chainId} />}
        </div>
        <div className="flex items-center gap-x-2">
          {loggedIn ? (
            <Button variant="ghost" onClick={() => logout()}>
              <LogOut size="18"></LogOut>
              <span>Logout</span>
            </Button>
          ) : (
            <Button onClick={() => login()}>Login</Button>
          )}
        </div>
      </div>

      <Outlet />
    </div>
  )
}
