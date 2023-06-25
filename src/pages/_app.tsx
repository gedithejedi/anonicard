import '~/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultWallets,
  midnightTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi'
import { polygon } from '@wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { Roboto_Mono } from 'next/font/google'
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout'
import CustomAvatar from '~/components/CustomAvatar';
import { init } from "@airstack/airstack-react";

init("9c5c71ed48a24e52a1dcb9b3c3195440");

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_WALLET_ID

if (!projectId) {
  throw new Error('projectId is requried!')
}
const WALLET_ID = process.env.NEXT_PUBLIC_WALLET_ID
if (!WALLET_ID) {
  throw new Error('Wallet ID is required!')
}

const { connectors } = getDefaultWallets({
  appName: 'Anonicard',
  projectId: WALLET_ID,
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
  const { isConnected } = useAccount()

  const rainbowkitTheme = isConnected
    ? midnightTheme({
      accentColor: '#000',
      accentColorForeground: 'white',
      borderRadius: 'small',
      overlayBlur: 'small',
    })
    : lightTheme({
      accentColor: '#fff',
      accentColorForeground: 'black',
    })

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        avatar={CustomAvatar}
        theme={rainbowkitTheme}
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
