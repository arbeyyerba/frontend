import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Authorizer {
  address: string,
  description: string,
}

export interface ProfileContract {
  address: string,
  authorizers: Authorizer[],
}

export interface ContractsState {
  userProfile: ProfileContract | undefined,
  userProfileContractAddress: string | undefined, //TODO remove
  authorizerAddresses: string[], //TODO remove
  wellKnownAuthorizers: Authorizer[],
}

const initialState: ContractsState = {
  userProfile: undefined,
  userProfileContractAddress: undefined,
  authorizerAddresses: [],
  wellKnownAuthorizers: [],
}

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {

    loadUserProfile: (state, action: PayloadAction<ProfileContract>) => {
      state.userProfileContractAddress = action.payload.address
      state.userProfile = action.payload
    },
    loadUserProfileContractAddress: (state, action: PayloadAction<string>) => {
      state.userProfileContractAddress = action.payload
    },
    addAuthorizerAddress: (state, action: PayloadAction<string>) => {
      state.authorizerAddresses.push(action.payload);
      state.userProfile?.authorizers.push({address: action.payload, description: 'new authorizer (no info)'})
    },
    addWellKnownAuthorizer: (state, action: PayloadAction<Authorizer>) => {
      const existing = state.wellKnownAuthorizers.findIndex(authorizer => authorizer.address == action.payload.address);
      if (existing) {
        state.wellKnownAuthorizers[existing] = action.payload
      } else {
        state.wellKnownAuthorizers.push(action.payload);
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { loadUserProfileContractAddress, addAuthorizerAddress, addWellKnownAuthorizer } = contractsSlice.actions

export default contractsSlice.reducer
