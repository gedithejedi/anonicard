import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Box>
        <Button width="30%">Hi</Button>
      </Box>
    </main>
  )
}
