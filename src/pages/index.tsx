import { useEffect } from 'react'

import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'
import Original from '~/components/Anoni/Original'
import Anoni from '~/components/Anoni'
import Box from '~/components/Common/Box'
import { OriginalNFT } from '~/components/Anoni/Original'

export default function Home() {
  const { airstackFetch, nfts, loading } =
    useUserOwnedNfts<OriginalNFT>('originalAnoni')

  useEffect(() => {
    airstackFetch()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center gap-y-8 p-4">
      <Original nfts={nfts} loading={loading} airstackFetch={airstackFetch} />
      <Box classes="bg-beige" title="My Wallet">
        <Anoni />
      </Box>
    </main>
  )
}
