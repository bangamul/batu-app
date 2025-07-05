<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IonPage, IonContent, IonButton } from '@ionic/vue'
// import MetricCard from '@/components/MetricCard.vue'
import { BadgeCheck, Gem, Group, PackagePlus } from 'lucide-vue-next'
import SkeletonNewsCard from '@/components/SkeletonNewsCard.vue'
// import berita from '@/data/mock/berita'

interface Beritas {
  id: number
  title: string
  content: string
  image: string
  date: string
}

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

import { Autoplay, Pagination } from 'swiper/modules'

const banners = [
  {
    image: 'https://perspektiv.my.id/batu/img/dummy.png',
    link: '/detail/1'
  },
  {
    image: 'https://perspektiv.my.id/batu/img/dummy.png',
    link: 'https://tokopedia.com/toko-akik'
  },
  {
    image: 'https://perspektiv.my.id/batu/img/dummy.png',
    link: '/detail/2'
  },
  {
    image: 'https://perspektiv.my.id/batu/img/dummy.png',
    link: '/detail/3'
  },
  {
    image: 'https://perspektiv.my.id/batu/img/dummy.png',
    link: '/detail/1'
  },
]

const getLoopedBanners = computed(() => {
  const raw = [...banners]
  while (raw.length < 5) {
    raw.push(...banners)
  }
  return raw.slice(0, 5) // jaga performa
})

const openLink = (url: string) => {
  if (url.startsWith('http')) {
    window.open(url, '_blank')
  } else {
    window.location.href = url
  }
}

defineOptions({ name: 'HomePage' })

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const today = new Date()
const currentDate = ref(
  `${days[today.getDay()]}, ${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`
)

const beritaList = ref<Beritas[]>([])

const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('https://perspektiv.my.id/batu/api/berita.php')
    const data = await res.json()
    beritaList.value = data
  } catch (err) {
    console.error('Gagal ambil data berita:', err)
  } finally {
    loading.value = false
  }
})

const newsList = computed(() =>
  beritaList.value
    .slice(0, 5) // limit 5
    .map((item) => ({
      image: item.image,
      title: item.title,
      link: `/berita/${item.id}`,
    }))
)
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" style="--background: linear-gradient(to bottom, #f5f3ff, #ede9fe);">
      <div class="date">{{ currentDate }}</div>
      <h1 style="font-weight: 600; margin-bottom: 4px;">Batu Koleksi</h1>
      <p class="greeting">Selamat datang! Aplikasi ini membantu kamu mengelola koleksi batu akik dan permata dengan mudah</p>

      <div class="health-card">
        <Gem class="icon" />
        <div class="text">
          <p>
            Ingin tahu jenis batu kamu? Klik tombol di bawah untuk cek sekarang.
          </p>
          <button class="check-button" @click="$router.push('/cek')">
            Cek Jenis Batu
          </button>
        </div>
      </div>

      <h2 class="metrics-title">Menu Utama</h2>
      <div class="metrics-grid">
        <div>
          <div class="addnew" @click="$router.push('/admin')">
            <PackagePlus class="menu-icon" />
          </div>
          <p>tambah data</p>
        </div>
        <div>
          <div class="collection" @click="$router.push('/daftarbatu')">
            <Group class="menu-icon" />
          </div>
          <p>Koleksi</p>
        </div>
        <div>
          <div class="verification" @click="$router.push('/scan')">
            <BadgeCheck class="menu-icon" />
          </div>
          <p>Verifikasi</p>
        </div>
        <!-- <MetricCard
          title="Scan QR"
          value="📷"
          updated="Arahkan ke kode"
          color="blue"
          @click="$router.push('/scan')"
        /> -->
        <!-- <MetricCard
          title="Cek Jenis Batu"
          value="🔍"
          updated="Upload foto"
          color="purple"
          @click="$router.push('/cek')"
        />
        <MetricCard
          title="Tambah Koleksi Batu"
          value="➕"
          updated="Masukkan data"
          color="purple-light"
          @click="$router.push('/admin')"
        />
        <MetricCard
          title="Daftar Batu Guw"
          value="💎"
          updated="Lihat Katalog"
          color="dark"
          @click="$router.push('/daftarbatu')"
        /> -->
      </div>

      <div style="margin: 24px 0px;">
        <div>
          <Swiper
            :modules="[Autoplay, Pagination]"
            :spaceBetween="10"
            :slidesPerView="1"
            :loop="true"
            :autoplay="{ delay: 5000 }"
            :pagination="{ clickable: true }"
          >
            <SwiperSlide
              v-for="(banner, index) in getLoopedBanners"
              :key="index"
              @click="openLink(banner.link)"
              style="cursor: pointer;"
            >
              <img
                :src="banner.image"
                alt="Banner"
                style="width: 100%; height: 160px; object-fit: cover;"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 class="metrics-title">Berita Terbaru</h2>
        <div v-if="loading">
          <SkeletonNewsCard v-for="n in 3" :key="n" />
        </div>
        <div v-else>
          <div v-if="newsList.length === 0">
            <p style="color: #999;">Belum ada berita.</p>
          </div>
          <div v-else class="news-section">
            <div
              class="news-card"
              v-for="(news, i) in newsList"
              :key="i"
              @click="openLink(news.link)"
            >
              <img :src="news.image" alt="news" class="news-image" />
              <div class="news-text">
                <p>{{ news.title }}</p>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <ion-button
                expand="block"
                fill="clear"
                size="small"
                style="
                  background-color: #6366f1 !important;
                  color: #fff;
                  font-weight: 600;
                  border-radius: 6px;
                  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                  padding: 8px;
                "
                @click="$router.push('/berita')"
              >
                Lihat Semua Berita →
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.metrics-grid p {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;
  margin: 8px 0px 0px 0px;
}
.menu-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
}
.addnew {
  padding: 4px;
  color: #fff;
  background: linear-gradient(135deg, #fc9eff, #fd5ffc);
  padding: 1rem;
  justify-items: center;
  vertical-align: middle;
  align-items: center;
  text-align: center;
  border-radius: 8px;
}
.collection {
  padding: 4px;
  color: #fff;
  background: linear-gradient(135deg, #fdca9c, #ffa639);
  padding: 1rem;
  justify-items: center;
  vertical-align: middle;
  align-items: center;
  text-align: center;
  border-radius: 8px;
}
.verification {
  padding: 4px;
  color: #fff;
  background: linear-gradient(135deg, #2dc653, #38b000);
  padding: 1rem;
  justify-items: center;
  vertical-align: middle;
  align-items: center;
  text-align: center;
  border-radius: 8px;
}
.date {
  text-transform: uppercase;
  color: #6366f1;
  font-size: 0.8rem;
}
p.greeting {
  color: #454545;
  font-size: 12px;
  line-height: 150%;
  margin-top: 0px;
}
.health-card {
  display: flex;
  align-items: center; /* icon dan text sama tinggi tengah */
  gap: 1rem;
  background: linear-gradient(135deg, #9d7afb, #7846ff);
  padding: 1rem;
  border-radius: 1rem;
  margin: 1rem 0;
  color: white;
  font-size: 0.95rem;
}
.health-card .icon {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
}
.health-card .text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.health-card .check-button {
  margin-top: 0.5rem;
  background-color: #facc15;
  color: #333;
  font-weight: 600;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.2s ease;
}
.health-card .check-button:hover {
  background-color: #eab308;
}
.health-card .text p {
  margin: 0px !important;
  padding: 0px !important;
  font-size: 14px;
}
.metrics-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.purple-light-bg {
  background: linear-gradient(to bottom, #f5f3ff, #ede9fe);
  min-height: 100%;
}
::v-deep(.swiper-pagination) {
  position: static !important;
  margin-top: 12px;
  text-align: center;
}

::v-deep(.swiper-pagination-bullet) {
  width: 20px;
  height: 6px;
  border-radius: 4px;
  background-color: #D1D5DB;
  opacity: 1;
  margin: 0 4px;
  display: inline-block;
}

::v-deep(.swiper-pagination-bullet-active) {
  background-color: #4B5563 !important;
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
/* Skeleton effect */
.skeleton {
  pointer-events: none;
  opacity: 0.6;
}
.skeleton-box {
  background: linear-gradient(-90deg, #eee, #f5f5f5, #eee);
  background-size: 400% 400%;
  animation: shimmer 1.2s ease-in-out infinite;
  border-radius: 4px;
}
.skeleton-line {
  height: 14px;
  width: 100%;
  background: linear-gradient(-90deg, #eee, #f5f5f5, #eee);
  background-size: 400% 400%;
  animation: shimmer 1.2s ease-in-out infinite;
  border-radius: 4px;
  margin-top: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
