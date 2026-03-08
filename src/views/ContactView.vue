<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- FORM STATE ---
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  inquiryType: 'Buying a Property',
  message: ''
})

const isSubmitted = ref(false)
const isTyping = ref(false)

// --- REAL-TIME GUIDANCE LOGIC ---
const guidanceMessage = computed(() => {
  if (!form.firstName) return "Welcome. Let's begin with your name."
  if (!form.email.includes('@')) return "Providing your elite email ensures priority routing."
  if (form.message.length < 10) return "Tell us a bit about the masterpiece you're looking for."
  return "Everything looks perfect. Our advisors are ready."
})

const progress = computed(() => {
  let count = 0
  if (form.firstName) count += 25
  if (form.email.includes('@')) count += 25
  if (form.message.length > 5) count += 50
  return count
})

// --- FUNCTIONAL ACTIONS ---
const handleSubmit = () => {
  if (!form.email.includes('@')) {
    alert("Please provide a valid global email address.")
    return
  }
  isSubmitted.value = true
  // Reset form after delay
  setTimeout(() => {
    isSubmitted.value = false
    Object.assign(form, { firstName: '', lastName: '', email: '', message: '' })
  }, 5000)
}
</script>

<template>
  <div class="pt-40 pb-24 px-6 max-w-7xl mx-auto transition-colors duration-500">
    <div class="grid lg:grid-cols-2 gap-24 items-start">
      
      <div class="space-y-16 animate-slide-up">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-3">
            <span class="h-[1px] w-12 bg-emerald-500"></span>
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Global Concierge</p>
          </div>
          <h1 class="text-7xl font-light text-slate-900 dark:text-white tracking-tighter leading-none">
            Secure Your <br/> <span class="font-serif italic text-emerald-500">Legacy.</span>
          </h1>
          <p class="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-md">
            Our luxury advisors operate across 24 countries to ensure your acquisition is seamless and private.
          </p>
        </div>

        <div class="grid gap-8">
          <div v-for="info in [
            {t:'Global HQ', d:'Avenue of Stars, Los Angeles', i:'📍'},
            {t:'Private Line', d:'+1 (800) AVELUNE', i:'📞'},
            {t:'Digital Inquiries', d:'concierge@avelune.com', i:'✉️'}
          ]" :key="info.t" class="group flex items-start gap-6">
            <div class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-500 border border-slate-100 dark:border-slate-800">
              {{ info.i }}
            </div>
            <div>
              <h4 class="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{{ info.t }}</h4>
              <p class="text-xl font-light dark:text-white group-hover:text-emerald-500 transition-colors cursor-default">{{ info.d }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="absolute -top-12 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 transition-all duration-700" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[4rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-white/5 relative overflow-hidden">
          
          <transition name="fade-overlay">
            <div v-if="isSubmitted" class="absolute inset-0 z-50 bg-emerald-600 flex flex-col items-center justify-center text-white text-center p-10">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">✓</div>
              <h3 class="text-3xl font-bold mb-2">Request Received</h3>
              <p class="opacity-80">A senior advisor has been notified. Check your encrypted inbox shortly.</p>
            </div>
          </transition>

          <form @submit.prevent="handleSubmit" class="space-y-10">
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <p class="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <span class="animate-pulse">●</span> {{ guidanceMessage }}
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="group space-y-2">
                <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Identity</label>
                <input v-model="form.firstName" type="text" placeholder="First Name" required 
                       class="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white placeholder:text-slate-300" />
              </div>
              <div class="group space-y-2">
                <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Surname</label>
                <input v-model="form.lastName" type="text" placeholder="Last Name" required 
                       class="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white placeholder:text-slate-300" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <input v-model="form.email" type="email" placeholder="client@private.com" required 
                     class="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white placeholder:text-slate-300" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Inquiry Path</label>
              <select v-model="form.inquiryType" class="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 outline-none dark:text-white cursor-pointer focus:border-emerald-500">
                <option>Buying a Property</option>
                <option>Selling a Property</option>
                <option>Investment Portfolio Inquiry</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Requirements</label>
              <textarea v-model="form.message" rows="4" placeholder="How may we assist in your next acquisition?" 
                        class="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white resize-none placeholder:text-slate-300"></textarea>
            </div>

            <button type="submit" 
                    class="group w-full py-6 bg-slate-950 dark:bg-emerald-600 text-white rounded-[2rem] font-black tracking-[0.2em] text-xs hover:bg-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-3">
              INITIALIZE CONNECTION
              <span class="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.fade-overlay-enter-active, .fade-overlay-leave-active { transition: all 0.6s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; transform: translateY(100%); }

/* High-end Input Glow Effect */
input:focus, select:focus, textarea:focus {
  box-shadow: 0 10px 15px -10px rgba(16, 185, 129, 0.1);
}
</style>