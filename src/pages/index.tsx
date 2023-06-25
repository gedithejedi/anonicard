import { useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'
import Original from '~/components/Anoni/Original'
import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'
import Modal from '~/components/Common/Modal'
import AnoniForm from '~/components/AnoniForm'

export default function Home() {
  const { airstackFetch, nfts, loading } =
    useUserOwnedNfts<OriginalNFT>('originalAnoni')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { address } = useAccount()

  useEffect(() => {
    airstackFetch()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Modal isOpen={isOpen} onClose={onClose}>
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
      <Original nfts={nfts} loading={loading} airstackFetch={airstackFetch} />
      <Box classes="bg-beige" title="My Wallet">
        Show Anonycard List
      </Box>
    </main>
  )
}
