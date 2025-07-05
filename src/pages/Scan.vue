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
          <ion-toolbar style="--background: #6366f1; --color: #fff;">
            <ion-buttons slot="start">
            <ion-back-button default-href="/" />
            </ion-buttons>
            <ion-title>Tambah Koleksi Batu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
            <div>
                 <p>tes</p>
            </div>
        </ion-content>
    </ion-page>
</template>