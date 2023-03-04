import { Provider } from '@ethersproject/abstract-provider'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { getProfileByOwnerAddressAndChainId } from 'src/lib/api'
import { ProfileContract } from 'src/types/profileContract'
import { AppDispatch } from '../store'

export interface Authorizer {
  address: string,
  // future metadata fields
  name?: string,
  avatar?: string,
  description?: string,
}

export interface ProfileContractState {
  address: string,
  authorizers: Authorizer[],
  validState: Record<string, boolean> //whether or not the hashes match for a particular authorizer.
  attestations: Record<string, Attestation[]>,
  // future metadata fields
  name?: string,
  avatar?: string,
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
  deleted: boolean,
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
    addAttestations: (state, action: PayloadAction<{authorizer: string, messages: Attestation[]}>) => {
      if (state.userProfile) {
        state.userProfile.attestations[action.payload.authorizer] = (state.userProfile.attestations[action.payload.authorizer] || []).concat(action.payload.messages)
      }
    },
    // TODO this data should live on-chain somewhere...
    setName: (state, action: PayloadAction<string>) => {
      if (state.userProfile) {
        state.userProfile.name = action.payload
      }
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      if (state.userProfile) {
        state.userProfile.avatar = action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { loadUserProfile, addAttestations, addAuthorizerAddressToProfile, addWellKnownAuthorizer } = contractsSlice.actions

export function loadUserProfileData(address: string, chainId:string, provider: Provider) {
  return async (dispatch: AppDispatch) => {
    console.log('loading profile data', address, chainId, provider);
    const contract = new ProfileContract(address, chainId);
    console.log('fetching chain data...');
    const authorizers = await contract.getAllAuthorizers(provider)
    const attestations = await contract.getAllAttestations(provider)
    const network = await provider.getNetwork();
      // // TODO need to map attestations to whether they are valid or not...
    //const validState = attestations.map(await contract.getValidState(provider, authorizer, messages));
    const profile = {
        address,
        chainId: network.chainId,
        attestations: attestations,
        authorizers: authorizers,
        validState: {},
    }
    console.log('profile', profile);
    dispatch(loadUserProfile(profile))
  }
}

export function initializeUserProfile(ownerAddress: `0x${string}`, chainId:string, provider: Provider) {
  return async (dispatch: AppDispatch) => {
    const dbProfile = await getProfileByOwnerAddressAndChainId({ownerAddress, chainId});
    console.log('dbProfile', dbProfile);
    if (dbProfile && dbProfile.profile) {
      console.log('loading profile from db', dbProfile);
      dispatch(loadUserProfileData(dbProfile.profile.contractAddress, chainId, provider));
      return;
    } else {
      return;
    }
    
  }
}

export default contractsSlice.reducer
