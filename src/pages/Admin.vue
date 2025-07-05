<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonTextarea, IonButton, IonLabel, IonItem,
  IonList, IonToast, IonImg, IonBackButton, IonButtons, IonProgressBar
} from '@ionic/vue'

defineOptions({ name: 'AdminPage' })

const nama = ref('')
const jenis = ref('')
const asal = ref('')
const deskripsi = ref('')
const videoFile = ref<File | null>(null)
const fotoFile = ref<File | null>(null)
const previewFoto = ref<string | null>(null)

const showToast = ref(false)
const toastMessage = ref('')
const uploadProgress = ref(0)
const isUploading = ref(false)

const onFotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    fotoFile.value = file
    previewFoto.value = URL.createObjectURL(file)
  }
}

const onVideoChange = (e: Event) => {
  videoFile.value = (e.target as HTMLInputElement).files?.[0] || null
}

const resetForm = () => {
  nama.value = ''
  jenis.value = ''
  asal.value = ''
  deskripsi.value = ''
  fotoFile.value = null
  videoFile.value = null
  previewFoto.value = null
  uploadProgress.value = 0
  isUploading.value = false
}

const submitBatu = async () => {
  if (!nama.value || !jenis.value || !asal.value || !deskripsi.value || !fotoFile.value) {
    toastMessage.value = '❗ Semua field wajib diisi kecuali video.'
    showToast.value = true
    return
  }

  const formData = new FormData()
  formData.append('nama', nama.value)
  formData.append('jenis', jenis.value)
  formData.append('asal', asal.value)
  formData.append('deskripsi', deskripsi.value)
  formData.append('foto', fotoFile.value)
  if (videoFile.value) {
    formData.append('video360', videoFile.value)
  }

  isUploading.value = true

  try {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://perspektiv.my.id/batu/api/tambah_batu.php')

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = event.loaded / event.total
      }
    }

    xhr.onload = () => {
      isUploading.value = false
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        if (res.success) {
          toastMessage.value = '✅ Batu berhasil ditambahkan!'
          resetForm()
        } else {
          toastMessage.value = '❌ Gagal menambahkan batu.'
        }
      } else {
        toastMessage.value = '❌ Gagal mengirim data.'
      }
      showToast.value = true
    }

    xhr.onerror = () => {
      isUploading.value = false
      toastMessage.value = '❌ Upload error terjadi.'
      showToast.value = true
    }

    xhr.send(formData)
  } catch {
    isUploading.value = false
    toastMessage.value = '❌ Koneksi gagal.'
    showToast.value = true
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
        <ion-title>Tambah Koleksi Batu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="floating">Nama Batu</ion-label>
          <ion-input v-model="nama" />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Jenis</ion-label>
          <ion-input v-model="jenis" />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Asal</ion-label>
          <ion-input v-model="asal" />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Deskripsi</ion-label>
          <ion-textarea v-model="deskripsi" auto-grow />
        </ion-item>

        <ion-item>
          <ion-label>Upload Foto</ion-label>
          <input type="file" accept="image/*" @change="onFotoChange" style="margin-left: 1rem;" />
        </ion-item>

        <ion-item v-if="previewFoto">
          <ion-img :src="previewFoto" style="width: 100%; max-height: 200px; object-fit: contain;" />
        </ion-item>

        <ion-item>
          <ion-label>Upload Video 360 (opsional)</ion-label>
          <input type="file" accept="video/mp4" @change="onVideoChange" style="margin-left: 1rem;" />
        </ion-item>
      </ion-list>

      <ion-progress-bar
        v-if="isUploading"
        :value="uploadProgress"
        buffer="1.0"
        color="primary"
        class="ion-margin-top"
      />

      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="submitBatu"
        :disabled="isUploading"
      >
        Simpan
      </ion-button>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        duration="2500"
        @didDismiss="showToast = false"
      />
    </ion-content>
  </ion-page>
</template>
