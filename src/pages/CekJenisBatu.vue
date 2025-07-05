<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonLabel,
  IonSpinner,
  IonBackButton,
  IonButtons
} from '@ionic/vue'

defineOptions({ name: 'CekJenisBatuPage' })

const model = ref<any>(null)
const selectedImage = ref<string | null>(null)
const hasilPrediksi = ref<string | null>(null)
const loading = ref(false)

const modelURL = '/model/model.json'
const metadataURL = '/model/metadata.json'

onMounted(async () => {
  try {
    console.log('⏳ Loading model...')
    const tmImage = (window as any).tmImage
    model.value = await tmImage.load(modelURL, metadataURL)
    console.log('✅ Model loaded')
  } catch (err) {
    console.error('❌ Gagal load model:', err)
  }
})

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedImage.value = URL.createObjectURL(file)
    hasilPrediksi.value = null
  }
}

const prediksiAI = async () => {
  if (!model.value || !selectedImage.value) {
    console.error('❌ Model atau gambar belum siap', model.value, selectedImage.value)
    return
  }

  const imageElement = new Image()
  imageElement.crossOrigin = 'anonymous'
  imageElement.src = selectedImage.value

  await new Promise((resolve) => {
    imageElement.onload = resolve
  })

  try {
    loading.value = true
    console.log('🔍 Memulai prediksi...')
    const prediction = await model.value.predict(imageElement)
    console.log('📊 Hasil prediksi:', prediction)
    const top = prediction.sort((a, b) => b.probability - a.probability)[0]
    hasilPrediksi.value = `Kemungkinan besar ini adalah batu ${top.className} (${(top.probability * 100).toFixed(2)}%)`
  } catch (err) {
    console.error('❌ Gagal prediksi:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Cek Jenis Batu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="upload-box">
        <input type="file" accept="image/*" @change="onFileChange" />
      </div>

      <div v-if="selectedImage" class="preview-box">
        <ion-img :src="selectedImage" />
        <ion-button
        expand="block"
        color="success"
        class="ion-margin-top"
        :disabled="loading"
        @click="prediksiAI"
        >
          <ion-spinner v-if="loading" name="dots" />
          <template v-else>Cek Jenis Batu</template>
        </ion-button>
      </div>

      <div v-if="hasilPrediksi" class="hasil-box">
        <ion-label>{{ hasilPrediksi }}</ion-label>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.upload-box {
  margin-bottom: 1rem;
}

.preview-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-box ion-img {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.hasil-box {
  margin-top: 1rem;
  background: #eef2ff;
  padding: 1rem;
  border-radius: 10px;
  font-weight: bold;
  color: #333;
  text-align: center;
}
</style>
