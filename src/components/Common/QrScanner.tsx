import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface Props {
  onReadQrCode: (data: string) => void
}

const Scanner: React.FC<Props> = ({ onReadQrCode }) => {
  const scannerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const qrScanner = useRef<Html5QrcodeScanner | null>(null)

  function onScanSuccess(decodedText: any, decodedResult: any) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult)
    onReadQrCode(decodedText)

    qrScanner.current?.clear()
  }

  function onScanFailure(error: any) {
    console.warn(`Code scan error = ${error}`)
  }
  useEffect(() => {
    if (!qrScanner.current) {
      qrScanner.current = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      )
      qrScanner.current.render(onScanSuccess, onScanFailure)
    }
  }, [])

  return (
    <div className="w-full h-full">
      <div id="reader"></div>
    </div>
  )
}

export default Scanner
