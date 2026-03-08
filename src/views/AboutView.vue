<script setup lang="ts">
import { ref, onMounted } from 'vue'

// --- REAL-TIME MARKET DATA (Mocked for 2026 Context) ---
const marketInsights = ref([
  { label: 'Global Luxury Demand', value: '+14.2%', trend: 'up', info: 'Year-over-year increase in ultra-prime searches.' },
  { label: 'Avg. Closing Time', value: '42 Days', trend: 'down', info: 'Decreased by 12% via Avelune AI Matching.' },
  { label: 'Sustainability Index', value: '88/100', trend: 'up', info: 'Portfolio properties with LEED Gold or higher.' }
])

// --- TIMELINE DATA ---
const milestones = [
  { year: '2014', title: 'The Zurich Foundation', desc: 'Born from a vision to digitize Swiss private real estate.' },
  { year: '2019', title: 'The Tri-Axis Expansion', desc: 'Opening flagship galleries in NYC, Tokyo, and Dubai.' },
  { year: '2026', title: 'The AI Sovereign', desc: 'Launching the world\'s first predictive luxury acquisition engine.' }
]

// --- STATS ANIMATION LOGIC ---
const animateStats = ref(false)
onMounted(() => {
  setTimeout(() => { animateStats.value = true }, 500)
})
</script>

<template>
  <div class="bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
    
    <section class="relative pt-40 pb-24 px-6 max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-10 animate-slide-up">
          <div class="inline-flex items-center gap-3">
            <span class="h-px w-12 bg-emerald-500"></span>
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Established 2014</p>
          </div>
          <h1 class="text-7xl md:text-8xl font-light tracking-tighter dark:text-white leading-[0.85]">
            Legacy <br/> is <span class="font-serif italic text-emerald-500">Earned.</span>
          </h1>
          <p class="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg font-light">
            At Avelune, we don't just facilitate transactions. We orchestrate transitions for the world's most influential families, blending heritage values with future-proof technology.
          </p>
          <div class="flex gap-16">
            <div v-for="s in [{v:'$12.8B', t:'Volume'}, {v:'24', t:'Nations'}]" :key="s.t" class="space-y-1">
              <p class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                {{ animateStats ? s.v : '0' }}
              </p>
              <p class="text-[10px] uppercase font-bold tracking-[0.3em] text-emerald-600">{{ s.t }}</p>
            </div>
          </div>
        </div>

        <div class="relative group">
          <div class="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900 transition-transform duration-700 group-hover:scale-[1.02]">
            <img src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?q=80&w=1200" alt="Founder Vision" />
          </div>
          <div class="absolute -bottom-10 -right-6 bg-emerald-600 text-white p-10 rounded-3xl shadow-2xl z-20 max-w-xs animate-bounce-slow">
            <p class="text-sm font-medium italic">"Technology is the tool, but human intuition is the compass of luxury."</p>
            <p class="mt-4 text-[10px] font-black uppercase tracking-widest">— Julius Avelune</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-slate-50 dark:bg-slate-900/50 py-32">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 class="text-4xl font-light dark:text-white">Why Investors <span class="font-bold">Choose Us</span></h2>
          <p class="text-slate-500 dark:text-slate-400">Live data insights from the Avelune Global Intelligence Network.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="item in marketInsights" :key="item.label" 
               class="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:border-emerald-500/50 transition-all group">
            <div class="flex justify-between items-start mb-6">
              <span class="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                <span v-if="item.trend === 'up'" class="text-emerald-500 text-xl">↗</span>
                <span v-else class="text-blue-500 text-xl">↘</span>
              </span>
              <span class="text-4xl font-black dark:text-white tracking-tighter">{{ item.value }}</span>
            </div>
            <h4 class="text-lg font-bold dark:text-white mb-2">{{ item.label }}</h4>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ item.info }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 bg-slate-950 text-white overflow-hidden relative">
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <p class="text-[20rem] font-black leading-none -translate-x-20">HISTORY</p>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <h3 class="text-5xl font-light mb-24 tracking-tighter">The <span class="font-serif italic">Evolution</span> of Alpha.</h3>
        
        <div class="grid lg:grid-cols-3 gap-16 relative">
          <div class="hidden lg:block absolute top-10 left-0 w-full h-px bg-white/10"></div>
          
          <div v-for="m in milestones" :key="m.year" class="space-y-8 group">
            <div class="relative">
              <div class="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-2xl font-black z-10 relative group-hover:scale-110 transition-transform">
                {{ m.year }}
              </div>
              <div class="absolute top-10 left-10 w-full h-px bg-emerald-600/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></div>
            </div>
            <div class="space-y-4">
              <h4 class="text-2xl font-bold tracking-tight">{{ m.title }}</h4>
              <p class="text-slate-400 text-sm leading-relaxed max-w-xs">{{ m.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 max-w-7xl mx-auto">
      <div class="bg-emerald-600 rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div class="max-w-xl space-y-6 relative z-10">
          <h2 class="text-5xl md:text-7xl font-light text-white tracking-tighter">Ready for the <span class="font-bold">Next Phase?</span></h2>
          <p class="text-emerald-100 text-lg">Join 4,000+ high-net-worth individuals receiving off-market insights weekly.</p>
        </div>
        
        <div class="flex flex-col gap-4 w-full md:w-auto relative z-10">
          <button class="bg-white text-emerald-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-2xl">
            Join the Inner Circle
          </button>
          <button class="bg-emerald-700/50 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-700 transition-all">
            Download Annual Report
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}
</style>