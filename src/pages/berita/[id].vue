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
      <ion-toolbar style="--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button 
            default-href="/berita" 
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
        <ion-title v-if="selected" style="font-weight: 600; font-size: 18px;">{{ selected.title }}</ion-title>
        <ion-buttons slot="end">
          <div style="width: 40px;"></div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f8fafc;">
      <div style="max-width: 600px; margin: 24px auto 0; padding: 0 16px;">
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
      </div>
    </ion-content>
  </ion-page>
</template>
