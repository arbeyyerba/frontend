# Setup
# Testing locally

### install foundry

[see docs here](https://book.getfoundry.sh/getting-started/installation)

### start a local chain using `anvil`

``` sh
anvil
```

### setup default chain state

setup polygon RPC and api keys in the .env file. ex:

.env file should look like this:

```
MNEMONIC = "test test test test test test test test test test test junk"
PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
MATIC_RPC_URL = "YourRpcUrlHere" #ex: infura or alchemy RPC url
MATICSCAN_API_KEY = "YourApiKeyHere" #setup an api key on https://polygonscan.com/
```

run the foundry script to setup the state to a default, known, state, with several deployed contracts. (make su anvil is already running)

```sh
forge script script/Profile.s.sol:ProfileScript --fork-url http://localhost:8545 --b
roadcast --json
```

and then copy the transactions into the front-end folder, so we can import the data from it. Ideally, in prod/mainnet we would hardcode the list of known contract addresses somewhere else... but this works great for testing!

```sh
cp contracts/broadcast/Profile.s.sol/3117/run-latest.json ${path-to-frontend}/src/utils/
```

(note: there should be no need to copy the run-latest.json file every time you restart the chain. Only when something changes with the setup script. in otherwords, you only need to copy it after pulling changes from the contract repo)

### import one of anvil's accounts into metamask

on startup, anvil prints out a list of private keys. import one of these keys into
metamask as normal ("import account")

### Setup the localhost chain on metamask

1. switch networks
3. "Add Network"
3. search for 'localhost'
4. change the "chain ID" to 31337 (seems to be the default for anvil? does this change for others?)
5. switch to the 'localhost' network you just setup. You should see 10000ETH in your wallet if you did it right.