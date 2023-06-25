import { useState, useEffect } from 'react'

import { useLazyQuery } from '@airstack/airstack-react'
import { useAccount } from 'wagmi'

import nftConfig from '~/nftConfig.json'
import Lit from '~/Lit'
import { query } from '~/util/query'

// eslint-disable-next-line import/no-anonymous-default-export
export default <T>(nftName: 'originalAnoni' | 'anonicard') => {
  const [nfts, setNFTs] = useState<T[]>([])
  // const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)
  const { address } = useAccount()

  const [airstackFetch, { data, loading, error: airstackErr }] = useLazyQuery(
    query('originalAnoni', address),
    {}
  )

  const getDecryptedValue = async () => {
    console.log(data)
    if (!data?.TokenBalances?.TokenBalance) {
      return
    }

    const nfts = await Promise.all(
      data.TokenBalances.TokenBalance.map(async (token: any) => {
        let metadata
        let url

        const ipfsURI = token.tokenNfts.tokenURI.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/'
        )
        const res = await fetch(ipfsURI)
        const encryptedMetadata = await res.json()

        if (
          encryptedMetadata?.encryptedString &&
          encryptedMetadata?.encryptedStringSymmetricKey
        ) {
          metadata = await Lit.decryptText(
            'originalAnoni',
            encryptedMetadata.encryptedString,
            encryptedMetadata.encryptedStringSymmetricKey,
            token.tokenNfts.tokenId
          )
        }

        if (
          encryptedMetadata?.encryptedImage &&
          encryptedMetadata?.encryptedFileSymmetricKey
        ) {
          const profileImage = await Lit.decryptFile(
            'originalAnoni',
            encryptedMetadata?.encryptedImage,
            encryptedMetadata?.encryptedFileSymmetricKey,
            token.tokenNfts.tokenId
          )

          const blob = new Blob([profileImage], { type: 'image/bmp' })
          url = window.URL.createObjectURL(blob)
        }

        return {
          ...metadata,
          profileImage: url,
          tokenId: token.tokenNfts.tokenId,
        }
      })
    )
    setNFTs(nfts)
  }

  useEffect(() => {
    if (!address || !data) {
      return
    }

    getDecryptedValue()
  }, [data])

  return { airstackFetch, nfts, loading }
}
