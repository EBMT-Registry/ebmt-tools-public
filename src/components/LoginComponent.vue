<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Welcome to EBMTools</h2>
        <p>Please sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :class="{ error: errors.email }"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              :class="{ error: errors.password }"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <div v-if="loginError" class="login-error">
          {{ loginError }}
        </div>
      </form>

      <div class="login-footer">
        <p>Don't have an account? <a href="#" @click="$emit('switch-to-register')">Sign up</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  emits: ['login-success', 'switch-to-register'],
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {
        email: '',
        password: ''
      },
      showPassword: false,
      isLoading: false,
      loginError: ''
    }
  },
  computed: {
    isFormValid() {
      return this.form.email && 
             this.form.password && 
             !this.errors.email && 
             !this.errors.password
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
      } else {
        this.errors.email = ''
      }
    },
    validatePassword() {
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      } else {
        this.errors.password = ''
      }
    },
    async handleLogin() {
      // Validate form before submission
      this.validateEmail()
      this.validatePassword()
      
      if (!this.isFormValid) {
        return
      }

      this.isLoading = true
      this.loginError = ''

      try {
        // Simulate API call - replace with your actual login logic
        await this.simulateLogin()
        
        // Emit success event with user data
        this.$emit('login-success', {
          email: this.form.email,
          rememberMe: this.form.rememberMe
        })
        
        // Reset form
        this.resetForm()
        
        // Redirect to home page after successful login
        console.log('Redirecting to home page...')
        await this.$nextTick()
        this.$router.replace({ name: 'home' })
        console.log('Navigation initiated to home')
        
      } catch (error) {
        this.loginError = error.message || 'Login failed. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
    async simulateLogin() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate login validation (replace with actual API call)
      if (this.form.email === 'igor.ariz@ebmt.org' && this.form.password === 'password123') {
        return { success: true }
      } else {
        throw new Error('Invalid email or password')
      }
    },
    resetForm() {
      this.form = {
        email: '',
        password: '',
        rememberMe: false
      }
      this.errors = {
        email: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #2C99B6 0%, #2A4E95 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #e74c3c;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-container input {
  margin-right: 8px;
}

.forgot-password {
  color: #2C99B6;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #2C99B6 0%, #2A4E95 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-error {
  background: #ffeaea;
  color: #e74c3c;
  padding: 12px;
  border-radius: 6px;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-footer a {
  color: #2C99B6;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>