<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton
} from '@ionic/vue'

interface Beritas {
  id: number
  title: string
  content: string
  image: string
  date: string
}

const route = useRoute()
const beritaId = parseInt(route.params.id as string)

const selected = ref<Beritas | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`https://perspektiv.my.id/batu/api/detail_berita.php?id=${beritaId}`)
    const data = await res.json()

    if (data && data.id) {
      selected.value = data
    } else {
      selected.value = null
    }
  } catch (err) {
    console.error('Gagal ambil detail berita:', err)
    selected.value = null
  } finally {
    loading.value = false
  }
})

defineOptions({ name: 'DetailBeritaPage' })
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #6366f1; --color: #fff;">
        <ion-buttons slot="start">
          <ion-back-button default-href="/berita" />
        </ion-buttons>
        <ion-title v-if="selected">{{ selected.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading">
        <p>Loading berita...</p>
      </div>

      <div v-else-if="selected">
        <img
          :src="selected.image"
          alt=""
          style="width: 100%; border-radius: 12px; margin-bottom: 12px;"
        />
        <h1 style="font-weight: bold; font-size: 1.4rem;">
          {{ selected.title }}
        </h1>
        <p style="color: gray; font-size: 0.9rem; margin-bottom: 1rem;">
          {{ selected.date }}
        </p>
        <div style="line-height: 1.6;" v-html="selected.content" />
      </div>

      <div v-else>
        <p>Berita tidak ditemukan.</p>
      </div>
    </ion-content>
  </ion-page>
</template>
