import { Authorizer } from 'src/redux/slices/contracts'
import anvilChainData from './anvilChainData.json'


export interface AnvilChainData {
  authorizers: Authorizer[],
}

export function parseAnvilChainData() {
  const authorizerAddresses = anvilChainData.transactions
    .filter((txn) => txn.transactionType == "CREATE")
    .filter((txn) => txn.contractName == "EmployerDAO")
    .map((txn) => txn.contractAddress)

  return {
    authorizers: [
      {
        description: 'always approves',
        address: authorizerAddresses[0]
      },
      {
        description: 'never approves',
        address: authorizerAddresses[1]
      }
    ]
  }
}
