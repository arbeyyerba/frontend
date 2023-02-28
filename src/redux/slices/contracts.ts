import { Provider } from '@ethersproject/abstract-provider'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { ProfileContract } from 'src/types/profileContract'
import { AppDispatch } from '../store'

export interface Authorizer {
  address: string,
  description: string,
}

export interface ProfileContractState {
  address: string,
  authorizers: Authorizer[],
  attestations: Attestation[],
}


export interface ContractsState {
  userProfile: ProfileContractState | undefined,
  wellKnownAuthorizers: Authorizer[],
}

export interface Attestation {
  id: number,
  authorizerAddress: string,
  senderAddress: string,
  message: string,
}

const initialState: ContractsState = {
  userProfile: undefined,
  wellKnownAuthorizers: [],
}

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    loadUserProfile: (state, action: PayloadAction<ProfileContractState>) => {
      state.userProfile = action.payload
    },
    addAuthorizerAddressToProfile: (state, action: PayloadAction<string>) => {
      if (state.userProfile) {
        state.userProfile.authorizers.push({address: action.payload, description: 'new authorizer (no info)'})
      }
    },
    addWellKnownAuthorizer: (state, action: PayloadAction<Authorizer>) => {
      const existing = state.wellKnownAuthorizers.findIndex(authorizer => authorizer.address == action.payload.address);
      if (existing) {
        state.wellKnownAuthorizers[existing] = action.payload
      } else {
        state.wellKnownAuthorizers.push(action.payload);
      }
    },
    addAttestations: (state, action: PayloadAction<Attestation[]>) => {
      if (state.userProfile) {
        state.userProfile.attestations.concat(action.payload)
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { loadUserProfile, addAttestations, addAuthorizerAddressToProfile, addWellKnownAuthorizer } = contractsSlice.actions


export function loadUserProfileData(address: string, provider: Provider) {
  return async (dispatch: AppDispatch) => {
    const contract = new ProfileContract(address);
    console.log('fetching chain data...');
    const authorizers = await contract.getAllAuthorizers(provider)
    const attestations = await contract.getAllAttestations(provider)
    const profile = {
        address,
        attestations: attestations,
        authorizers: authorizers,
    }
    dispatch(loadUserProfile(profile))
  }
}

export default contractsSlice.reducer
