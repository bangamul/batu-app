<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
// import MetricCard from '@/components/MetricCard.vue'
import { BadgeCheck, Gem, Group, PackagePlus } from 'lucide-vue-next'

defineOptions({ name: 'HomePage' })

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const today = new Date()
const currentDate = ref(
  `${days[today.getDay()]}, ${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`
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
</style>
