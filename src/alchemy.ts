import { Network, Alchemy } from 'alchemy-sdk'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Alchemy(settings)
