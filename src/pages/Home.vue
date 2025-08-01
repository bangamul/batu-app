<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/vue'
import { 
  BadgeCheck, 
  Gem, 
  Group, 
  PackagePlus,
  Calendar,
  ArrowRight,
  Newspaper
} from 'lucide-vue-next'
import SkeletonNewsCard from '@/components/SkeletonNewsCard.vue'
import { useQrScanner } from '@/composables/useQrScanner'

const { startScan } = useQrScanner()

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
    <ion-header>
      <ion-toolbar style="--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --color: #fff; padding-top: 20px;">
        <ion-title style="font-weight: 600; font-size: 18px;">
          <Gem style="width: 24px; height: 24px; margin-right: 8px; display: inline-block; vertical-align: middle;" />
          Batu Koleksi
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f8fafc;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
        <!-- Date Header -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 16px;">
            <div class="date-header">
              <Calendar style="width: 20px; height: 20px; color: #6366f1;" />
              <span class="date-text">{{ currentDate }}</span>
            </div>
            <h1 class="main-title">Selamat Datang! 👋</h1>
            <p class="greeting">
              Aplikasi ini membantu kamu mengelola koleksi batu akik dan permata dengan mudah dan aman
            </p>
          </ion-cardContent>
        </ion-card>

        <!-- Health Card -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 20px;">
      <div class="health-card">
              <div class="health-icon">
                <Gem style="width: 48px; height: 48px; color: #fbbf24;" />
              </div>
              <div class="health-content">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-weight: 600;">Cek Jenis Batu</h3>
                <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
            Ingin tahu jenis batu kamu? Klik tombol di bawah untuk cek sekarang.
          </p>
                <ion-button
                  fill="solid"
                  size="small"
                  @click="$router.push('/cek')"
                  style="
                    --background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    --color: #1e293b;
                    --border-radius: 12px;
                    font-weight: 600;
                    height: 40px;
                  "
                >
                  Cek Sekarang
                  <ArrowRight style="width: 16px; height: 16px; margin-left: 8px;" />
                </ion-button>
        </div>
      </div>
          </ion-cardContent>
        </ion-card>

        <!-- Menu Grid -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 20px;">
            <h2 class="section-title">
              <PackagePlus style="width: 20px; height: 20px; margin-right: 8px; color: #6366f1;" />
              Menu Utama
            </h2>
            <div class="menu-grid">
              <div class="menu-item" @click="$router.push('/admin')">
                <div class="menu-icon addnew">
                  <PackagePlus style="width: 32px; height: 32px;" />
          </div>
                <p class="menu-label">Tambah Data</p>
        </div>
              <div class="menu-item" @click="$router.push('/daftarbatu')">
                <div class="menu-icon collection">
                  <Group style="width: 32px; height: 32px;" />
          </div>
                <p class="menu-label">Koleksi</p>
        </div>
              <div class="menu-item" @click="startScan">
                <div class="menu-icon verification">
                  <BadgeCheck style="width: 32px; height: 32px;" />
          </div>
                <p class="menu-label">Verifikasi</p>
        </div>
      </div>
          </ion-cardContent>
        </ion-card>

        <!-- Banner Slider -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0; overflow: hidden;">
          <ion-cardContent style="padding: 0;">
          <Swiper
            :modules="[Autoplay, Pagination]"
              :spaceBetween="0"
            :slidesPerView="1"
            :loop="true"
            :autoplay="{ delay: 5000 }"
            :pagination="{ clickable: true }"
              style="height: 200px;"
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
                  style="width: 100%; height: 200px; object-fit: cover;"
              />
            </SwiperSlide>
          </Swiper>
          </ion-cardContent>
        </ion-card>

        <!-- News Section -->
        <ion-card style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">
          <ion-cardContent style="padding: 20px;">
            <h2 class="section-title">
              <Newspaper style="width: 20px; height: 20px; margin-right: 8px; color: #6366f1;" />
              Berita Terbaru
            </h2>
            
        <div v-if="loading">
          <SkeletonNewsCard v-for="n in 3" :key="n" />
        </div>
        <div v-else>
          <div v-if="newsList.length === 0">
                <div class="empty-state">
                  <Newspaper style="width: 48px; height: 48px; color: #94a3b8; margin-bottom: 16px;" />
                  <p style="color: #64748b; margin: 0; font-size: 14px;">Belum ada berita tersedia.</p>
                </div>
          </div>
          <div v-else class="news-section">
            <div
              class="news-card"
              v-for="(news, i) in newsList"
              :key="i"
              @click="openLink(news.link)"
            >
              <img :src="news.image" alt="news" class="news-image" />
                  <div class="news-content">
                    <h4 class="news-title">{{ news.title }}</h4>
                    <div class="news-meta">
                      <span class="news-date">Berita Terbaru</span>
                    </div>
              </div>
            </div>
                
              <ion-button
                expand="block"
                fill="clear"
                size="small"
                  @click="$router.push('/berita')"
                style="
                    --color: #6366f1;
                  font-weight: 600;
                    margin-top: 16px;
                    --border-radius: 12px;
                    height: 44px;
                "
              >
                  Lihat Semua Berita
                  <ArrowRight style="width: 16px; height: 16px; margin-left: 8px;" />
              </ion-button>
            </div>
          </div>
          </ion-cardContent>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.date-text {
  color: #6366f1;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
}

.main-title {
  font-weight: 700;
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #1e293b;
}

.greeting {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.health-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.health-icon {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 12px;
  border-radius: 12px;
  flex-shrink: 0;
}

.health-content {
  flex: 1;
}

.section-title {
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 20px 0;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.menu-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.menu-item:hover {
  transform: translateY(-2px);
}

.menu-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.menu-icon.addnew {
  background: linear-gradient(135deg, #fc9eff, #fd5ffc);
}

.menu-icon.collection {
  background: linear-gradient(135deg, #fdca9c, #ffa639);
}

.menu-icon.verification {
  background: linear-gradient(135deg, #2dc653, #38b000);
}

.menu-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  text-transform: capitalize;
}

.news-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-card {
  display: flex;
  gap: 16px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #cbd5e1;
}

.news-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.news-date {
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 6px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

/* Swiper Customization */
::v-deep(.swiper-pagination) {
  position: absolute !important;
  bottom: 16px !important;
  left: 50% !important;
  transform: translateX(-50%);
  z-index: 10;
}

::v-deep(.swiper-pagination-bullet) {
  width: 24px;
  height: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 1;
  margin: 0 4px;
  transition: all 0.3s ease;
}

::v-deep(.swiper-pagination-bullet-active) {
  background-color: #fff !important;
  width: 32px;
}

/* Responsive */
@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .menu-grid {
    gap: 12px;
  }
  
  .menu-icon {
    width: 56px;
    height: 56px;
  }
  
  .news-card {
    padding: 12px;
  }
  
  .news-image {
    width: 70px;
    height: 70px;
  }
}
</style>
