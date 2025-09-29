<template>
  <div class="home h-full">  
    <div class="flex flex-col items-center justify-center">
      <p class="text-center text-4xl font-bold mb-4">Welcome to EBMTools</p>
      <p class="text-center text-xl">Saving lives since 1974.</p>
      <p class="text-center text-gray-500">This is a demo application for EBMT Tools.</p>
    </div>
    <div class="flex flex-col items-center justify-center">
      <TheTools />
    </div>
  </div>
</template>

<script>
import TheTools from '@/components/TheTools.vue';

export default {
  name: 'Home',
  components: {
    TheTools
  }
}
</script>

<style scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
}
</style>