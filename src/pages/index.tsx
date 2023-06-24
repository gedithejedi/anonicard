import { useState, useEffect } from 'react'

import alchemy from '~/alchemy'
import { useAccount } from 'wagmi'

import Box from '~/components/Common/Box'
import OriginalForm from '~/components/OriginalForm'
import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'

interface OriginalNFT {
  tokenId: string
  profileImage?: string
  fullName: string
  discordName: string
  job: number
  introduction: string
}

export default function Home() {
  const { address } = useAccount()

  const {
    nfts: originalNFTs,
    isLoadingNFTs,
    getUserOwnedNfts,
  } = useUserOwnedNfts<OriginalNFT>('originalAnoni')

  useEffect(() => {
    getUserOwnedNfts()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Box classes="bg-beige">
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
          <OriginalForm />
        )}
      </Box>
    </main>
  )
}
