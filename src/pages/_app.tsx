import '~/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultWallets,
  midnightTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi'
import { gnosisChiado } from '@wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { mainnet } from 'wagmi/chains'

import { Roboto_Mono } from 'next/font/google'
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout'
import CustomAvatar from '~/components/CustomAvatar'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [gnosisChiado],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Anonicard',
  projectId: process.env.NEXT_PUBLIC_WALLET_ID,
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
