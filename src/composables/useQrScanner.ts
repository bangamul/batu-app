import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
import { useRouter } from 'vue-router'

export function useQrScanner() {
  const router = useRouter()

  const addOverlayBox = () => {
    const overlay = document.createElement('div')
    overlay.id = 'scan-box-overlay'
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 140px;
        height: 140px;
        border: 3px solid #10b981;
        border-radius: 12px;
        z-index: 9999;
        box-shadow: 0 0 20px rgba(16,185,129,0.5);
        animation: pulse 1.5s infinite;
      "></div>
      <p style="
        position: fixed;
        top: calc(50% + 140px);
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        text-shadow: 0 1px 3px black;
        z-index: 9999;
      ">Arahkan QR ke dalam kotak</p>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 20px rgba(16,185,129,0.9); }
          100% { box-shadow: 0 0 0 rgba(16,185,129,0.4); }
        }
      </style>
    `
    document.body.appendChild(overlay)
  }

  const removeOverlayBox = () => {
    const box = document.getElementById('scan-box-overlay')
    if (box) box.remove()
  }

  const startScan = async () => {
    try {
      await BarcodeScanner.checkPermission({ force: true })

      await BarcodeScanner.hideBackground()
      document.body.style.background = 'transparent'
      addOverlayBox()

      const result = await BarcodeScanner.startScan()
      removeOverlayBox()

      if (result.hasContent) {
        const scannedId = result.content?.trim()

        const res = await fetch(`https://perspektiv.my.id/batu/api/detail_batu.php?id=${scannedId}`)
        if (!res.ok) {
          return router.push('/scan')
        }

        const data = await res.json()
        if (!data?.id) {
          return router.push('/scan')
        }

        router.push(`/detail/${data.id}`)
      } else {
        router.push('/scan')
      }
    } catch (err) {
      console.error('QR Scan Error:', err)
      removeOverlayBox()
      router.push('/scan')
    } finally {
      BarcodeScanner.showBackground()
      await BarcodeScanner.stopScan()
      document.body.style.background = ''
    }
  }

  return { startScan }
}
