import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => {
        console.log('Loading AppLayout for home')
        return import('@/components/AppLayout.vue')
      },
      children: [
        {
          path: '',
          name: 'home-content', // Give it a name for explicit navigation
          component: () => {
            console.log('Loading HomeView component')
            return import('../views/HomeView.vue')
          }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/components/AppLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
    {
      path: '/pivot',
      name: 'pivot',
      component: () => import('@/components/AppLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/PivotToolView.vue')
        }
      ]
    },
    {
      path: '/hladoc',
      name: 'hladoc',
      component: () => import('@/components/AppLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/HLADocumentProcessorView.vue')
        }
      ]
    },
    {
      path: '/hlacalc',
      name: 'hlacalc',
      component: () => import('@/components/AppLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/HLAMissmatchCalculatorView.vue')
        }
      ]
    }
  ]
})

// Add a beforeEach guard to handle the nested route issue
router.beforeEach(async (to, from, next) => {
  console.log(`Navigating from ${from.path} to ${to.path}`)
  
  // Special handling for programmatic navigation to nested routes
  if (to.path === '/home' && from.path === '/login') {
    console.log('Special handling for login -> home navigation')
    // Force resolution of nested route
    next()
    await router.isReady()
    // Trigger a re-render by navigating to the named child route
    setTimeout(() => {
      if (router.currentRoute.value.matched.length === 1) {
        console.log('Forcing child route resolution')
        router.replace({ name: 'home-content' })
      }
    }, 100)
  } else {
    next()
  }
})

router.afterEach((to) => {
  console.log(`Navigation completed to: ${to.path}`)
  console.log(`Matched routes:`, to.matched)
  console.log(`Number of matched routes: ${to.matched.length}`)
})

export default router