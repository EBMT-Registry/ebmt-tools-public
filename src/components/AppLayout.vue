<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'AppLayout',
  setup() {
    const isDropdownOpen = ref(false)
    const dropdownButton = ref(null)
    const dropdownContainer = ref(null)
    const closeTimeout = ref(null)

    const dropdownStyle = computed(() => {
      if (!dropdownButton.value) return {}
      
      const rect = dropdownButton.value.getBoundingClientRect()
      return {
        top: `${rect.bottom + 4}px`,
        right: `${window.innerWidth - rect.right}px`
      }
    })

    const openDropdown = () => {
      if (closeTimeout.value) {
        clearTimeout(closeTimeout.value)
        closeTimeout.value = null
      }
      isDropdownOpen.value = true
    }

    const closeDropdown = () => {
      closeTimeout.value = setTimeout(() => {
        isDropdownOpen.value = false
        closeTimeout.value = null
      }, 150)
    }

    const keepDropdownOpen = () => {
      if (closeTimeout.value) {
        clearTimeout(closeTimeout.value)
        closeTimeout.value = null
      }
      isDropdownOpen.value = true
    }

    const toggleDropdown = () => {
      if (closeTimeout.value) {
        clearTimeout(closeTimeout.value)
        closeTimeout.value = null
      }
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const handleClickOutside = (event) => {
      if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
        if (closeTimeout.value) {
          clearTimeout(closeTimeout.value)
          closeTimeout.value = null
        }
        isDropdownOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      if (closeTimeout.value) {
        clearTimeout(closeTimeout.value)
      }
    })

    return {
      isDropdownOpen,
      dropdownButton,
      dropdownContainer,
      dropdownStyle,
      openDropdown,
      closeDropdown,
      keepDropdownOpen,
      toggleDropdown
    }
  }
}
</script>

<template>
  <div class="app-layout">
    <header class="bg-dark-blue text-white flex justify-between items-center h-15">
      <RouterLink to="/home">
        <img alt="EBMT logo" class="logo px-4" src="@/assets/logo.png" width="110" height="110" />
      </RouterLink>
      <nav class="flex justify-end items-center h-full px-4">
        <!-- Tools Dropdown -->
        <div class="relative" @mouseleave="closeDropdown" ref="dropdownContainer">
          <button 
            @mouseenter="openDropdown"
            @click="toggleDropdown"
            class="px-4 py-2 transition-colors duration-200 flex items-center font-bold"
            ref="dropdownButton"
          >
            Tools
            <svg 
              class="ml-1 w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        <RouterLink to="/about" class="p-4 transition-colors duration-200 font-bold">
          About
        </RouterLink>
        <div class="px-4">
          <img src="@/assets/anonymous_user.jpg" alt="profile photo" class="rounded-full w-10 h-10 object-cover" style="cursor: pointer;"/>
        </div>
      </nav>
    </header>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <div 
        v-if="isDropdownOpen"
        class="fixed bg-white text-gray-800 rounded-md shadow-lg z-50 w-48"
        :style="dropdownStyle"
        @mouseleave="closeDropdown"
        @mouseenter="keepDropdownOpen"
      >
        <RouterLink 
          to="/hladoc" 
          class="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          @click="closeDropdown"
        >
          HLA Document Processor
        </RouterLink>
        <RouterLink 
          to="/hlacalc" 
          class="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          @click="closeDropdown"
        >
          HLA Missmatch Calculator
        </RouterLink>
        <RouterLink 
          to="/pivot" 
          class="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          @click="closeDropdown"
        >
          Pivot Tool
        </RouterLink>
      </div>
    </Teleport>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="bg-dark-blue text-white text-center py-4">
      <p>&copy; 2025 EBMT. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  line-height: 0.2;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>