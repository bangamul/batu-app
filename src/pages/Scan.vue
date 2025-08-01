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
      <ion-toolbar style="--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --color: #fff; padding-top: 20px;">
        <ion-buttons slot="start">
          <ion-back-button 
            default-href="/" 
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
        <ion-title style="font-weight: 600; font-size: 18px;">Verifikasi</ion-title>
        <ion-buttons slot="end">
          <div style="width: 40px;"></div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content style="--background: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
      <h2 style="color: #dc2626; margin-bottom: 12px;">❌ QR Tidak Valid</h2>
      <p>Maaf, data yang Anda scan tidak cocok dengan koleksi kami.</p>

      <ion-button 
        expand="block" 
        class="ion-margin-top" 
        style="
          --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --color: #fff;
          --border-radius: 16px;
          height: 56px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        " 
        @click="$router.push('/')"
      >
        Kembali ke Beranda
      </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>