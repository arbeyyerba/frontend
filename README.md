# Setup
# Testing locally

### install foundry

[see docs here](https://book.getfoundry.sh/getting-started/installation)

### start a local chain using `anvil`

``` sh
anvil
```

### import one of anvil's accounts into metamask

on startup, anvil prints out a list of private keys. import one of these keys into
metamask as normal

### Setup the localhost chain on metamask

1. switch networks
3. "Add Network"
3. search for 'localhost'
4. change the "chain ID" to 31337 (seems to be the default for anvil? does this change for others?)
5. switch to the 'localhost' network you just setup. You should see 10000ETH in your wallet if you did it right.