<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import {
  IonPage, IonContent, IonHeader, IonToolbar,
  IonButtons, IonBackButton, IonTitle,
  IonDatetime, IonModal, IonButton
} from '@ionic/vue'
import SkeletonNewsCard from '@/components/SkeletonNewsCard.vue'

defineOptions({ name: 'BeritaPage' })

interface Berita {
  id: number
  title: string
  content: string
  image: string
  date: string // format YYYY-MM-DD
}

const beritaList = ref<Berita[]>([])
const loading = ref(true)
const currentPage = ref(1)
const perPage = 10

// Filter bulan
const selectedMonth = ref('')
const tempMonth = ref(new Date().toISOString().slice(0, 7)) // YYYY-MM
const showMonthModal = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('https://perspektiv.my.id/batu/api/berita.php')
    const data = await res.json()
    beritaList.value = data
  } catch (err) {
    console.error('Gagal ambil data:', err)
  } finally {
    loading.value = false
  }
})

const filteredBeritaList = computed(() => {
  if (!selectedMonth.value) return beritaList.value
  return beritaList.value.filter(item =>
    item.date.startsWith(selectedMonth.value)
  )
})

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredBeritaList.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.ceil(filteredBeritaList.value.length / perPage)
)

watch(selectedMonth, () => {
  currentPage.value = 1
})

// Modal & Filter Bulan
const openModal = () => {
  tempMonth.value = selectedMonth.value || new Date().toISOString().slice(0, 7)
  showMonthModal.value = true
}

const onMonthChange = (e: CustomEvent) => {
  const val = String(e.detail.value || '')
  if (/^\d{4}-\d{2}$/.test(val)) {
    tempMonth.value = val
  }
}

const applyFilter = () => {
  selectedMonth.value = tempMonth.value
  showMonthModal.value = false
}

const resetFilter = () => {
  selectedMonth.value = ''
  tempMonth.value = new Date().toISOString().slice(0, 7)
  showMonthModal.value = false
}

// Navigasi
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const openLink = (id: number) => {
  window.location.href = `/berita/${id}`
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #6366f1; --color: #fff;">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Berita</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1 class="page-title">Berita Terbaru</h1>

      <!-- Filter -->
      <ion-button size="small" fill="outline" @click="openModal">
        📅 Filter Bulan
      </ion-button>

      <p v-if="selectedMonth" style="margin-top: 8px; font-size: 14px; color: #666;">
        Filter bulan: <strong>{{ selectedMonth }}</strong>
      </p>

      <!-- Modal Bulan -->
      <ion-modal :is-open="showMonthModal" @didDismiss="showMonthModal = false">
        <div class="modal-content">
          <p style="font-weight: bold;">Pilih Bulan</p>

          <ion-datetime
            presentation="month-year"
            :value="tempMonth"
            @ionChange="onMonthChange"
            :firstDayOfWeek="1"
            :preferWheel="false"
            style="width: 100%;"
          />

          <div class="modal-buttons">
            <ion-button @click="resetFilter" fill="outline" color="medium">Reset</ion-button>
            <ion-button @click="showMonthModal = false" fill="outline" color="danger">Cancel</ion-button>
            <ion-button @click="applyFilter" color="primary">OK</ion-button>
          </div>
        </div>
      </ion-modal>

      <div v-if="loading">
        <SkeletonNewsCard v-for="i in 5" :key="i" />
      </div>

      <div v-else>
        <div v-if="filteredBeritaList.length === 0">
          <p class="empty">Berita tidak tersedia untuk bulan ini.</p>
        </div>

        <div v-else class="news-section">
          <div
            v-for="(item, i) in paginatedNews"
            :key="i"
            class="news-card"
            @click="openLink(item.id)"
          >
            <img :src="item.image" alt="news" class="news-image" />
            <div class="news-text">
              <p>{{ item.title }}</p>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="pagination-controls">
          <ion-button size="small" fill="outline" @click="prevPage" :disabled="currentPage === 1">
            ‹
          </ion-button>
          <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <ion-button size="small" fill="outline" @click="nextPage" :disabled="currentPage === totalPages">
            ›
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 32px;
}
.news-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1rem;
}
.news-card {
  display: flex;
  gap: 12px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.news-card:hover {
  transform: scale(1.01);
}
.news-image {
  width: 96px;
  height: 72px;
  object-fit: cover;
  flex-shrink: 0;
}
.news-text {
  flex: 1;
  display: flex;
  align-items: center;
  padding-right: 12px;
}
.news-text p {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  font-size: 14px;
  color: #333;
}
.modal-content {
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>
