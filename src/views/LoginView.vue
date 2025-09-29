<!-- views/LoginView.vue -->
<template>
  <LoginComponent class="login-component"
    @login-success="handleLoginSuccess"
    @switch-to-register="showRegisterForm"
  />
</template>

<script>
import LoginComponent from '@/components/LoginComponent.vue'

export default {
  name: 'LoginView',
  components: { LoginComponent },
  methods: {
    handleLoginSuccess(userData) {
      console.log('User logged in:', userData)
      localStorage.setItem('user', JSON.stringify(userData))
      this.$router.replace('/home')
    },
    showRegisterForm() {
      // Show registration form
    }
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .login-component {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>