import { useEffect } from 'react'

import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'
import Original from '~/components/Anoni/Original'
import Box from '~/components/Common/Box'

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
        Show Anonycard List
      </Box>
    </main>
  )
}
