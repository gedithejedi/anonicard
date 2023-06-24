import '~/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { gnosisChiado } from '@wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { mainnet } from 'wagmi/chains'

import { Roboto_Mono } from 'next/font/google'
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout'
import CustomAvatar from '~/components/CustomAvatar'

/* adding gnosis network */
const GnosisChain = {
  id: 100,
  name: 'Gnosis Chain',
  network: 'Gnosis',
  nativeCurrency: {
    decimals: 18,
    name: 'xDai',
    symbol: 'xDai',
  },
  rpcUrls: {
    default: 'https://rpc.ankr.com/gnosis',
  },
  blockExplorers: {
    default: { name: 'Gnosis Scan', url: 'https://gnosisscan.io/' },
  },
  iconUrls: [
    'https://images.prismic.io/koinly-marketing/16d1deb7-e71f-48a5-9ee7-83eb0f7038e4_Gnosis+Chain+Logo.png',
  ],
  testnet: true,
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [gnosisChiado],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Anonicard',
  projectId: 'YOUR_PROJECT_ID',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const appInformation = {
  appName: 'Anonicard',
}

const robotoMono = Roboto_Mono({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        avatar={CustomAvatar}
        theme={midnightTheme({
          accentColor: '#000',
          accentColorForeground: 'white',
          borderRadius: 'small',
          overlayBlur: 'small',
        })}
        appInfo={appInformation}
        chains={chains}
      >
        <div className={[robotoMono.className, 'w-full'].join(' ')}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
