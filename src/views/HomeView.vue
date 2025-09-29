<script>
import Home from '@/components/Home.vue'

export default {
  name: 'HomeView',
  components: {
    Home
  },
  mounted() {
    console.log('Home View component mounted!')
  }
}
</script>

<template>
  <Home />
</template>

<style scoped>
/* Add any home-specific styles here */
</style>
