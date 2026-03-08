<script setup lang="ts">
import { ref, computed } from 'vue'

// --- 1. TYPE DEFINITION ---
interface Property {
  id: number;
  type: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  inquiries: number;
  status: string;
  dateAdded: string;
  history: number[];
  img: string;
}

// --- 2. DATA: LUXURY LISTINGS ---
const properties = ref<Property[]>([
  { 
    id: 1, type: 'Villa', title: 'The Obsidian House', price: 5400000, 
    location: 'Santorini, Greece', beds: 6, inquiries: 424, 
    status: 'Trending', dateAdded: '2026-03-01',
    history: [4.8, 4.9, 5.1, 5.2, 5.4],
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800' 
  },
  { 
    id: 2, type: 'Penthouse', title: 'Skyline Suite', price: 2100000, 
    location: 'Tokyo, Japan', beds: 3, inquiries: 89, 
    status: 'Newest', dateAdded: '2026-03-07',
    history: [1.9, 1.95, 2.0, 2.05, 2.1],
    img: 'https://images.unsplash.com/photo-1493397212122-2b85def82820?q=80&w=800' 
  },
  { 
    id: 3, type: 'Estate', title: 'Cedar Ridge', price: 8800000, 
    location: 'Aspen, CO', beds: 8, inquiries: 245, 
    status: 'Best Seller', dateAdded: '2026-01-15',
    history: [7.2, 7.5, 8.0, 8.4, 8.8],
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800' 
  },
  { 
    id: 4, type: 'Villa', title: 'Azure Bay', price: 3200000, 
    location: 'Malibu, CA', beds: 4, inquiries: 56, 
    status: 'Limited', dateAdded: '2026-02-20',
    history: [2.8, 2.9, 3.0, 3.1, 3.2],
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800' 
  },
  { 
    id: 5, type: 'Penthouse', title: 'The Vertex', price: 12500000, 
    location: 'Dubai, UAE', beds: 5, inquiries: 612, 
    status: 'Most Viewed', dateAdded: '2026-03-05',
    history: [10.5, 11.0, 11.8, 12.2, 12.5],
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800' 
  }
])

// --- 3. STATE MANAGEMENT ---
const searchQuery = ref('')
const selectedType = ref('All')
const priceRange = ref(15000000)
const sortBy = ref('Newest')
const showModal = ref(false)
const selectedProperty = ref<Property | null>(null)

// --- 4. FUNCTIONAL ACTIONS ---
const openInquiry = (prop: Property) => {
  selectedProperty.value = prop
  showModal.value = true
}

const submitInquiry = () => {
  showModal.value = false
  alert('Request Sent Successfully. An Avelune advisor will contact you shortly.')
}

const getChartPath = (data: number[] | undefined) => {
  if (!data || data.length === 0) return ''
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min === 0 ? 1 : max - min
  return data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 40 - ((val - min) / range) * 30
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
}

// --- 5. COMPUTED LOGIC ---
const filteredProperties = computed(() => {
  let result = properties.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === 'All' || p.type === selectedType.value
    const matchesPrice = p.price <= priceRange.value
    return matchesSearch && matchesType && matchesPrice
  })

  if (sortBy.value === 'Newest') {
    return result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
  } else if (sortBy.value === 'Inquiries') {
    return result.sort((a, b) => b.inquiries - a.inquiries)
  }
  return result
})

const formatPrice = (val: number) => new Intl.NumberFormat('en-US', { 
  style: 'currency', currency: 'USD', compactDisplay: 'short' 
}).format(val)
</script>

<template>
  <div class="space-y-0 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
    
    <section class="relative h-[65vh] md:h-[95vh] w-full overflow-hidden flex items-center justify-center">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000" 
           class="absolute inset-0 w-full h-full object-cover brightness-[0.4] animate-slow-zoom" 
           alt="Luxury Estate Banner" />
      
      

      <div class="relative z-10 text-center px-6 max-w-5xl space-y-6">
        <div class="animate-slide-up">
          <span class="inline-block px-5 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] border border-emerald-500/30 mb-4">
            Avelune Global Estates
          </span>
          <h1 class="text-5xl md:text-8xl font-light text-white tracking-tighter leading-tight drop-shadow-2xl">
            Where Architecture <br/> Meets <span class="font-serif italic font-normal text-emerald-500">Legacy.</span>
          </h1>
          <p class="text-slate-200 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            A private portfolio of the world's most sought-after residences, curated for the modern collector.
          </p>
        </div>
      </div>

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span class="text-[9px] font-bold text-white uppercase tracking-[0.4em]">Scroll to Discover</span>
        <div class="w-px h-16 bg-gradient-to-b from-emerald-500 to-transparent"></div>
      </div>
    </section>

    <div class="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-24">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-100 dark:border-slate-800 pb-12">
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.4em]">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Real-Time Market Pulse
          </div>
          <h2 class="text-4xl md:text-6xl font-light text-slate-900 dark:text-white tracking-tighter leading-none">Curated <span class="font-bold">Masterpieces</span></h2>
        </div>
        
        <div class="flex gap-12 bg-slate-50 dark:bg-slate-900/50 p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div v-for="s in [{l:'Market Inquiries', v:'1.2k'}, {l:'Sold (Mo)', v:'14'}]" :key="s.l">
            <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ s.v }}</p>
            <p class="text-[9px] uppercase font-bold text-slate-400 tracking-widest">{{ s.l }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 rounded-[3rem] flex flex-wrap gap-8 items-center border border-slate-200 dark:border-slate-800 shadow-2xl transition-all hover:border-emerald-500/20">
        <div class="flex-1 min-w-[280px] space-y-3">
          <label class="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-2">Intelligence Search</label>
          <input v-model="searchQuery" type="text" placeholder="By Destination or Estate Name..." 
                 class="w-full bg-slate-100 dark:bg-slate-800/50 p-5 rounded-2xl outline-none focus:ring-2 ring-emerald-500/40 transition-all dark:text-white" />
        </div>
        
        <div class="w-full md:w-52 space-y-3">
          <label class="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-2">Property Sort</label>
          <select v-model="sortBy" class="w-full bg-slate-100 dark:bg-slate-800/50 p-5 rounded-2xl outline-none dark:text-white cursor-pointer appearance-none">
            <option>Newest</option>
            <option value="Inquiries">Most Popular</option>
          </select>
        </div>

        <div class="w-full md:w-80 space-y-3">
          <div class="flex justify-between px-2">
            <label class="text-[10px] uppercase tracking-widest font-black text-slate-400">Budget Constraint</label>
            <span class="text-xs font-bold text-emerald-600 tracking-tighter">{{ formatPrice(priceRange) }}</span>
          </div>
          <input v-model="priceRange" type="range" min="1000000" max="15000000" step="500000" 
                 class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
        </div>
      </div>

      <transition-group name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div v-for="prop in filteredProperties" :key="prop.id" 
             @click="openInquiry(prop)"
             class="group bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer">
          
          <div class="h-80 overflow-hidden relative">
            <img :src="prop.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s]" />
            <div class="absolute top-6 left-6 bg-emerald-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{{ prop.status }}</div>
            <div class="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-bold border border-white/10">
              🔥 {{ prop.inquiries }} Active Views
            </div>
          </div>

          <div class="p-10 space-y-8">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{{ prop.type }}</p>
                <h3 class="text-2xl font-bold dark:text-white tracking-tight leading-tight group-hover:text-emerald-500 transition-colors">{{ prop.title }}</h3>
              </div>
              <div class="text-right">
                <span class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{{ formatPrice(prop.price) }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50">
              <p class="text-slate-400 text-sm italic font-light">📍 {{ prop.location }}</p>
              <button class="bg-slate-900 dark:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">
                Inquire
              </button>
            </div>
          </div>
        </div>
      </transition-group>

      <transition name="modal-pop">
        <div v-if="showModal && selectedProperty" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div @click="showModal = false" class="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"></div>
          
          <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-white/10 overflow-hidden">
            <button @click="showModal = false" class="absolute top-8 right-8 text-slate-400 hover:text-emerald-500 transition-all text-2xl font-light">✕</button>
            
            <div class="space-y-10">
              <div>
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Valuation Trend & Inquiry</p>
                <h3 class="text-4xl font-light dark:text-white leading-tight tracking-tighter">{{ selectedProperty.title }}</h3>
              </div>

              <div class="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
                <div class="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <span>Valuation History</span>
                  <span class="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">+12.4% Capital Growth</span>
                </div>
                
                <div class="h-32 w-full relative">
                  <svg viewBox="0 0 100 40" class="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path :d="getChartPath(selectedProperty?.history)" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" class="animate-draw" />
                    <path :d="getChartPath(selectedProperty?.history) + ' L 100 40 L 0 40 Z'" fill="url(#chartGrad)" />
                  </svg>
                </div>
              </div>

              <form @submit.prevent="submitInquiry" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" required class="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 ring-emerald-500 dark:text-white text-sm" />
                <input type="email" placeholder="Email Address" required class="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 ring-emerald-500 dark:text-white text-sm" />
                <textarea placeholder="Tell us your specific requirements..." rows="2" class="md:col-span-2 w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 ring-emerald-500 dark:text-white resize-none text-sm"></textarea>
                <button type="submit" class="md:col-span-2 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-500/30 hover:bg-emerald-500 transition-all">
                  Secure Private Viewing ({{ formatPrice(selectedProperty.price) }})
                </button>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Cinematic Banner Ken Burns Effect */
@keyframes slow-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}
.animate-slow-zoom {
  animation: slow-zoom 25s infinite alternate ease-in-out;
}

/* UI Animations */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Filtering Grid Transitions */
.list-move, .list-enter-active, .list-leave-active { transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.list-enter-from { opacity: 0; transform: translateY(50px) scale(0.95); }
.list-leave-to { opacity: 0; transform: scale(0.9); position: absolute; }

/* Modal Scale & Fade */
.modal-pop-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-pop-leave-active { transition: all 0.3s ease-in; }
.modal-pop-enter-from { opacity: 0; transform: scale(0.8) translateY(20px); }
.modal-pop-leave-to { opacity: 0; transform: scale(0.95); }

/* SVG Sparkline Drawing */
.animate-draw {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }

/* Range Slider Accent */
input[type=range] { accent-color: #10b981; }

/* Custom Scrollbar for Luxury Look */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
</style>