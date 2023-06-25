import nftConfig from '~/nftConfig.json'

export const query = (
  tokenName: 'originalAnoni' | 'anonicard',
  address: string
) => `
query MyQuery {
  TokenBalances(
    input: {filter: {owner: {_eq: "${address}"}, tokenAddress: {_eq: "${nftConfig[tokenName].address}"}}, blockchain: polygon, limit: 10}
  ) {
    TokenBalance {
      tokenNfts {
        address
        tokenId
        tokenURI
      }
    }
  }
}
`
