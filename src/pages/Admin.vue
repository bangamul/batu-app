<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonTextarea, IonButton, IonLabel, IonItem,
  IonList, IonToast, IonImg, IonBackButton, IonButtons, IonProgressBar,
  IonIcon, IonCard, IonCardContent, IonThumbnail, IonChip
} from '@ionic/vue'
import { 
  cameraOutline, 
  videocamOutline, 
  closeOutline, 
  cloudUploadOutline,
  checkmarkCircleOutline,
  alertCircleOutline
} from 'ionicons/icons'

defineOptions({ name: 'AdminPage' })

const nama = ref('')
const jenis = ref('')
const asal = ref('')
const deskripsi = ref('')
const videoFile = ref<File | null>(null)
const fotoFile = ref<File | null>(null)
const previewFoto = ref<string | null>(null)
const previewVideo = ref<string | null>(null)

const showToast = ref(false)
const toastMessage = ref('')
const uploadProgress = ref(0)
const isUploading = ref(false)

// Refs for file inputs
const fotoInput = ref<HTMLInputElement>()
const videoInput = ref<HTMLInputElement>()

const onFotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastMessage.value = '❌ Ukuran foto maksimal 5MB'
      showToast.value = true
      return
    }
    
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      toastMessage.value = '❌ File harus berupa gambar'
      showToast.value = true
      return
    }
    
    fotoFile.value = file
    previewFoto.value = URL.createObjectURL(file)
  }
}

const onVideoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validasi ukuran file (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toastMessage.value = '❌ Ukuran video maksimal 50MB'
      showToast.value = true
      return
    }
    
    // Validasi tipe file
    if (!file.type.startsWith('video/')) {
      toastMessage.value = '❌ File harus berupa video'
      showToast.value = true
      return
    }
    
    videoFile.value = file
    previewVideo.value = URL.createObjectURL(file)
  }
}

const removeFoto = () => {
  fotoFile.value = null
  if (previewFoto.value) {
    URL.revokeObjectURL(previewFoto.value)
    previewFoto.value = null
  }
}

const removeVideo = () => {
  videoFile.value = null
  if (previewVideo.value) {
    URL.revokeObjectURL(previewVideo.value)
    previewVideo.value = null
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const resetForm = () => {
  nama.value = ''
  jenis.value = ''
  asal.value = ''
  deskripsi.value = ''
  fotoFile.value = null
  videoFile.value = null
  if (previewFoto.value) {
    URL.revokeObjectURL(previewFoto.value)
  previewFoto.value = null
  }
  if (previewVideo.value) {
    URL.revokeObjectURL(previewVideo.value)
    previewVideo.value = null
  }
  uploadProgress.value = 0
  isUploading.value = false
}

const submitBatu = async () => {
  if (!nama.value || !jenis.value || !asal.value || !deskripsi.value || !fotoFile.value) {
    toastMessage.value = '❗ Semua field wajib diisi kecuali video.'
    showToast.value = true
    return
  }

  // Format deskripsi ke HTML <p> tiap baris
  const deskripsiFormatted = deskripsi.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join('\n')

  const formData = new FormData()
  formData.append('nama', nama.value)
  formData.append('jenis', jenis.value)
  formData.append('asal', asal.value)
  formData.append('deskripsi', deskripsiFormatted)
  formData.append('foto', fotoFile.value)
  if (videoFile.value) {
    formData.append('video360', videoFile.value)
  }

  // Log isi form sebelum kirim
  console.log('📦 FormData contents:')
  formData.forEach((val, key) => {
    console.log(`📦 ${key} =`, val)
  })

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
      console.log('📨 Server responded with:', xhr.responseText)

      try {
        const res = JSON.parse(xhr.responseText)
        console.log('✅ Parsed JSON:', res)

        if (res.success) {
          toastMessage.value = '✅ Batu berhasil ditambahkan!'
          resetForm()
        } else {
          toastMessage.value = `❌ ${res.message}`
        }
      } catch (err) {
        toastMessage.value = '❌ Respon server tidak bisa dibaca.'
        console.error('⚠️ Gagal parse JSON:', xhr.responseText)
      }

      showToast.value = true
    }

    xhr.onerror = () => {
      isUploading.value = false
      toastMessage.value = '❌ Upload error terjadi.'
      showToast.value = true
    }

    xhr.send(formData)
  } catch (err) {
    isUploading.value = false
    toastMessage.value = '❌ Koneksi gagal.'
    showToast.value = true
    console.error('❌ Koneksi error:', err)
  }
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
          <ion-icon :icon="cloudUploadOutline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
          Tambah Koleksi Batu
        </ion-title>
        <ion-buttons slot="end">
          <div style="width: 40px;"></div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f8fafc;">
      <div class="form-container" style="max-width: 600px; margin: 24px auto 0; padding: 0 16px;">
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <ion-cardContent>
            <h2 style="color: #1e293b; margin-bottom: 24px; font-weight: 600;">
              <ion-icon :icon="checkmarkCircleOutline" style="color: #10b981; margin-right: 8px;"></ion-icon>
              Informasi Batu
            </h2>
            
            <ion-list style="background: transparent;">
              <ion-item style="--border-radius: 12px; margin-bottom: 16px; --background: #f1f5f9; --padding-start: 16px; --padding-end: 16px;">
                <ion-label position="stacked" style="color: #64748b; font-weight: 500; margin-bottom: 8px;">Nama Batu</ion-label>
                <ion-input 
                  v-model="nama" 
                  :readonly="isUploading" 
                  style="--color: #1e293b; --padding-start: 0; --padding-end: 0; --background: transparent;"
                  placeholder="Masukkan nama batu..."
                />
        </ion-item>

              <ion-item style="--border-radius: 12px; margin-bottom: 16px; --background: #f1f5f9; --padding-start: 16px; --padding-end: 16px;">
                <ion-label position="stacked" style="color: #64748b; font-weight: 500; margin-bottom: 8px;">Jenis</ion-label>
                <ion-input 
                  v-model="jenis" 
                  :readonly="isUploading" 
                  style="--color: #1e293b; --padding-start: 0; --padding-end: 0; --background: transparent;"
                  placeholder="Contoh: Bacan, Pirus, Onyx..."
                />
        </ion-item>

              <ion-item style="--border-radius: 12px; margin-bottom: 16px; --background: #f1f5f9; --padding-start: 16px; --padding-end: 16px;">
                <ion-label position="stacked" style="color: #64748b; font-weight: 500; margin-bottom: 8px;">Asal</ion-label>
                <ion-input 
                  v-model="asal" 
                  :readonly="isUploading" 
                  style="--color: #1e293b; --padding-start: 0; --padding-end: 0; --background: transparent;"
                  placeholder="Contoh: Sulawesi, Yaman..."
                />
        </ion-item>

              <ion-item style="--border-radius: 12px; margin-bottom: 16px; --background: #f1f5f9; --padding-start: 16px; --padding-end: 16px;">
                <ion-label position="stacked" style="color: #64748b; font-weight: 500; margin-bottom: 8px;">Deskripsi</ion-label>
                <ion-textarea 
                  v-model="deskripsi" 
                  auto-grow 
                  :readonly="isUploading" 
                  style="--color: #1e293b; --padding-start: 0; --padding-end: 0; --background: transparent;"
                  placeholder="Jelaskan detail batu, karakteristik, dan keunikan..."
                  :rows="4"
                />
        </ion-item>
            </ion-list>
          </ion-cardContent>
        </ion-card>

        <!-- Upload Foto Section -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-top: 20px;">
          <ion-cardContent>
            <h3 style="color: #1e293b; margin-bottom: 16px; font-weight: 600;">
              <ion-icon :icon="cameraOutline" style="color: #3b82f6; margin-right: 8px;"></ion-icon>
              Foto Batu
            </h3>
            
            <div v-if="!previewFoto" class="upload-area" @click="fotoInput?.click()">
          <input
                ref="fotoInput"
            type="file"
            accept="image/*"
            @change="onFotoChange"
            :disabled="isUploading"
                style="display: none;"
              />
              <ion-icon :icon="cameraOutline" style="font-size: 48px; color: #94a3b8;"></ion-icon>
              <p style="color: #64748b; margin: 12px 0 8px 0; font-weight: 500;">Upload Foto Batu</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Klik untuk memilih foto (Max 5MB)</p>
            </div>

            <div v-else class="preview-container">
              <ion-thumbnail style="width: 100%; height: 200px; border-radius: 12px; overflow: hidden;">
                <ion-img :src="previewFoto" style="object-fit: cover;" />
              </ion-thumbnail>
              <div class="file-info">
                <ion-chip color="primary" style="margin: 8px 0;">
                  <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                  <ion-label>{{ fotoFile?.name }}</ion-label>
                </ion-chip>
                <p style="color: #64748b; font-size: 12px; margin: 4px 0;">
                  {{ fotoFile ? formatFileSize(fotoFile.size) : '' }}
                </p>
                <ion-button 
                  fill="clear" 
                  size="small" 
                  @click="removeFoto"
                  :disabled="isUploading"
                  style="--color: #ef4444;"
                >
                  <ion-icon :icon="closeOutline" slot="start"></ion-icon>
                  Hapus
                </ion-button>
              </div>
            </div>
          </ion-cardContent>
        </ion-card>

        <!-- Upload Video Section -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-top: 20px;">
          <ion-cardContent>
            <h3 style="color: #1e293b; margin-bottom: 16px; font-weight: 600;">
              <ion-icon :icon="videocamOutline" style="color: #8b5cf6; margin-right: 8px;"></ion-icon>
              Video 360° (Opsional)
            </h3>
            
            <div v-if="!previewVideo" class="upload-area" @click="videoInput?.click()">
          <input
                ref="videoInput"
            type="file"
            accept="video/mp4"
            @change="onVideoChange"
            :disabled="isUploading"
                style="display: none;"
              />
              <ion-icon :icon="videocamOutline" style="font-size: 48px; color: #94a3b8;"></ion-icon>
              <p style="color: #64748b; margin: 12px 0 8px 0; font-weight: 500;">Upload Video 360°</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Klik untuk memilih video (Max 50MB)</p>
            </div>

            <div v-else class="preview-container">
              <video 
                :src="previewVideo" 
                controls 
                style="width: 100%; height: 200px; border-radius: 12px; object-fit: cover;"
              ></video>
              <div class="file-info">
                <ion-chip color="secondary" style="margin: 8px 0;">
                  <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                  <ion-label>{{ videoFile?.name }}</ion-label>
                </ion-chip>
                <p style="color: #64748b; font-size: 12px; margin: 4px 0;">
                  {{ videoFile ? formatFileSize(videoFile.size) : '' }}
                </p>
                <ion-button 
                  fill="clear" 
                  size="small" 
                  @click="removeVideo"
                  :disabled="isUploading"
                  style="--color: #ef4444;"
                >
                  <ion-icon :icon="closeOutline" slot="start"></ion-icon>
                  Hapus
                </ion-button>
              </div>
            </div>
          </ion-cardContent>
        </ion-card>

        <!-- Progress Bar -->
        <div v-if="isUploading" style="margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #64748b; font-size: 14px;">Uploading...</span>
            <span style="color: #3b82f6; font-weight: 600;">{{ Math.round(uploadProgress * 100) }}%</span>
          </div>
      <ion-progress-bar
        :value="uploadProgress"
            :buffer="1"
        color="primary"
            style="--progress-background: linear-gradient(90deg, #3b82f6, #8b5cf6);"
      />
        </div>

        <!-- Submit Button -->
      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="submitBatu"
        :disabled="isUploading"
          style="
            --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --color: #fff;
            --border-radius: 16px;
            height: 56px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 24px;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          "
      >
          <ion-icon :icon="cloudUploadOutline" slot="start"></ion-icon>
          {{ isUploading ? 'Menyimpan...' : 'Simpan Batu' }}
      </ion-button>
      </div>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        duration="3000"
        @didDismiss="showToast = false"
        style="--background: #1e293b; --color: #fff;"
      />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-area:active {
  transform: scale(0.98);
}

.preview-container {
  position: relative;
}

.file-info {
  margin-top: 12px;
  text-align: center;
}

ion-card {
  margin: 0;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 0;
}

ion-input, ion-textarea {
  --padding-start: 0;
  --padding-end: 0;
}

ion-chip {
  --background: #3b82f6;
  --color: #fff;
}

ion-chip[color="secondary"] {
  --background: #8b5cf6;
}
</style>
