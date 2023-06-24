import Box from '~/components/Common/Box'
import dynamic from 'next/dynamic'
const OriginalForm = dynamic(() => import('~/components/OriginalForm'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Box>
        <OriginalForm />
      </Box>
    </main>
  )
}
