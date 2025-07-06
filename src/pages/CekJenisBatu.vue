<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSpinner
} from '@ionic/vue'

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Fullscreen } from 'lucide-vue-next'

defineOptions({ name: 'ScanPage' })

const photo = ref('')
const result = ref<{ name: string; desc: string } | null>(null)
const loading = ref(false)

const scanBatu = async () => {
  const image = await Camera.getPhoto({
    quality: 70,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
  }).catch(() => null)

  if (!image?.dataUrl) return

  photo.value = image.dataUrl
  loading.value = true
  result.value = null

  try {
    const res = await fetch('https://perspektiv.my.id/batu/api/identify_batu.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: photo.value })
    })

    const json = await res.json()
    result.value = json
  } catch (e) {
    result.value = {
      name: 'Tidak diketahui',
      desc: 'Gagal mengidentifikasi batu. Coba lagi nanti.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #6366f1; --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Scan Batu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="scan-box" @click="scanBatu">
        <div class="scan-icon">
          <Fullscreen class="camera-action" />
        </div>
        <div class="scan-text">Ambil Foto Batu</div>
      </div>

      <div v-if="photo" style="text-align: center; margin: 1rem 0;">
        <ion-img
          :src="photo"
          style="object-fit: contain; border-radius: 12px;"
        />
      </div>

      <div v-if="loading" style="text-align: center; margin-top: 1rem;">
        <ion-spinner name="dots" />
        <p style="margin-top: 0.5rem;">Mengidentifikasi batu...</p>
      </div>

      <ion-card v-if="result" class="result-card">
        <ion-card-header class="result-card-header">
          <ion-card-title>{{ result.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content class="result-card-content">
          <p>{{ result.desc }}</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.camera-action {
  color: #6366f1;
  width: 48px;
  height: 48px;
}
.result-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  margin-top: 1.5rem;
  display: block;
}

.result-card-header {
  background-color: #f3f4f6;
  padding: 1rem;
}

.result-card-header ion-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.result-card-content {
  padding: 1rem;
  font-size: 14px;
  color: #374151;
}

.scan-box {
  background-color: #ffffff;
  color: #6366f1;
  border: 1px solid #6366f1;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  margin-top: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease;
}

.scan-box:hover {
  transform: scale(1.02);
}

.scan-icon {
  font-size: 32px;
  margin-bottom: 0.5rem;
}

.scan-text {
  font-size: 15px;
}
</style>
