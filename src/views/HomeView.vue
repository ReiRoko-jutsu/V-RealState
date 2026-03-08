<script setup lang="ts">
import { ref, computed } from 'vue'

// --- 1. DATA: THE OWNER & BRAND ---
const owner = {
  name: 'Julius Avelune',
  title: 'Founder & Chief Curator',
  bio: 'With over two decades in high-stakes architectural acquisitions, Julius has redefined the meaning of "home" for the world\'s most discerning individuals.',
  signature: 'Avenue to Excellence.',
  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'
}

// --- 2. DATA: LUXURY LISTINGS (Newest First) ---
const allProperties = ref([
  { id: 1, type: 'Villa', title: 'The Obsidian House', price: 5400000, location: 'Santorini, Greece', beds: 6, baths: 5, sqft: '4,200', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800', isNew: true },
  { id: 2, type: 'Penthouse', title: 'Skyline Suite', price: 2100000, location: 'Tokyo, Japan', beds: 3, baths: 3, sqft: '2,800', img: '/skyline.jpg', isNew: true },
  { id: 3, type: 'Estate', title: 'Cedar Ridge', price: 8800000, location: 'Aspen, CO', beds: 8, baths: 7, sqft: '9,500', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800', isNew: false },
  { id: 4, type: 'Villa', title: 'Azure Bay', price: 3200000, location: 'Malibu, CA', beds: 4, baths: 4, sqft: '3,100', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800', isNew: false },
  { id: 5, type: 'Estate', title: 'Emerald Manor', price: 12500000, location: 'Lake Como, Italy', beds: 10, baths: 9, sqft: '12,000', img: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?q=80&w=800', isNew: true },
  { id: 6, type: 'Penthouse', title: 'The Vertex', price: 4100000, location: 'Dubai, UAE', beds: 4, baths: 5, sqft: '5,000', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800', isNew: false }
])

// --- 3. FILTER STATE & LOGIC ---
const selectedType = ref('All')
const searchQuery = ref('')
const maxPrice = ref(15000000)
const categories = ['All', 'Villa', 'Penthouse', 'Estate']

const filteredListings = computed(() => {
  return allProperties.value.filter(p => {
    const matchesType = selectedType.value === 'All' || p.type === selectedType.value
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesPrice = p.price <= maxPrice.value
    return matchesType && matchesSearch && matchesPrice
  })
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val)
}

// --- 4. FUNCTIONAL CLICKS ---
const handleSearch = () => {
  const element = document.getElementById('portfolio');
  element?.scrollIntoView({ behavior: 'smooth' });
}

const openConsultation = () => {
  alert("Our Luxury Concierge will contact you within 24 hours.");
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
    
    <section class="relative h-[95vh] flex items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000" 
           class="absolute inset-0 w-full h-full object-cover brightness-50 scale-105 animate-slow-zoom" alt="Luxury Home" />
      
      <div class="relative z-10 text-center px-6 max-w-5xl space-y-8">
        <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] border border-white/20 animate-fade-in">
          World-Class Architecture
        </span>
        <h1 class="text-6xl md:text-9xl font-light text-white tracking-tighter leading-[0.85] animate-slide-up">
          Luxury <br/> <span class="font-serif italic font-normal">Simplified.</span>
        </h1>
        
        <div class="mt-12 bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 transition-all hover:shadow-emerald-500/10">
          <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="Where do you want to live?" 
                 class="flex-1 bg-white/90 dark:bg-slate-800/90 px-8 py-4 rounded-full outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 ring-emerald-500" />
          <button @click="handleSearch" class="bg-emerald-600 px-10 py-4 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
            Search
          </button>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-20 items-center">
        <div class="relative group">
          <div class="absolute -inset-4 bg-emerald-600/10 rounded-[4rem] blur-2xl group-hover:bg-emerald-600/20 transition-all"></div>
          <img :src="owner.img" class="rounded-[3.5rem] relative z-10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" alt="Julius Avelune" />
          <div class="absolute bottom-10 -right-10 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl z-20 border border-slate-100 dark:border-slate-800">
             <p class="text-3xl font-serif italic text-emerald-600">"{{ owner.signature }}"</p>
          </div>
        </div>
        <div class="space-y-8">
          <p class="text-xs font-black uppercase tracking-[0.4em] text-emerald-600">Founders Vision</p>
          <h2 class="text-5xl font-light dark:text-white leading-tight">Trust is the <br/> <span class="font-bold">Ultimate Luxury.</span></h2>
          <p class="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">
            {{ owner.bio }}
          </p>
          <div class="pt-6">
             <button @click="openConsultation" class="group flex items-center gap-4 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs hover:text-emerald-600 transition-colors">
               Meet our Founder 
               <span class="w-10 h-px bg-slate-900 dark:bg-white group-hover:bg-emerald-600 transition-all"></span>
             </button>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-slate-50 dark:bg-slate-900 py-32">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-end mb-16">
          <h2 class="text-4xl font-light dark:text-white">Newest <span class="font-bold text-emerald-600">Arrivals</span></h2>
          <RouterLink to="/properties" class="text-xs font-bold uppercase tracking-widest hover:text-emerald-600 dark:text-slate-400">View All Properties &rarr;</RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="prop in allProperties.filter(p => p.isNew).slice(0, 3)" :key="'new-'+prop.id" 
               class="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer">
            <img :src="prop.img" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent p-10 flex flex-col justify-end">
              <span class="mb-4 bg-emerald-500 text-white w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase">Just Listed</span>
              <h3 class="text-2xl text-white font-bold">{{ prop.title }}</h3>
              <p class="text-slate-300">{{ prop.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="portfolio" class="max-w-7xl mx-auto py-32 px-6">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div class="space-y-4">
          <h2 class="text-4xl font-light text-slate-900 dark:text-white">Exceptional <span class="font-bold">Portfolio</span></h2>
          <div class="flex gap-2">
            <button v-for="cat in categories" :key="cat" 
                    @click="selectedType = cat"
                    :class="[selectedType === cat ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-slate-900 text-slate-500']"
                    class="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
              {{ cat }}
            </button>
          </div>
        </div>
        
        <div class="w-full md:w-64 space-y-4">
          <div class="flex justify-between text-[10px] font-bold text-slate-400">
            <span>Price Limit</span>
            <span class="text-emerald-600">{{ formatCurrency(maxPrice) }}</span>
          </div>
          <input v-model="maxPrice" type="range" min="1000000" max="15000000" step="500000" 
                 class="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
        </div>
      </div>

      <div v-if="filteredListings.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <transition-group name="stagger">
          <div v-for="prop in filteredListings" :key="prop.id" 
               class="group relative bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500">
            <div class="h-72 overflow-hidden relative">
              <img :src="prop.img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <button class="absolute top-6 right-6 p-3 bg-white/90 rounded-full shadow-xl hover:bg-emerald-600 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
            <div class="p-10 space-y-4 text-center">
              <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{{ prop.type }}</span>
              <h3 class="text-2xl font-light dark:text-white">{{ prop.title }}</h3>
              <p class="text-xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(prop.price) }}</p>
            </div>
          </div>
        </transition-group>
      </div>
    </section>

    <section class="bg-slate-950 py-32 px-6 text-white text-center">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div v-for="stat in [{v:'$12B+', t:'Volume'}, {v:'450+', t:'Estates'}, {v:'24', t:'Nations'}, {v:'99%', t:'Loyalty'}]" :key="stat.t">
          <p class="text-5xl font-light mb-2 text-emerald-500">{{ stat.v }}</p>
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">{{ stat.t }}</p>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 text-center bg-emerald-600 overflow-hidden relative">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div class="max-w-3xl mx-auto space-y-10 relative z-10">
        <h2 class="text-5xl md:text-7xl font-light text-white tracking-tighter">Your Story <span class="font-bold">Starts Here.</span></h2>
        <p class="text-emerald-100 text-xl font-light">Global reach. Local expertise. Extraordinary living.</p>
        <div class="flex flex-wrap justify-center gap-4">
           <button @click="openConsultation" class="bg-white text-emerald-600 px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-2xl">
              Request Private View
           </button>
           <button class="border border-white text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-emerald-600 transition-all">
              List Your Property
           </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style>
/* Cinematic Slow Zoom */
@keyframes slow-zoom {
  0% { transform: scale(1.05); }
  100% { transform: scale(1.15); }
}
.animate-slow-zoom { animation: slow-zoom 30s infinite alternate ease-in-out; }

/* Grid Staggering */
.stagger-enter-active, .stagger-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.stagger-enter-from { opacity: 0; transform: translateY(50px); }

/* Fade & Slide Transitions */
.animate-fade-in { animation: fadeIn 2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.animate-slide-up { animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
</style>