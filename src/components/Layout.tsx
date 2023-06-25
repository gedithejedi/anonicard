import Link from 'next/link'
import { useDisclosure } from '@chakra-ui/react'
import { useQRCode } from 'next-qrcode'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import Providers from '~/components/Providers'
import { useIsMounted } from '~/hooks/useIsMounted'
import Button from '~/components/Common/Button'
import Modal from '~/components/Common/Modal'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount()
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { Canvas } = useQRCode()

  if (!isMounted) return null
  return isConnected ? (
    <>
      <Providers>
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="flex py-5 gap-x-4 items-center">
            {address && (
              <Canvas
                text={address}
                options={{
                  level: 'L',
                  margin: 1,
                  scale: 5,
                  width: 150,
                  color: {
                    dark: '#fff',
                    light: '#000',
                  },
                }}
              />
            )}
            <span>
              Let your frens scan your wallet QRcode and start to connect!
            </span>
          </div>
        </Modal>
        <div className="w-full px-3 pt-2 pb-3 flex justify-between items-center border-b-2 border-black">
          <Link className="font-bold hover:text-gray-700" href="/">
            ANONICARD
          </Link>
          <div className="flex gap-2">
            <ConnectButton />
            <button
              onClick={onOpen}
              className="bg-black px-4 text-white font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                />
              </svg>
            </button>
          </div>
        </div>
        <main className="py-5 px-3">{children}</main>
      </Providers>
    </>
  ) : (
    <main className="bg-black p-5 h-screen text-white text-center flex flex-col items-center justify-center gap-y-10">
      <p className="font-bold text-3xl">
        Please Connect your wallet to use the app
      </p>
      <ConnectButton />
    </main>
  )
}

export default Layout
