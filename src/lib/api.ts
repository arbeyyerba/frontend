import sendRequest from './sendRequest';

export const createProfile = ({ name, ownerAddress, contractAddress, chainId, transactionHash }: {
        name: string,
        ownerAddress: string,
        contractAddress: string,
        chainId: string,
        transactionHash: string
    }) =>
  sendRequest(`/api/create-profile`, {
    body: JSON.stringify({ name, ownerAddress, contractAddress, chainId, transactionHash }),
  });


export const getProfileByOwnerAddressAndChainId = ({ ownerAddress, chainId }: {ownerAddress: `0x${string}`, chainId: string}) => {
    return sendRequest(`/api/get-profile-by-owner-address-and-chain-id`, {
        body: JSON.stringify({ ownerAddress, chainId }),
    });
}

export const getProfileByContractAddressAndChainId = ({ contractAddress, chainId }: {contractAddress: string, chainId: string}) => {
    return sendRequest(`/api/get-profile-contract-address-and-chain-id`, {
        body: JSON.stringify({ contractAddress, chainId }),
    });
}