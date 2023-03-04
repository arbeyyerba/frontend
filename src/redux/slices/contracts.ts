import { Provider } from '@ethersproject/abstract-provider'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { getProfileByOwnerAddressAndChainId } from 'src/lib/api'
import { LensContract } from 'src/types/lensContract'
import { ProfileContract } from 'src/types/profileContract'
import authorizersMock from 'src/_mock/authorizers'
import { AppDispatch, dispatch as appDispatch } from '../store'

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

export interface ProfileMetadata {
  name?: string,
  avatar?: string,
  profileAddress?: string,
  lens?: boolean,
}


export interface ContractsState {
  userProfile: ProfileContractState | undefined,
  wellKnownAuthorizers: Authorizer[],
  loadedProfileFromDb: boolean,
  knownProfiles: Record<string, ProfileMetadata>,
  loadingProfiles: Record<string, boolean>,
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
  loadedProfileFromDb: false,
  knownProfiles: {},
  loadingProfiles: {},

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
        state.userProfile.attestations[action.payload] = [];
      }
    },
    removeAuthorizerAddressFromProfile: (state, action: PayloadAction<string>) => {
      if (state.userProfile) {
        state.userProfile.authorizers = state.userProfile.authorizers.filter((authorizer)=>{
          authorizer.address != action.payload
        });
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
    loadedFromDb: (state, action: PayloadAction<boolean>) => {
      if (state.userProfile) {
        state.loadedProfileFromDb = action.payload;
      }
    },
    addPost: (state, action: PayloadAction<{group: string, post:Attestation}>) => {
      if (state.userProfile) {
        state.userProfile.attestations[action.payload.group].push(action.payload.post)
      }
    },

    loadingProfileMetadata: (state, action: PayloadAction<{address: string, loading: boolean}>) => {
      state.loadingProfiles[action.payload.address] = action.payload.loading;
    },
    loadProfileMetadata: (state, action: PayloadAction<{address: string, metadata: ProfileMetadata}>) => {
      state.knownProfiles[action.payload.address] = action.payload.metadata;
    },
  },
})

// Action creators are generated for each case reducer function
export const { loadUserProfile, loadingProfileMetadata, loadProfileMetadata, addPost, removeAuthorizerAddressFromProfile, loadedFromDb, addAttestations, addAuthorizerAddressToProfile, addWellKnownAuthorizer } = contractsSlice.actions

export function loadUserProfileData(address: string, chainId:string, provider: Provider) {
  return async (dispatch: AppDispatch) => {
    console.log('loading profile data', address, chainId, provider);
    const contract = new ProfileContract(address, chainId);
    console.log('fetching chain data...');
    const authorizers = await contract.getAllAuthorizers(provider)
    const attestations = await contract.getAllAttestations(provider)
    const network = await provider.getNetwork();
    const profileMetadata = await contract.fetchMetadata(provider);
    const hydratedAuthorizers = authorizers.map((authorizer)=>{
      const wellKnown = authorizersMock[chainId as any].find((mock: Authorizer)=>mock.address.toLowerCase() == authorizer.address.toLowerCase());
      console.log('wellknown', authorizer, authorizersMock, wellKnown);
      if (wellKnown) {
        return {
          ...authorizer,
          name: wellKnown.name,
          description: wellKnown.description,
          avatar: wellKnown.avatar,
        }
      } else {
        return {
          ...authorizer
        }
      }
    })

    // TODO for each attestation, dispatch a fetch for
    authorizers.forEach((authorizer) => {
      attestations[authorizer.address].forEach((post) => {
        dispatch(fetchProfileMetadata(post.senderAddress, chainId, provider));
      })
    })

      // // TODO need to map attestations to whether they are valid or not...
    //const validState = attestations.map(await contract.getValidState(provider, authorizer, messages));
    const profile = {
        address,
        name: profileMetadata?.name,
        avatar: profileMetadata?.avatar,
        chainId: network.chainId,
        attestations: attestations,
        authorizers: hydratedAuthorizers,
        validState: {},
    }
    console.log('profile', profile);
    dispatch(loadUserProfile(profile))
  }
}

export function initializeUserProfile(ownerAddress: `0x${string}`, chainId:string, provider: Provider) {
  appDispatch(loadedFromDb(false));
  return async (dispatch: AppDispatch) => {
    const dbProfile = await getProfileByOwnerAddressAndChainId({ownerAddress, chainId});
    console.log('dbProfile', dbProfile);
    if (dbProfile && dbProfile.profile) {
      console.log('loading profile from db', dbProfile);
      dispatch(loadUserProfileData(dbProfile.profile.contractAddress, chainId, provider));
    }
    dispatch(loadedFromDb(true));
  }
}

export function fetchProfileMetadata(address: string, chainId: string,  provider: Provider) {
  console.log('fetching metadata for ', address);
  appDispatch(loadingProfileMetadata({address, loading: true}));
  return async (dispatch: AppDispatch) => {
    const dbProfile = await getProfileByOwnerAddressAndChainId({ownerAddress: address as any, chainId});
    const lensData = await LensContract.getLensData(provider, address);
    if (lensData) {
      console.log('found lens profile', lensData);
      dispatch(loadProfileMetadata({address, metadata: {
        name: lensData.handle,
        avatar: lensData.avatar,
        lens: true,
      }}));
    } if (dbProfile && dbProfile.profile) {
      console.log('found profile', dbProfile.profile);
      dispatch(loadProfileMetadata({address, metadata: {
        name: dbProfile.profile.name,
        avatar: dbProfile.profile.avatar,
        profileAddress: dbProfile.profile.profileAddress,
      }}));
    }
  dispatch(loadingProfileMetadata({address, loading: false}));
  }
}

export default contractsSlice.reducer
