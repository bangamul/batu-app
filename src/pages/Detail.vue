<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonBackButton, IonButtons
} from '@ionic/vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/zoom'

defineOptions({ name: 'DetailPage' })

const route = useRoute()
const id = route.params.id as string

const batu = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const handleSlideChange = (swiper: any) => {
  const isVideoSlide = swiper.realIndex === 1
  if (videoRef.value) {
    if (isVideoSlide) {
      videoRef.value.currentTime = 0
      videoRef.value.muted = true
      videoRef.value.play().catch((err) => {
        console.warn('Autoplay gagal:', err)
      })
    } else {
      videoRef.value.pause()
      videoRef.value.currentTime = 0
    }
  }
}

const onSwiper = (swiper: any) => {
  swiper.on('slideChange', () => {
    nextTick(() => {
      handleSlideChange(swiper)
    })
  })
}

onMounted(async () => {
  try {
    const res = await fetch(`https://perspektiv.my.id/batu/api/detail_batu.php?id=${id}`)
    if (!res.ok) throw new Error('Data tidak ditemukan')
    batu.value = await res.json()
  } catch (e) {
    error.value = 'Gagal mengambil data.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button 
            default-href="/daftarbatu" 
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
        <ion-title style="font-weight: 600; font-size: 18px;">Detail Batu</ion-title>
        <ion-buttons slot="end">
          <div style="width: 40px;"></div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>

      <ion-card v-else style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
        <Swiper
          :modules="[Pagination, Zoom]"
          :pagination="{ clickable: true }"
          :zoom="true"
          :spaceBetween="10"
          style="height: 300px;"
          @swiper="onSwiper"
        >
          <SwiperSlide>
            <div class="swiper-zoom-container" style="display: flex; justify-content: center; align-items: center; height: 100%;">
              <img :src="`https://perspektiv.my.id/${batu.foto}`" style="height: 100%; width: auto; object-fit: contain;" />
            </div>
          </SwiperSlide>

          <SwiperSlide v-if="batu.video360">
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
              <video
                ref="videoRef"
                muted
                playsinline
                controls
                style="height: 100%; width: auto; border-radius: 12px;"
              >
                <source :src="`https://perspektiv.my.id/${batu.video360}`" type="video/mp4" />
                Browser tidak mendukung video.
              </video>
            </div>
          </SwiperSlide>
        </Swiper>

        <ion-card-header>
          <ion-card-title>{{ batu.nama }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Jenis:</strong> {{ batu.jenis }}</p>
          <p><strong>Asal:</strong> {{ batu.asal }}</p>
          <div v-html="batu.deskripsi" style="margin-top: 0.5rem;" />
        </ion-card-content>
      </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>
