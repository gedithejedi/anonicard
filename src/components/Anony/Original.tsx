import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { useDisclosure } from '@chakra-ui/react'
// import dynamic from 'next/dynamic'

import { useAccount } from 'wagmi'
import { CredentialType, IDKitWidget } from '@worldcoin/idkit'
import type { ISuccessResult } from '@worldcoin/idkit'

import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'
import OriginalFormMint from '~/components/OriginalFormMint'
import Modal from '~/components/Common/Modal'
import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'

export interface OriginalNFT {
  tokenId: string
  profileImage?: string
  fullName: string
  discordName: string
  job: string
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

const Original: React.FC = () => {
  const { address } = useAccount()
  const [error, setError] = useState<string | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    airstackFetch,
    nfts,
    loading
  } = useUserOwnedNfts<OriginalNFT>('originalAnoni')

  useEffect(() => {
    airstackFetch()
  }, [])

  const handleProof = async (result: ISuccessResult) => {
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
      signal: '',
    }

    return fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    }).then(async (res: Response) => {
      return new Promise<void>((resolve, reject) => {
        if (res.status !== 200) {
          setError('Error happend! Maybe you are not verified with Orb?')
          reject('Verification failed')
          console.error('Verification failed')
        }

        console.log('Successfully verified credential.')
        resolve()
      })
    })
  }

  const onSuccess = () => {
    setError(undefined)
    onOpen()
  }

  const onFormSucess = () => {
    onClose()
    airstackFetch()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="py-5">
          <OriginalFormMint onSuccess={onFormSucess} oldData={nfts[0]} />
        </div>
      </Modal>
      <Box classes="bg-beige" title="My Anoni">
        {loading ? (
          'Loading ... '
        ) : nfts.length ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={nfts[0].profileImage} alt="profile" />
            <table>
              <tbody className="divide-y-2 divide-solid div-">
                <tr>
                  <th>Full Name</th>
                  <td>{nfts[0].fullName}</td>
                </tr>
                <tr>
                  <th>Discord Name</th>
                  <td>{nfts[0].discordName}</td>
                </tr>
                <tr>
                  <th>Job</th>
                  <td>{nfts[0].job}</td>
                </tr>
                <tr>
                  <th>Introduction</th>
                  <td>{nfts[0].introduction}</td>
                </tr>
              </tbody>
            </table>
            <div className='flex justify-between mt-3'>
              <button
                className="font-bold bg-black text-white transition-shadow duration-300 py-2 px-4 border-2 border-black hover:text-black hover:bg-white"
                onClick={() => onSuccess()}
              >
                Edit AnoniCard
              </button>
              <button
                className="font-bold bg-black text-white transition-shadow duration-300 py-2 px-4 border-2 border-green hover:text-green hover:bg-white"
                onClick={() => console.log("send")}
              >
                Send AnoniCard
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-10">
              You do not own an Anoni yet! Please verify that you are a human
              and create your first Anoni Card!
            </p>

            {error && (
              <span className="text-red-500">
                Oops.. Error occured... &quot;{error}&quot;
              </span>
            )}
            {WORLDCOIN_ID && (
              <IDKitWidget
                action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
                onSuccess={onSuccess}
                handleVerify={handleProof}
                app_id={WORLDCOIN_ID}
                credential_types={[CredentialType.Orb]}
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
    </>
  )
}

export default Original
