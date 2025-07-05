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
      <ion-toolbar style="--background: #6366f1; --color: #fff;">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Daftar Batu Koleksi</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
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
  border-radius: 12px;
  overflow: hidden;
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
