<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import MetricCard from '@/components/MetricCard.vue'

defineOptions({ name: 'HomePage' })
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" style="--background: linear-gradient(to bottom, #f5f3ff, #ede9fe);">
      <div class="date">RABU 25 JUNI</div>
      <h1 style="font-weight: 600;">Batu Koleksi</h1>

      <div class="health-card">
        <p>
          Selamat datang! Aplikasi ini membantu kamu mengelola koleksi batu akik dan permata dengan mudah.
          Bisa scan QR, cek jenis batu, dan simpan detailnya.
        </p>
      </div>

      <h2 class="metrics-title">Menu Utama</h2>
      <div class="metrics-grid">
        <MetricCard
          title="Scan QR"
          value="📷"
          updated="Arahkan ke kode"
          color="blue"
          @click="$router.push('/scan')"
        />
        <MetricCard
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
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.date {
  text-transform: uppercase;
  color: #6366f1;
  font-size: 0.8rem;
}
.health-card {
  background: #ede9fe;
  padding: 1rem;
  border-radius: 1rem;
  margin: 1rem 0;
  font-size: 0.95rem;
  color: #333;
}
.metrics-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.purple-light-bg {
  background: linear-gradient(to bottom, #f5f3ff, #ede9fe);
  min-height: 100%;
}
</style>
