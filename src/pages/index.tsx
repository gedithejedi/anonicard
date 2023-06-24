import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useDisclosure } from '@chakra-ui/react'

import alchemy from '~/alchemy'
import { useAccount } from 'wagmi'
import { IDKitWidget } from '@worldcoin/idkit'
import type { ISuccessResult } from '@worldcoin/idkit'

import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'
import OriginalForm from '~/components/OriginalForm'
import Modal from '~/components/Common/Modal'
import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'

interface OriginalNFT {
  tokenId: string
  profileImage?: string
  fullName: string
  discordName: string
  job: number
  introduction: string
}

// const IDKitWidget = dynamic(
//   () => import('@worldcoin/idkit').then((mod) => mod.IDKitWidget),
//   { ssr: false }
// )

const WORLDCOIN_ID = process.env.NEXT_PUBLIC_WORLDCOIN_ID
if (!WORLDCOIN_ID) {
  throw new Error('Wordcoin ID is required!')
}

export default function Home() {
  const { address } = useAccount()
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    nfts: originalNFTs,
    isLoadingNFTs,
    getUserOwnedNfts,
  } = useUserOwnedNfts<OriginalNFT>('originalAnoni')

  useEffect(() => {
    getUserOwnedNfts()
  }, [])

  // TODO: return error when user login with not orb id
  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>((resolve, reject) => {
      if (result.credential_type !== 'orb') {
        setError('Unique human should be verified with Orb!')
        reject('Unique human should be verified with Orb!')
      }

      resolve()
    })
  }, [])

  const onSuccess = (result: ISuccessResult) => {
    setError(undefined)
    onOpen()
  }

  const onFormSucess = () => {
    onClose()
    getUserOwnedNfts()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Modal isOpen={isOpen} onClose={onClose}>
        <OriginalForm onSuccess={onClose} />
      </Modal>
      <Box classes="bg-beige" title="My Anoni">
        {isLoadingNFTs ? (
          'Loading ... '
        ) : originalNFTs.length ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalNFTs[0].profileImage} alt="profile" />
            <table>
              <tbody className="divide-y-2 divide-solid div-">
                <tr>
                  <th>Full Name</th>
                  <td>{originalNFTs[0].fullName}</td>
                </tr>
                <tr>
                  <th>Discord Name</th>
                  <td>{originalNFTs[0].discordName}</td>
                </tr>
                <tr>
                  <th>Job</th>
                  <td>{originalNFTs[0].job}</td>
                </tr>
                <tr>
                  <th>Introduction</th>
                  <td>{originalNFTs[0].introduction}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            <p className="mb-10">
              You do not own a Anoni yet! Please verify that you are a human and
              create your Anoni!
            </p>

            {error && (
              <span className="text-red-500">
                Oops.. Error occured... &quot;{error}&quot;
              </span>
            )}
            {WORLDCOIN_ID && (
              <IDKitWidget
                action="verifyhuman"
                onSuccess={onSuccess}
                handleVerify={handleProof}
                app_id={WORLDCOIN_ID}
              >
                {({ open }) => (
                  <Button type="button" onClick={open}>
                    Yes, I am verified Human!
                  </Button>
                )}
              </IDKitWidget>
            )}
          </>
        )}
      </Box>
    </main>
  )
}
