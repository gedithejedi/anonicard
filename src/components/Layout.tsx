import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-full px-3 pt-2 pb-3 flex justify-between items-center border-b-2 border-black	">
        <Link className="font-bold hover:text-gray-700" href="/">
          Anonicard
        </Link>
        <ConnectButton />
      </div>
      <main className="py-5 px-3">{children}</main>
    </>
  )
}

export default Layout
