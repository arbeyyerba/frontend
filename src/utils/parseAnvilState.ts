import { Authorizer } from '../redux/slices/contracts'
const anvilChainData = require('./anvilChainData.json')


export interface AnvilChainData {
  authorizers: Authorizer[],
}

export function parseAnvilChainData() {
  const authorizerAddresses = anvilChainData.transactions
    .filter((txn: any) => txn.transactionType == "CREATE")
    .filter((txn: any ) => txn.contractName == "EmployerDAO")
    .map((txn: any) => txn.contractAddress)

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
