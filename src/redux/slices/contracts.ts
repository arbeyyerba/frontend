import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ContractsState {
  userProfileContractAddress: string | undefined,
  authorizerAddresses: string[],
}

const initialState: ContractsState = {
  userProfileContractAddress: undefined,
  authorizerAddresses: [],
}

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    loadUserProfileContractAddress: (state, action: PayloadAction<string>) => {
      state.userProfileContractAddress = action.payload
    },
    addAuthorizerAddress: (state, action: PayloadAction<string>) => {
      state.authorizerAddresses.push(action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { loadUserProfileContractAddress, addAuthorizerAddress } = contractsSlice.actions

export default contractsSlice.reducer
