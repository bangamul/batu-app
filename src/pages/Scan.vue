<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonTextarea, IonButton, IonLabel, IonItem,
  IonList, IonToast, IonImg, IonBackButton, IonButtons, IonProgressBar
} from '@ionic/vue'

defineOptions({ name: 'ScanPage' })
</script>
<template>
    <ion-page>
        <ion-header>
          <ion-toolbar color="primary">
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