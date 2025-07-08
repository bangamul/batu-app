<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style scoped>
.scanner-active::before {
  content: "";
  position: fixed;
  top: 50%; left: 50%;
  width: 200px; height: 200px;
  transform: translate(-50%, -50%);
  border: 3px dashed #00ff88;
  border-radius: 12px;
  z-index: 9999;
  pointer-events: none;
}
</style>