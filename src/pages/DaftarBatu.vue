<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonLabel,
  IonButtons,
  IonBackButton
} from '@ionic/vue'

defineOptions({ name: 'DaftarBatuPage' })

const daftarBatu = ref<any[]>([])
const router = useRouter()

const fetchData = async () => {
  try {
    const res = await fetch('https://perspektiv.my.id/batu/api/list_batu.php')
    const json = await res.json()
    daftarBatu.value = json
  } catch (err) {
    console.error('❌ Gagal fetch data batu:', err)
  }
}

const lihatDetail = (id: string) => {
  router.push(`/detail/${id}`)
}

onMounted(fetchData)
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
        <ion-title style="font-weight: 600; font-size: 18px;">Daftar Batu Koleksi</ion-title>
        <ion-buttons slot="end">
          <div style="width: 40px;"></div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f8fafc;">
      <div style="max-width: 600px; margin: 24px auto 0; padding: 0 16px;">
      <div class="batu-grid">
        <ion-card
          v-for="batu in daftarBatu"
          :key="batu.id"
          class="batu-card"
          @click="lihatDetail(batu.id)"
          button
        >
          <ion-img :src="`https://perspektiv.my.id/${batu.foto}`" />

          <ion-card-header>
            <ion-card-title>{{ batu.nama }}</ion-card-title>
            <ion-label color="medium">Jenis: {{ batu.jenis }}</ion-label>
          </ion-card-header>

          <ion-card-content>
            <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"><strong>Asal:</strong> {{ batu.asal }}</p>
          </ion-card-content>
        </ion-card>
      </div>

      <div v-if="!daftarBatu.length" class="kosong">
        <ion-label>Belum ada data batu.</ion-label>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.batu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.batu-card {
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.batu-card:hover {
  transform: translateY(-2px);
}
ion-img {
  height: 140px;
  object-fit: cover;
}
.kosong {
  margin-top: 2rem;
  text-align: center;
  color: #666;
}
ion-card {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  --inner-padding-start: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  padding: 0 !important;
  margin: 0;
}

ion-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
