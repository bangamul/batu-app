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
      videoRef.value.play().catch(err => {
        console.warn('Autoplay failed:', err)
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
      <ion-toolbar style="--background: #6366f1; --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button default-href="/daftarbatu" />
        </ion-buttons>
        <ion-title>Detail Batu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>

      <ion-card v-else>
        <!-- Swiper Carousel with Zoom -->
        <Swiper
          :modules="[Pagination, Zoom]"
          :pagination="{ clickable: true }"
          :zoom="true"
          :spaceBetween="10"
          style="height: 300px;"
          @swiper="onSwiper"
        >
          <!-- Gambar dengan Zoom -->
          <SwiperSlide>
            <div
              class="swiper-zoom-container"
              style="display: flex; justify-content: center; align-items: center; height: 100%; overflow: hidden;"
            >
              <img
                :src="`https://perspektiv.my.id/${batu.foto}`"
                style="height: 100%; width: auto; object-fit: contain;"
              />
            </div>
          </SwiperSlide>

          <!-- Video (tidak di-zoom) -->
          <SwiperSlide v-if="batu.video360">
            <div
              style="display: flex; justify-content: center; align-items: center; height: 100%; overflow: hidden;"
            >
              <video
                ref="videoRef"
                muted
                playsinline
                controls
                style="height: 100%; width: auto; border-radius: 12px;"
              >
                <source :src="`https://perspektiv.my.id/${batu.video360}`" type="video/mp4" />
                Browser lo tidak mendukung video.
              </video>
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Info -->
        <ion-card-header>
          <ion-card-title>{{ batu.nama }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Jenis:</strong> {{ batu.jenis }}</p>
          <p><strong>Asal:</strong> {{ batu.asal }}</p>
          <div v-html="batu.deskripsi" style="margin-top: 0.5rem;" />
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
