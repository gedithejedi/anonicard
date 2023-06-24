import { Network, Alchemy } from 'alchemy-sdk'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

// TODO: update network once we switch to Gnosis
const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Alchemy(settings)
