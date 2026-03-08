<script setup lang="ts">
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
const router = useRouter()

// --- 1. CORE DATA & SECURITY ---
const isAuthenticated = ref(false)
const accessCode = ref('')
const loginError = ref(false)
const MASTER_CODE = 'AVELUNE2026'
const activeTab = ref('analytics')

// --- 2. THE FINANCIAL LEDGER (FIXED) ---
const financials = reactive({
  grossRevenue: 124000000,
  commissions: 15500000,
  marketingSpend: 1200000,
  operationalCosts: 850000,
  netProfit: 13450000
})

// --- 3. INVENTORY & HISTORY ENGINE ---
interface Property {
  id: number; title: string; price: number; location: string; 
  roi: string; status: string; views: number; sales: number;
}
const inventory = ref<Property[]>([
  { id: 1, title: 'The Obsidian House', price: 5400000, location: 'Santorini', roi: '14%', status: 'Active', views: 1240, sales: 4 },
  { id: 2, title: 'Skyline Suite', price: 2100000, location: 'Tokyo', roi: '9%', status: 'Reserved', views: 890, sales: 1 },
  { id: 3, title: 'Cedar Ridge', price: 8800000, location: 'Aspen', roi: '18%', status: 'Active', views: 2450, sales: 8 }
])

interface AuditLog { id: number; timestamp: string; action: string; propertyTitle: string; snapshot: Property; }
const historyLogs = ref<AuditLog[]>([])

// --- 4. CHART.JS INITIALIZATION (FIXED TS2532) ---
const incomeChartRef = ref<HTMLCanvasElement | null>(null)
const salesChartRef = ref<HTMLCanvasElement | null>(null)

const initCharts = () => {
  if (incomeChartRef.value) {
    new Chart(incomeChartRef.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Income ($M)', data: [45, 52, 48, 70, 65, 82], borderColor: '#10b981', tension: 0.4, fill: true, backgroundColor: 'rgba(16, 185, 129, 0.1)' }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    })
  }
  if (salesChartRef.value) {
    new Chart(salesChartRef.value, {
      type: 'bar',
      data: {
        labels: inventory.value.map(p => p.title),
        datasets: [{ label: 'Total Sales', data: inventory.value.map(p => p.sales), backgroundColor: '#3b82f6', borderRadius: 12 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    })
  }
}

// --- 5. ACTIONS: ADD / EDIT / DELETE ---
const showAssetModal = ref(false)
const isEditMode = ref(false)
const assetForm = reactive<Property>({ id: 0, title: '', price: 0, location: '', roi: '5%', status: 'Active', views: 0, sales: 0 })

const openAddAsset = () => {
  isEditMode.value = false
  Object.assign(assetForm, { id: Date.now(), title: '', price: 0, location: '', status: 'Active', views: 0, sales: 0 })
  showAssetModal.value = true
}

const openEditAsset = (p: Property) => {
  isEditMode.value = true
  Object.assign(assetForm, { ...p })
  showAssetModal.value = true
}

const saveAsset = () => {
  if (isEditMode.value) {
    const idx = inventory.value.findIndex(p => p.id === assetForm.id)
    if (idx !== -1) {
      historyLogs.value.unshift({ id: Date.now(), timestamp: new Date().toLocaleTimeString(), action: 'UPDATE', propertyTitle: assetForm.title, snapshot: JSON.parse(JSON.stringify(inventory.value[idx])) })
      inventory.value[idx] = { ...assetForm }
    }
  } else {
    inventory.value.push({ ...assetForm })
    historyLogs.value.unshift({ id: Date.now(), timestamp: new Date().toLocaleTimeString(), action: 'ADD', propertyTitle: assetForm.title, snapshot: JSON.parse(JSON.stringify(assetForm)) })
  }
  showAssetModal.value = false
}

const deleteAsset = (id: number) => {
  const p = inventory.value.find(i => i.id === id)
  if (p) {
    historyLogs.value.unshift({ id: Date.now(), timestamp: new Date().toLocaleTimeString(), action: 'DELETE', propertyTitle: p.title, snapshot: JSON.parse(JSON.stringify(p)) })
    inventory.value = inventory.value.filter(i => i.id !== id)
  }
}

const revertAsset = (log: AuditLog) => {
  const existsIdx = inventory.value.findIndex(p => p.id === log.snapshot.id)
  if (existsIdx !== -1) inventory.value[existsIdx] = { ...log.snapshot }
  else inventory.value.push({ ...log.snapshot })
  historyLogs.value = historyLogs.value.filter(l => l.id !== log.id)
}

const unlockVault = () => {
  if (accessCode.value === MASTER_CODE) {
    isAuthenticated.value = true
    nextTick(() => initCharts())
  } else { loginError.value = true; accessCode.value = ''; setTimeout(() => loginError.value = false, 500) }
}

const formatCurr = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
const logout = () => { isAuthenticated.value = false; router.push('/') }
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-[#020617] text-slate-200 font-sans overflow-hidden flex">
    
    <transition name="gate">
      <div v-if="!isAuthenticated" class="absolute inset-0 z-[10000] bg-slate-950 flex items-center justify-center p-6">
        <div class="w-full max-w-sm text-center space-y-10">
          <div class="w-24 h-24 bg-emerald-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl font-black shadow-2xl border-b-4 border-emerald-700">A</div>
          <h1 class="text-3xl font-light tracking-tighter uppercase text-white leading-none">Command <span class="font-bold text-emerald-500">Vault</span></h1>
          <form @submit.prevent="unlockVault" class="space-y-4">
            <input v-model="accessCode" type="password" placeholder="PROTOCOL CODE" :class="{'animate-shake border-red-500': loginError}" class="w-full bg-white/5 border border-white/10 py-5 rounded-2xl text-center text-2xl tracking-[0.5em] outline-none focus:border-emerald-500 transition-all font-mono" />
            <button class="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 hover:text-white transition-all shadow-xl">Decrypt Access</button>
          </form>
        </div>
      </div>
    </transition>

    <aside v-if="isAuthenticated" class="w-72 bg-slate-900 border-r border-white/5 flex flex-col p-8 space-y-12 shrink-0 relative z-10 backdrop-blur-3xl">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black">A</div>
        <p class="font-black tracking-tighter uppercase text-sm text-white">Avelune Ops</p>
      </div>
      <nav class="flex-1 space-y-1">
        <button v-for="t in ['analytics', 'financials', 'inventory', 'history']" :key="t" @click="activeTab = t" :class="activeTab === t ? 'bg-emerald-600/10 text-emerald-400 border-r-4 border-emerald-500' : 'text-slate-400 hover:bg-white/5'" class="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all">{{ t }}</button>
      </nav>
      <button @click="logout" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 px-6">Terminate</button>
    </aside>

    <main v-if="isAuthenticated" class="flex-1 overflow-y-auto p-12 custom-scroll bg-[#020617] relative">
      
      <div v-if="activeTab === 'analytics'" class="space-y-12 animate-entry">
        <h2 class="text-5xl font-light tracking-tighter text-white">Market <span class="font-bold text-emerald-500">Intelligence.</span></h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div class="bg-white/5 border border-white/10 rounded-[3rem] p-10 h-[450px]">
              <h3 class="text-xl font-bold uppercase tracking-widest mb-8 text-emerald-500">Total Income ($M)</h3>
              <div class="h-64"><canvas ref="incomeChartRef"></canvas></div>
           </div>
           <div class="bg-white/5 border border-white/10 rounded-[3rem] p-10 h-[450px]">
              <h3 class="text-xl font-bold uppercase tracking-widest mb-8 text-blue-500">Sales By Property</h3>
              <div class="h-64"><canvas ref="salesChartRef"></canvas></div>
           </div>
        </div>
      </div>

      <div v-if="activeTab === 'financials'" class="space-y-12 animate-entry">
        <h2 class="text-4xl font-bold uppercase tracking-widest text-emerald-500">Global Ledger</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="(v, k) in financials" :key="k" class="bg-white/5 p-8 rounded-[2rem] border border-white/5">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{{ k.replace(/([A-Z])/g, ' $1') }}</p>
              <p class="text-2xl font-black text-white tracking-tighter">{{ formatCurr(v) }}</p>
           </div>
        </div>
      </div>

      <div v-if="activeTab === 'inventory'" class="space-y-8 animate-entry">
        <div class="flex justify-between items-center">
           <h2 class="text-4xl font-bold uppercase tracking-widest text-emerald-500">Portfolio</h2>
           <button @click="openAddAsset" class="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">+ Add Asset</button>
        </div>
        <div class="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <table class="w-full text-left">
            <thead class="bg-white/5 text-[10px] font-black uppercase text-slate-500 border-b border-white/10">
              <tr><th class="p-8 text-white">Asset Identity</th><th class="p-8">Valuation</th><th class="p-8">Sales</th><th class="p-8 text-right">Protocol</th></tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="p in inventory" :key="p.id" class="group hover:bg-white/5 transition-all">
                <td class="p-8 font-bold text-lg text-white">{{ p.title }}</td>
                <td class="p-8 font-mono text-emerald-400 font-black text-lg">{{ formatCurr(p.price) }}</td>
                <td class="p-8 text-slate-500 font-bold">{{ p.sales }}</td>
                <td class="p-8 text-right space-x-2">
                  <button @click="openEditAsset(p)" class="p-3 bg-white/5 rounded-xl hover:bg-emerald-600">✏️</button>
                  <button @click="deleteAsset(p.id)" class="p-3 bg-white/5 rounded-xl hover:bg-red-500 text-red-400">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'history'" class="space-y-8 animate-entry">
        <h2 class="text-4xl font-bold uppercase tracking-widest text-amber-500">Audit Logs</h2>
        <div class="grid gap-4">
          <div v-for="log in historyLogs" :key="log.id" class="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex justify-between items-center group">
            <div class="space-y-2">
              <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase" :class="log.action === 'DELETE' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'">{{ log.action }}</span>
              <p class="text-xl font-bold text-white">{{ log.propertyTitle }}</p>
              <p class="text-[10px] text-slate-500 font-bold uppercase">Snapshot: {{ log.timestamp }}</p>
            </div>
            <button @click="revertAsset(log)" class="bg-white/10 hover:bg-white text-slate-200 hover:text-black px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all">Revert</button>
          </div>
        </div>
      </div>
    </main>

    <transition name="modal">
      <div v-if="showAssetModal" class="fixed inset-0 z-[20000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
        <div class="relative w-full max-w-2xl bg-[#0f172a] p-12 rounded-[4rem] border border-white/10 shadow-3xl">
          <h3 class="text-2xl font-black uppercase tracking-[0.2em] text-emerald-500 mb-10 text-center">{{ isEditMode ? 'Modify High-Value Asset' : 'Initialize Listing' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Asset Identity</label>
               <input v-model="assetForm.title" type="text" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-white transition-all" />
            </div>
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Valuation ($)</label>
               <input v-model.number="assetForm.price" type="number" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-emerald-400 font-mono text-xl transition-all" />
            </div>
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Monthly Sales</label>
               <input v-model.number="assetForm.sales" type="number" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-white transition-all" />
            </div>
          </div>
          <div class="flex flex-col gap-4 mt-12">
            <button @click="saveAsset" class="w-full py-6 bg-emerald-600 rounded-[2rem] font-black uppercase text-[10px] shadow-2xl hover:scale-[1.02] transition-all">Commit Changes</button>
            <button @click="showAssetModal = false" class="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white">Discard Protocol</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
.animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
.gate-leave-to { opacity: 0; filter: blur(40px); transform: scale(1.1); }
.modal-enter-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from { opacity: 0; transform: scale(0.9); }
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
</style>