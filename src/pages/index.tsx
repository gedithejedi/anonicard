import Box from '~/components/Common/Box'
import dynamic from 'next/dynamic'
import OriginalForm from '~/components/OriginalForm'

interface OriginalNFT {
  tokenId: string
  profileImage?: string
  fullName: string
  discordName: string
  job: number
  introduction: string
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Box>
        <OriginalForm />
      </Box>
    </main>
  )
}
