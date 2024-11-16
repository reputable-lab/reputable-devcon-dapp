import { CONSTANTS, PushAPI } from '@pushprotocol/restapi'
import { ethers } from 'ethers'
import { create } from 'zustand'

export interface RequestItem {
  profilePicture: string
  did: string
  msg: string
  name?: string
  about?: string
}

export interface MessageResponse {
  cid: string
  messageContent: string
  messageType: string
  timestamp: number
  fromDID: string
  toDID: string
}

interface UserState {
  // Authentication
  provider: any | undefined
  address: string | undefined
  isInitialized: boolean
  isConnected: boolean

  // Push Protocol
  pushSign: PushAPI | null

  // UI State
  modalState: {
    isNewContactsModalOpen: boolean
  }

  // Chat State
  currentContact: RequestItem | null
  recentContacts: RequestItem[]
  recentRequests: RequestItem[]
  messages: MessageResponse[]

  // Actions
  setProvider: (provider: any | undefined) => void
  setAddress: (address: string | undefined) => void
  setPushSign: (pushSign: PushAPI | null) => void
  setInitialized: (isInitialized: boolean) => void
  setConnected: (isConnected: boolean) => void

  // UI Actions
  toggleNewContactsModal: () => void

  // Chat Actions
  setCurrentContact: (contact: RequestItem | null) => void
  setRecentContacts: (contacts: RequestItem[]) => void
  addRecentContact: (contact: RequestItem) => void
  setRecentRequests: (requests: RequestItem[]) => void
  addRecentRequest: (request: RequestItem) => void
  updateRecentRequest: (did: string) => void
  setMessages: (messages: MessageResponse[]) => void
  addMessage: (message: MessageResponse) => void
  resetContacts: () => void

  // Initialize Push Protocol
  initializePushProtocol: () => Promise<void>
}

export const useUserStore = create<UserState>()((set, get) => ({
  // Initial State
  provider: undefined,
  address: undefined,
  pushSign: null,
  isInitialized: false,
  isConnected: false,
  modalState: {
    isNewContactsModalOpen: false,
  },
  currentContact: null,
  recentContacts: [],
  recentRequests: [],
  messages: [],

  // Authentication Actions
  setProvider: (provider) => set({ provider }),
  setAddress: (address) => {
    if (!address) {
      set({ address: undefined })
      return
    }
    set({ address: address.toLowerCase() })
  },
  setPushSign: (pushSign) => set({ pushSign }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  setConnected: (isConnected) => set({ isConnected }),

  // UI Actions
  toggleNewContactsModal: () =>
    set((state) => ({
      modalState: {
        ...state.modalState,
        isNewContactsModalOpen: !state.modalState.isNewContactsModalOpen,
      },
    })),

  // Chat Actions
  setCurrentContact: (contact) => set({ currentContact: contact }),
  setRecentContacts: (contacts) => set({ recentContacts: contacts }),
  addRecentContact: (contact) =>
    set((state) => ({ recentContacts: [...state.recentContacts, contact] })),
  setRecentRequests: (requests) => set({ recentRequests: requests }),
  addRecentRequest: (request) =>
    set((state) => ({ recentRequests: [...state.recentRequests, request] })),
  updateRecentRequest: (did) =>
    set((state) => ({
      recentRequests: state.recentRequests.filter((request) => request.did !== did),
    })),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  resetContacts: () =>
    set({
      recentContacts: [],
      recentRequests: [],
      currentContact: null,
    }),

  // Initialize Push Protocol
  initializePushProtocol: async () => {
    const { provider, address, pushSign } = get()

    if (!provider || !address) {
      console.error('Provider or address not available')
      return
    }

    if (pushSign) {
      console.log('Push Protocol already initialized')
      return
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()

      const pushUser = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
        account: address,
      })

      set({ pushSign: pushUser, isInitialized: true, isConnected: true })
      console.log('Push Protocol initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Push Protocol:', error)
      set({ isInitialized: false, isConnected: false })
    }
  },
}))
