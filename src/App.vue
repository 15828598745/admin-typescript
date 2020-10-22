<template>
  <div id="app">
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ServiceWorkerUpdatePopup from "@/pwa/components/ServiceWorkerUpdatePopup.vue";
import axios from "axios";
import { AppModule } from "./store/modules/app";

@Component({
  name: "App",
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {}
</script>
