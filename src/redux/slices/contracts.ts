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
  wellKnownAuthorizers: Authorizer[],
}

const initialState: ContractsState = {
  userProfile: undefined,
  wellKnownAuthorizers: [],
}

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    loadUserProfile: (state, action: PayloadAction<ProfileContract>) => {
      state.userProfile = action.payload
    },
    newUserProfile: (state, action: PayloadAction<string>) => {
      state.userProfile = {
        address: action.payload,
        authorizers: [],
      }
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
  },
})

// Action creators are generated for each case reducer function
export const { newUserProfile, addAuthorizerAddressToProfile, addWellKnownAuthorizer } = contractsSlice.actions

export default contractsSlice.reducer
