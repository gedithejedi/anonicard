import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { useDisclosure } from '@chakra-ui/react'

import { useAccount } from 'wagmi'

import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'
import Modal from '~/components/Common/Modal'
import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'

export interface AnoniNFT {
  tokenId: string
  profileImage?: Blob
  profileImageUrl?: string
  fullName: string
  discordName: string
  job: string
  introduction: string
  occasion: string
  memo: string
}

const Anony: React.FC = () => {
  const [error, setError] = useState<string | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { airstackFetch, nfts, loading } =
    useUserOwnedNfts<AnoniNFT>('anonicard')

  useEffect(() => {
    airstackFetch()
  }, [])

  const { address } = useAccount()

  const onSuccess = () => {
    setError(undefined)
    onOpen()
  }

  const onFormSucess = () => {
    onClose()
    airstackFetch()
  }
  console.log(nfts[0])

  return (
    <>
      <div>
        {loading ? (
          'Loading ... '
        ) : nfts.length ? (
          <div className="border-2 border-black p-2 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={nfts[0].profileImageUrl} alt="profile" />
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
                <tr>
                  <th>Occasion</th>
                  <td>{nfts[0].occasion}</td>
                </tr>
                <tr>
                  <th>Memo</th>
                  <td>{nfts[0].memo}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-start w-full mt-3">
              <button
                className="font-bold bg-black text-white transition-shadow duration-300 py-2 px-4 border-2 border-black hover:text-black hover:bg-white"
                onClick={() => console.log('annoicard')}
              >
                Edit Anonicard
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-10">
              You do not own an Anoni yet! Start to connect with Frens by
              exchanging Anonicard!
            </p>
          </>
        )}
      </div>
    </>
  )
}

export default Anony
