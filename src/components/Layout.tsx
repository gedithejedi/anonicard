import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import { useIsMounted } from '~/hooks/useIsMounted'
import Button from '~/components/Common/Button'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount()
  const isMounted = useIsMounted()

  if (!isMounted) return null
  return isConnected ? (
    <>
      <div className="w-full px-3 pt-2 pb-3 flex justify-between items-center border-b-2 border-black	">
        <Link className="font-bold hover:text-gray-700" href="/">
          Anonicard
        </Link>
        <ConnectButton />
      </div>
      <main className="py-5 px-3">{children}</main>
    </>
  ) : (
    <main className="bg-black p-5 h-screen text-white text-center flex flex-col items-center justify-center gap-y-10">
      <p className="font-bold text-3xl">
        Please Connect your wallet to use the app
      </p>
      <ConnectButton className="text-3xl" />
    </main>
  )
}

export default Layout
