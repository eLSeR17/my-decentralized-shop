# My decentralized shop
  
The shop has a points system that rewards the users for buying and selling items. Gaining points means leveling up and obtaining some advantages in the usage of the shop, the shop has an owner, which centralizes some functions, but gives the contract some interesting possibilities.

Users have the possibility of setting personal data like their address, email and telephone. These variables are marked as private for being personal information, therefore this is personal data.

CAUTION! Ethereum is a public blockchain, this means all the information is trackable and readable (even a private variable).

## Quickstart

```
git clone https://github.com/eLSeR17/my-decentralized-shop
cd my-decentralized-shop
yarn
yarn hardhat
```


# Usage

Deploy:

```
npx hardhat deploy
```

## Testing

```
npx hardhat test
```

### Test Coverage

```
npx hardhat coverage
```

## Estimate gas

You can estimate how much gas things cost by running:

```
npx hardhat test
```

And you'll see and output file called `gas-report.txt`

## Local Deployment 

If you'd like to run your own local hardhat network, you can run:

```
npx hardhat node
```

And then **in a different terminal**

```
npx hardhat deploy --network localhost
```

And you should see transactions happen in your terminal that is running `npx hardhat node`

### Important localhost note

If you use metamask with a local network, everytime you shut down your node, you'll need to reset your account. Settings -> Advanced -> Reset account. Don't do this with a metamask you have real funds in. And maybe don't do this if you're a little confused by this. 

## Deployment to a testnet or mainnet

1. Setup environment variables

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

```
<<<<<<< HEAD
npx hardhat deploy --network rinkeby
=======
npx hardhat deploy --network goerli
>>>>>>> 4a00535 (goerli update)
```

# Thank you!
# my-decentralized-shop
# my-decentralized-shop
#   m y - d e c e n t r a l i z e d - s h o p 
 
 
