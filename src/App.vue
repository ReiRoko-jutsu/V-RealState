<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isDark = ref(false)
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const isListingModalOpen = ref(false)

// --- DARK MODE LOGIC ---
const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('avelune-theme', isDark.value ? 'dark' : 'light')
}

watch(isDark, (val) => {
  if (val) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}, { immediate: true })

// --- SCROLL LOGIC ---
const handleScroll = () => { isScrolled.value = window.scrollY > 50 }

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const savedTheme = localStorage.getItem('avelune-theme')
  isDark.value = savedTheme === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !savedTheme)
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Properties', path: '/properties' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
]
</script>

<template>
  <div class="min-h-screen transition-colors duration-500 bg-white dark:bg-slate-950 selection:bg-emerald-500/30">
    
    <nav 
      :class="[isScrolled ? 'py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-100 dark:border-slate-800' : 'py-8 bg-transparent']"
      class="fixed top-0 w-full z-50 transition-all duration-500 px-6 lg:px-12"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <RouterLink to="/" class="group flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-emerald-500/20">A</div>
          <span class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">V-Realstate</span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-10">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="link.path"
            class="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            active-class="!text-emerald-600"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <button @click="isListingModalOpen = true" class="hidden md:block px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all active:scale-95">
            List Property
          </button>

          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-slate-900 dark:text-white z-[60]">
            <span class="text-2xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>
    </nav>

    <transition name="mobile-slide">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-[55] md:hidden">
        <div @click="mobileMenuOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
        <div class="absolute right-0 top-0 h-full w-[80%] bg-white dark:bg-slate-900 shadow-2xl p-10 pt-32 flex flex-col gap-8 transition-colors">
          <RouterLink 
            v-for="link in navLinks" 
            :key="link.name" 
            :to="link.path" 
            @click="mobileMenuOpen = false"
            class="text-4xl font-light text-slate-900 dark:text-white"
            active-class="!text-emerald-600 font-bold"
          >
            {{ link.name }}
          </RouterLink>
          <div class="mt-auto">
            <button @click="isListingModalOpen = true; mobileMenuOpen = false" class="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg">
              List Property
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="isListingModalOpen" class="fixed inset-0 z-[100] flex justify-end">
        <div @click="isListingModalOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl p-12 flex flex-col justify-between overflow-y-auto">
          <div>
            <div class="flex justify-between items-center mb-12">
              <h2 class="text-4xl font-light dark:text-white">List your <span class="font-bold">Masterpiece</span></h2>
              <button @click="isListingModalOpen = false" class="text-slate-400 hover:text-red-500 text-2xl">✕</button>
            </div>
            <p class="text-slate-500 mb-10 leading-relaxed italic">"Sell with the world's most exclusive real estate network. Tell us about your estate."</p>
            <form class="space-y-8">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Property Address</label>
                <input type="text" class="w-full bg-transparent border-b-2 border-slate-100 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-colors dark:text-white" />
              </div>
              <div class="grid grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Asking Price</label>
                  <input type="text" placeholder="$0.00" class="w-full bg-transparent border-b-2 border-slate-100 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-colors dark:text-white" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Year Built</label>
                  <input type="text" placeholder="2026" class="w-full bg-transparent border-b-2 border-slate-100 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-colors dark:text-white" />
                </div>
              </div>
            </form>
          </div>
          <button class="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all mt-12">
            Submit for Review
          </button>
        </div>
      </div>
    </transition>

    <main class="pt-0 overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
/* Transitions for Burger Menu */
.mobile-slide-enter-active, .mobile-slide-leave-active { transition: all 0.4s ease; }
.mobile-slide-enter-from, .mobile-slide-leave-to { transform: translateX(100%); opacity: 0; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(100%); opacity: 0; }

.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(20px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-20px); }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
</style>