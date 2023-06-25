import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { useDisclosure } from '@chakra-ui/react'
// import dynamic from 'next/dynamic'

import { CredentialType, IDKitWidget } from '@worldcoin/idkit'
import type { ISuccessResult } from '@worldcoin/idkit'
import { useAccount } from 'wagmi'

import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'
import OriginalForm from '~/components/OriginalForm'
import Modal from '~/components/Common/Modal'
import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'
import AnoniForm from '~/components/AnoniForm'

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

interface Props {
  nfts: OriginalNFT[]
  loading: boolean
  airstackFetch: () => void
}

const Original: React.FC<Props> = ({ nfts, loading, airstackFetch }) => {
  const [error, setError] = useState<string | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isSendOpen,
    onOpen: onSendOpen,
    onClose: onSendClose,
  } = useDisclosure()

  const { address } = useAccount()

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
      {nfts?.[0] && (
        <Modal isOpen={isSendOpen} onClose={onSendClose}>
          <div className="py-5">
            <AnoniForm
              defaultNft={{
                'Wallet Address': address,
                'Profile Image': nfts[0].profileImage,
                'Full Name': nfts[0].fullName,
                'Discord Handle': nfts[0].discordName,
                Job: nfts[0].job,
                Introduction: nfts[0].introduction,
              }}
            />
          </div>
        </Modal>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="py-5">
          <OriginalForm onSuccess={onFormSucess} />
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
            <div className="flex justify-between mt-3">
              <button
                className="font-bold bg-black text-white transition-shadow duration-300 py-2 px-4 border-2 border-black hover:text-black hover:bg-white"
                onClick={() => onSuccess()}
              >
                Edit Anonicard
              </button>
              <button
                className="font-bold bg-yellow-400 text-white transition-shadow duration-300 py-2 px-4 border-2 border-yellow-400 hover:text-black hover:bg-white"
                onClick={() => onSendOpen()}
              >
                Send Anonicard
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
