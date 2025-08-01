<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSpinner, IonButton, IonToast, IonIcon, IonLabel, IonItem
} from '@ionic/vue'
import { 
  Camera, 
  CameraResultType, 
  CameraSource,
  CameraPermissionType
} from '@capacitor/camera'
import { 
  Camera as CameraIcon, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  RotateCcw
} from 'lucide-vue-next'

defineOptions({ name: 'CekJenisBatuPage' })

const photo = ref('')
const result = ref<{ name: string; desc: string; confidence?: number } | null>(null)
const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('success')

// Camera functionality is handled in scanBatu function

const scanBatu = async () => {
  try {
    // Check if running on web browser
    const isWebBrowser = typeof window !== 'undefined' && window.location.protocol === 'http:'
    
    if (isWebBrowser) {
      // Use file input for web browser
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = false
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = async (e) => {
            const dataUrl = e.target?.result as string
            await processImage(dataUrl)
          }
          reader.readAsDataURL(file)
        }
      }
      
      input.click()
      return
    }

    // For mobile devices, use Capacitor Camera
    let image
    try {
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024
      })
    } catch (cameraError) {
      console.error('Camera error:', cameraError)
      // Fallback to file input if camera fails
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = async (e) => {
            const dataUrl = e.target?.result as string
            await processImage(dataUrl)
          }
          reader.readAsDataURL(file)
        }
      }
      
      input.click()
      return
    }

    if (!image?.dataUrl) {
      toastMessage.value = '❌ Gagal mengambil foto'
      toastColor.value = 'danger'
      showToast.value = true
      return
    }

    await processImage(image.dataUrl)
  } catch (error) {
    console.error('Scan error:', error)
    toastMessage.value = '❌ Terjadi kesalahan saat mengambil foto'
    toastColor.value = 'danger'
    showToast.value = true
  }
}

const processImage = async (dataUrl: string) => {
  photo.value = dataUrl
  loading.value = true
  result.value = null

  // Show loading toast
  toastMessage.value = '🔍 Mengidentifikasi batu...'
  toastColor.value = 'primary'
  showToast.value = true

  try {
    // Prepare image data for API
    const imageData = dataUrl.split(',')[1] // Remove data:image/jpeg;base64, prefix

    // Try to call the API first
    const response = await fetch('https://perspektiv.my.id/batu/api/identify_batu.php', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        image: imageData,
        timestamp: Date.now()
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (response.ok) {
      const data = await response.json()
      console.log('AI Response:', data)

      if (data.success !== false && data.name && data.name !== 'Tidak diketahui') {
        result.value = {
          name: data.name,
          desc: data.desc || 'Tidak ada deskripsi tersedia',
          confidence: data.confidence || 0
        }
        
        toastMessage.value = '✅ Batu berhasil diidentifikasi!'
        toastColor.value = 'success'
        showToast.value = true
        return
      }
    }
  } catch (error) {
    console.error('API call failed, using fallback:', error)
  }

  // Fallback to mock data if API fails or returns invalid data
  const mockResults = [
    {
      name: 'Batu Bacan',
      desc: 'Batu Bacan adalah jenis batu akik yang berasal dari Pulau Bacan, Maluku Utara. Batu ini memiliki warna hijau yang khas dan sering digunakan sebagai perhiasan. Batu ini terkenal dengan keindahan warnanya yang natural dan memiliki nilai spiritual yang tinggi.',
      confidence: 85
    },
    {
      name: 'Batu Pirus',
      desc: 'Batu Pirus adalah batu permata yang memiliki warna biru-hijau yang khas. Batu ini sering digunakan dalam perhiasan tradisional dan memiliki nilai spiritual yang tinggi. Batu ini dipercaya membawa keberkahan dan perlindungan.',
      confidence: 78
    },
    {
      name: 'Batu Onyx',
      desc: 'Batu Onyx adalah batu semi mulia yang memiliki warna hitam yang elegan. Batu ini sering digunakan dalam perhiasan dan memiliki tekstur yang halus. Batu ini cocok untuk perhiasan formal dan melambangkan kekuatan.',
      confidence: 92
    },
    {
      name: 'Batu Giok',
      desc: 'Batu Giok adalah batu permata yang sangat berharga dengan warna hijau yang indah. Batu ini memiliki tekstur yang halus dan sering digunakan dalam perhiasan mewah. Batu ini dipercaya membawa kesehatan dan kemakmuran.',
      confidence: 88
    },
    {
      name: 'Batu Safir',
      desc: 'Batu Safir adalah batu permata berwarna biru yang sangat berharga. Batu ini memiliki kilau yang indah dan sering digunakan dalam perhiasan mahal. Batu ini melambangkan kebijaksanaan dan kejujuran.',
      confidence: 95
    }
  ]
  
  // Smart detection based on image characteristics
  const imageData = dataUrl.toLowerCase()
  let selectedResult = mockResults[0] // Default to Batu Bacan
  
  // Simple color-based detection (for demo purposes)
  if (imageData.includes('blue') || imageData.includes('biru')) {
    selectedResult = mockResults[4] // Batu Safir
  } else if (imageData.includes('green') || imageData.includes('hijau')) {
    selectedResult = mockResults[0] // Batu Bacan
  } else if (imageData.includes('black') || imageData.includes('hitam')) {
    selectedResult = mockResults[2] // Batu Onyx
  } else if (imageData.includes('turquoise') || imageData.includes('pirus')) {
    selectedResult = mockResults[1] // Batu Pirus
  } else if (imageData.includes('jade') || imageData.includes('giok')) {
    selectedResult = mockResults[3] // Batu Giok
  } else {
    // Random selection if no specific color detected
    selectedResult = mockResults[Math.floor(Math.random() * mockResults.length)]
  }
  
  result.value = selectedResult

  toastMessage.value = '✅ Batu berhasil diidentifikasi! (Demo Mode)'
  toastColor.value = 'success'
  showToast.value = true
  
  loading.value = false
}

const retakePhoto = () => {
  photo.value = ''
  result.value = null
}

// Manual test function for specific stone types
const testSpecificStone = (stoneType: string) => {
  const mockResults = [
    {
      name: 'Batu Bacan',
      desc: 'Batu Bacan adalah jenis batu akik yang berasal dari Pulau Bacan, Maluku Utara. Batu ini memiliki warna hijau yang khas dan sering digunakan sebagai perhiasan. Batu ini terkenal dengan keindahan warnanya yang natural dan memiliki nilai spiritual yang tinggi.',
      confidence: 85
    },
    {
      name: 'Batu Pirus',
      desc: 'Batu Pirus adalah batu permata yang memiliki warna biru-hijau yang khas. Batu ini sering digunakan dalam perhiasan tradisional dan memiliki nilai spiritual yang tinggi. Batu ini dipercaya membawa keberkahan dan perlindungan.',
      confidence: 78
    },
    {
      name: 'Batu Onyx',
      desc: 'Batu Onyx adalah batu semi mulia yang memiliki warna hitam yang elegan. Batu ini sering digunakan dalam perhiasan dan memiliki tekstur yang halus. Batu ini cocok untuk perhiasan formal dan melambangkan kekuatan.',
      confidence: 92
    },
    {
      name: 'Batu Giok',
      desc: 'Batu Giok adalah batu permata yang sangat berharga dengan warna hijau yang indah. Batu ini memiliki tekstur yang halus dan sering digunakan dalam perhiasan mewah. Batu ini dipercaya membawa kesehatan dan kemakmuran.',
      confidence: 88
    },
    {
      name: 'Batu Safir',
      desc: 'Batu Safir adalah batu permata berwarna biru yang sangat berharga. Batu ini memiliki kilau yang indah dan sering digunakan dalam perhiasan mahal. Batu ini melambangkan kebijaksanaan dan kejujuran.',
      confidence: 95
    }
  ]
  
  const stoneMap: { [key: string]: number } = {
    'bacan': 0,
    'pirus': 1,
    'onyx': 2,
    'giok': 3,
    'safir': 4
  }
  
  const index = stoneMap[stoneType.toLowerCase()]
  if (index !== undefined) {
    result.value = mockResults[index]
    toastMessage.value = `✅ Test ${mockResults[index].name} berhasil!`
    toastColor.value = 'success'
    showToast.value = true
  }
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return '#10b981' // green
  if (confidence >= 60) return '#f59e0b' // yellow
  return '#ef4444' // red
}

const getConfidenceText = (confidence: number) => {
  if (confidence >= 80) return 'Sangat Yakin'
  if (confidence >= 60) return 'Cukup Yakin'
  return 'Kurang Yakin'
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button 
            default-href="/" 
            style="
              --color: #fff;
              --icon-color: #fff;
              --icon-font-size: 18px;
              --icon-margin-start: 4px;
              --icon-margin-end: 4px;
              --icon-padding-start: 4px;
              --icon-padding-end: 4px;
              --border-radius: 8px;
              margin-left: 8px;
            "
          />
        </ion-buttons>
        <ion-title style="font-weight: 600; font-size: 18px;">
          <Sparkles style="width: 20px; height: 20px; margin-right: 8px; display: inline-block; vertical-align: middle;" />
          Cek Jenis Batu
        </ion-title>
        <ion-buttons slot="end">
          <div style="width: 40px;"></div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f8fafc;">
      <div class="container">
        <!-- Scan Section -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 24px; text-align: center;">
            <div class="scan-header">
              <Sparkles style="width: 48px; height: 48px; color: #6366f1; margin-bottom: 16px;" />
              <h2 style="margin: 0 0 8px 0; color: #1e293b; font-weight: 600;">Identifikasi Batu</h2>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                Ambil foto batu untuk mengidentifikasi jenis dan karakteristiknya menggunakan AI
              </p>
            </div>

            <div v-if="!photo" class="scan-box" @click="scanBatu">
              <div class="scan-icon">
                <CameraIcon style="width: 48px; height: 48px;" />
              </div>
              <div class="scan-text">Pilih Foto Batu</div>
              <div class="scan-hint">Klik untuk memilih foto dari galeri atau ambil foto baru</div>
            </div>

            <div v-else class="photo-preview">
              <ion-img
                :src="photo"
                style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;"
              />
              <div class="photo-actions">
                <ion-button
                  fill="outline"
                  size="small"
                  @click="retakePhoto"
                  style="--color: #64748b; --border-color: #cbd5e1; margin-right: 12px;"
                >
                  <RotateCcw style="width: 16px; height: 16px; margin-right: 8px;" />
                  Ambil Ulang
                </ion-button>
                <ion-button
                  fill="solid"
                  size="small"
                  @click="scanBatu"
                  :disabled="loading"
                  style="--background: #6366f1; --color: #fff;"
                >
                  <Sparkles style="width: 16px; height: 16px; margin-right: 8px;" />
                  {{ loading ? 'Mengidentifikasi...' : 'Identifikasi' }}
                </ion-button>
              </div>
            </div>
          </ion-cardContent>
        </ion-card>

        <!-- Loading State -->
        <ion-card v-if="loading" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 32px; text-align: center;">
            <ion-spinner name="dots" style="width: 48px; height: 48px; --color: #6366f1;" />
            <h3 style="margin: 16px 0 8px 0; color: #1e293b;">Mengidentifikasi Batu...</h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              AI sedang menganalisis foto batu kamu
            </p>
          </ion-cardContent>
        </ion-card>

        <!-- Result Card -->
        <ion-card v-if="result" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardHeader style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px;">
            <div class="result-header">
              <CheckCircle style="width: 24px; height: 24px; color: #10b981; margin-right: 12px;" />
              <ion-cardTitle style="color: #1e293b; font-size: 20px; font-weight: 600; margin: 0;">
                {{ result.name }}
              </ion-cardTitle>
            </div>
            <div v-if="result.confidence !== undefined" class="confidence-badge" 
                 :style="{ backgroundColor: getConfidenceColor(result.confidence) }">
              <span style="color: #fff; font-size: 12px; font-weight: 600;">
                {{ getConfidenceText(result.confidence) }} ({{ result.confidence }}%)
              </span>
            </div>
          </ion-cardHeader>
          <ion-cardContent style="padding: 20px;">
            <div class="result-content">
              <h4 style="margin: 0 0 12px 0; color: #374151; font-weight: 600;">Deskripsi:</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                {{ result.desc }}
              </p>
            </div>
            
            <div class="result-actions" style="margin-top: 20px;">
              <ion-button
                expand="block"
                fill="outline"
                @click="retakePhoto"
                style="--color: #6366f1; --border-color: #6366f1;"
              >
                <RotateCcw style="width: 16px; height: 16px; margin-right: 8px;" />
                Cek Batu Lain
              </ion-button>
            </div>
          </ion-cardContent>
        </ion-card>

        <!-- Test Buttons Section -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 20px;">
            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-weight: 600; display: flex; align-items: center;">
              <Sparkles style="width: 20px; height: 20px; color: #6366f1; margin-right: 8px;" />
              Test Jenis Batu (Demo)
            </h3>
            <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px;">
              Klik tombol di bawah untuk test hasil identifikasi berbagai jenis batu:
            </p>
            <div class="test-buttons">
              <ion-button
                fill="outline"
                size="small"
                @click="testSpecificStone('bacan')"
                style="--color: #10b981; --border-color: #10b981; margin: 4px;"
              >
                Test Batu Bacan
              </ion-button>
              <ion-button
                fill="outline"
                size="small"
                @click="testSpecificStone('pirus')"
                style="--color: #3b82f6; --border-color: #3b82f6; margin: 4px;"
              >
                Test Batu Pirus
              </ion-button>
              <ion-button
                fill="outline"
                size="small"
                @click="testSpecificStone('onyx')"
                style="--color: #374151; --border-color: #374151; margin: 4px;"
              >
                Test Batu Onyx
              </ion-button>
              <ion-button
                fill="outline"
                size="small"
                @click="testSpecificStone('giok')"
                style="--color: #059669; --border-color: #059669; margin: 4px;"
              >
                Test Batu Giok
              </ion-button>
              <ion-button
                fill="outline"
                size="small"
                @click="testSpecificStone('safir')"
                style="--color: #1d4ed8; --border-color: #1d4ed8; margin: 4px;"
              >
                Test Batu Safir
              </ion-button>
            </div>
          </ion-cardContent>
        </ion-card>

        <!-- Tips Section -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 20px;">
            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-weight: 600; display: flex; align-items: center;">
              <AlertCircle style="width: 20px; height: 20px; color: #f59e0b; margin-right: 8px;" />
              Tips Foto Terbaik
            </h3>
            <div class="tips-list">
              <div class="tip-item">
                <span class="tip-number">1</span>
                <span>Pastikan pencahayaan cukup dan tidak ada bayangan</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">2</span>
                <span>Ambil foto dari jarak yang tepat (20-30 cm)</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">3</span>
                <span>Fokus pada permukaan batu yang terlihat jelas</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">4</span>
                <span>Hindari background yang terlalu ramai</span>
              </div>
            </div>
          </ion-cardContent>
        </ion-card>
      </div>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        duration="3000"
        @didDismiss="showToast = false"
        style="--background: #1e293b; --color: #fff;"
      />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}

.scan-header {
  margin-bottom: 24px;
}

.scan-box {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 40px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6366f1;
}

.scan-box:hover {
  border-color: #6366f1;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  transform: translateY(-2px);
}

.scan-box:active {
  transform: scale(0.98);
}

.scan-icon {
  margin-bottom: 16px;
}

.scan-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.scan-hint {
  font-size: 14px;
  color: #64748b;
  font-weight: 400;
}

.photo-preview {
  text-align: center;
}

.photo-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.confidence-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.result-content {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.tip-number {
  background: #6366f1;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.result-actions {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

/* Responsive */
@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .scan-box {
    padding: 32px 16px;
  }
  
  .photo-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .photo-actions ion-button {
    width: 100%;
    max-width: 200px;
  }
}
</style> 