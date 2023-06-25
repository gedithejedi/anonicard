export const query = `
query MyQuery {
  TokenBalances(
    input: {filter: {owner: {_eq: "0xB3622628546DE921A70945ffB51811725FbDA109"}, tokenAddress: {_eq: "0xc3383EB30e39DdDC2cf13d21ab869f42BF04Ebf1"}}, blockchain: polygon, limit: 10}
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