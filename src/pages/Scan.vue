<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonBackButton, IonButtons
} from '@ionic/vue'

defineOptions({ name: 'ScanPage' })

</script>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #6366f1; --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Verifikasi</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2 style="color: #dc2626; margin-bottom: 12px;">❌ QR Tidak Valid</h2>
      <p>Maaf, data yang Anda scan tidak cocok dengan koleksi kami.</p>

      <ion-button expand="block" class="ion-margin-top" style="--background: #6366f1; --color: #fff;" @click="$router.push('/')">
        Kembali ke Beranda
      </ion-button>
    </ion-content>
  </ion-page>
</template>