import { useState, useEffect } from 'react'

import alchemy from '~/alchemy'
import { useAccount } from 'wagmi'

import nftConfig from '~/nftConfig.json'
import Lit from '~/Lit'

// eslint-disable-next-line import/no-anonymous-default-export
export default <T>(nftName: 'originalAnoni' | 'anonicard') => {
  const [nfts, setNFTs] = useState<T[]>([])
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)
  const { address } = useAccount()

  const getUserOwnedNfts = async () => {
    if (!address) {
      return
    }

    setIsLoadingNFTs(true)

    const response = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [nftConfig[nftName].address],
    })

    if (response) {
      const nfts = await Promise.all(
        response.ownedNfts.map(async (nft) => {
          let metadata
          let url

          if (
            nft.rawMetadata?.encryptedString &&
            nft.rawMetadata?.encryptedStringSymmetricKey
          ) {
            metadata = await Lit.decryptText(
              'originalAnoni',
              nft.rawMetadata?.encryptedString,
              nft.rawMetadata?.encryptedStringSymmetricKey,
              nft.tokenId
            )
          }

          if (
            nft.rawMetadata?.encryptedImage &&
            nft.rawMetadata?.encryptedFileSymmetricKey
          ) {
            const profileImage = await Lit.decryptFile(
              'originalAnoni',
              nft.rawMetadata?.encryptedImage,
              nft.rawMetadata?.encryptedFileSymmetricKey,
              nft.tokenId
            )

            const blob = new Blob([profileImage], { type: 'image/bmp' })
            url = window.URL.createObjectURL(blob)
          }

          return {
            ...metadata,
            profileImage: url,
            tokenId: nft.tokenId,
          }
        })
      )
      setNFTs(nfts)
      setIsLoadingNFTs(false)
    }
  }

  return { nfts, isLoadingNFTs, getUserOwnedNfts }
}
