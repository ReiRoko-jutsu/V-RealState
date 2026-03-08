<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
const router = useRouter()

// --- 1. TYPE DEFINITIONS ---
interface Property {
  id: number; title: string; price: number; location: string; 
  roi: string; status: string; views: number; sales_volume: number;
}

interface AuditLog {
  id: number; timestamp: string; action: string; propertyTitle: string; 
  snapshot: Property;
}

// --- 2. SECURITY & AUTH ---
const isAuthenticated = ref(false)
const accessCode = ref('')
const loginError = ref(false)
const MASTER_CODE = 'AVELUNE2026'

// --- 3. NAVIGATION ---
const activeTab = ref('analytics')

// --- 4. DATA ENGINE ---
const inventory = ref<Property[]>([
  { id: 1, title: 'The Obsidian House', price: 5400000, location: 'Santorini', roi: '14%', status: 'Active', views: 1240, sales_volume: 4 },
  { id: 2, title: 'Skyline Suite', price: 2100000, location: 'Tokyo', roi: '9%', status: 'Reserved', views: 890, sales_volume: 1 },
  { id: 3, title: 'Cedar Ridge', price: 8800000, location: 'Aspen', roi: '18%', status: 'Active', views: 2450, sales_volume: 8 }
])

const historyLogs = ref<AuditLog[]>([])

// --- 5. ANALYTICS & FINANCIALS (Renamed to 'financials' to match template) ---
const metrics = ref([
  { label: 'Total Portfolio Value', value: '$842M', delta: '+5.2%', type: 'positive' },
  { label: 'Conversion Rate', value: '3.8%', delta: '+0.4%', type: 'positive' },
  { label: 'Market Sentiment', value: '92%', delta: 'High', type: 'positive' }
])

const financials = reactive({
  grossRevenue: 124000000,
  commissions: 15500000,
  marketingSpend: 1200000,
  operationalCosts: 850000,
  netProfit: 13450000,
  taxReserve: 3200000
})

// --- 6. CHART.JS LOGIC ---
const incomeChartRef = ref<HTMLCanvasElement | null>(null)
const salesChartRef = ref<HTMLCanvasElement | null>(null)
let incomeChart: Chart | null = null
let salesChart: Chart | null = null

const initCharts = () => {
  if (incomeChartRef.value) {
    incomeChart = new Chart(incomeChartRef.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Total Income ($M)',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } } } }
    })
  }
  if (salesChartRef.value) {
    salesChart = new Chart(salesChartRef.value, {
      type: 'bar',
      data: {
        labels: inventory.value.map(p => p.title),
        datasets: [{
          label: 'Sales Volume',
          data: inventory.value.map(p => p.sales_volume),
          backgroundColor: '#3b82f6',
          borderRadius: 8
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    })
  }
}

// --- 7. ASSET MANAGEMENT ACTIONS ---
const showAssetModal = ref(false)
const isEditMode = ref(false)
const assetForm = reactive<Property>({
  id: 0, title: '', price: 0, location: '', roi: '0%', status: 'Active', views: 0, sales_volume: 0
})

const openAddAsset = () => {
  isEditMode.value = false
  Object.assign(assetForm, { id: Date.now(), title: '', price: 0, location: '', roi: '5%', status: 'Active', views: 0, sales_volume: 0 })
  showAssetModal.value = true
}

const openEditAsset = (p: Property) => {
  isEditMode.value = true
  Object.assign(assetForm, { ...p })
  showAssetModal.value = true
}

const saveAsset = () => {
  if (isEditMode.value) {
    const original = inventory.value.find(p => p.id === assetForm.id)
    if (original) recordHistory('UPDATE', original)
    const idx = inventory.value.findIndex(p => p.id === assetForm.id)
    inventory.value[idx] = { ...assetForm }
  } else {
    inventory.value.push({ ...assetForm })
    recordHistory('ADD', { ...assetForm })
  }
  showAssetModal.value = false
  if(salesChart) { 
    salesChart.data.labels = inventory.value.map(p => p.title)
    salesChart.data.datasets[0].data = inventory.value.map(p => p.sales_volume)
    salesChart.update()
  }
}

const deleteAsset = (id: number) => {
  const target = inventory.value.find(p => p.id === id)
  if (target) {
    recordHistory('DELETE', target)
    inventory.value = inventory.value.filter(p => p.id !== id)
  }
}

const recordHistory = (action: string, prop: Property) => {
  historyLogs.value.unshift({
    id: Date.now(), timestamp: new Date().toLocaleTimeString(), action,
    propertyTitle: prop.title, snapshot: JSON.parse(JSON.stringify(prop))
  })
}

const revertAsset = (log: AuditLog) => {
  const existsIdx = inventory.value.findIndex(p => p.id === log.snapshot.id)
  if (existsIdx !== -1) inventory.value[existsIdx] = { ...log.snapshot }
  else inventory.value.push({ ...log.snapshot })
  historyLogs.value = historyLogs.value.filter(l => l.id !== log.id)
}

// --- 8. CRM & TRAFFIC ---
const trafficLogs = ref<{ip:string, city:string, country:string, time:string}[]>([])
const unlockVault = async () => {
  if (accessCode.value === MASTER_CODE) {
    isAuthenticated.value = true
    setTimeout(initCharts, 100) // Small delay to ensure DOM is ready
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      trafficLogs.value.unshift({ ip: data.ip, city: data.city, country: data.country_name, time: new Date().toLocaleTimeString() })
    } catch (e) { console.error("Intel Fetch Error") }
  } else {
    loginError.value = true
    accessCode.value = ''
    setTimeout(() => loginError.value = false, 500)
  }
}

const logout = () => { isAuthenticated.value = false; router.push('/') }
const formatCurr = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-[#020617] text-slate-200 font-sans overflow-hidden flex">
    
    <transition name="gate">
      <div v-if="!isAuthenticated" class="absolute inset-0 z-[10000] bg-[#020617] flex items-center justify-center p-6">
        <div class="w-full max-w-sm text-center space-y-10 animate-fade-in">
          <div class="w-24 h-24 bg-emerald-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl font-black shadow-2xl border-b-4 border-emerald-700">A</div>
          <h1 class="text-3xl font-light tracking-tighter uppercase text-white">Sovereign <span class="font-bold text-emerald-500">Vault</span></h1>
          <form @submit.prevent="unlockVault" class="space-y-4">
            <input v-model="accessCode" type="password" placeholder="PROTOCOL CODE" :class="{'animate-shake border-red-500': loginError}" class="w-full bg-white/5 border border-white/10 py-5 rounded-2xl text-center text-2xl tracking-[0.5em] outline-none focus:border-emerald-500 transition-all font-mono" />
            <button class="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 hover:text-white transition-all">Authorize Access</button>
          </form>
        </div>
      </div>
    </transition>

    <aside v-if="isAuthenticated" class="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col p-8 space-y-12 shrink-0 relative z-10 backdrop-blur-3xl">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">A</div>
        <div><p class="font-black tracking-tighter uppercase text-sm text-white">Avelune Ops</p><p class="text-[8px] text-emerald-500 font-bold uppercase">v4.0 Sovereign</p></div>
      </div>
      <nav class="flex-1 space-y-1">
        <button v-for="t in ['analytics', 'financials', 'inventory', 'history', 'traffic']" :key="t" @click="activeTab = t" :class="activeTab === t ? 'bg-emerald-600/10 text-emerald-400 border-r-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-white/5'" class="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all">{{ t }}</button>
      </nav>
      <button @click="logout" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors px-6">Terminate Session</button>
    </aside>

    <main v-if="isAuthenticated" class="flex-1 overflow-y-auto p-12 custom-scroll bg-[#020617] relative">
      
      <div v-if="activeTab === 'analytics'" class="space-y-12 animate-entry">
        <header class="space-y-2">
          <h2 class="text-5xl font-light tracking-tighter text-white leading-none">Market <span class="font-bold text-emerald-500">Intelligence.</span></h2>
          <p class="text-slate-500 text-sm">Real-time financial telemetry and sales distribution.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="m in metrics" :key="m.label" class="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{{ m.label }}</p>
            <div class="flex items-end justify-between">
               <p class="text-4xl font-black text-white tracking-tighter">{{ m.value }}</p>
               <span :class="m.type === 'positive' ? 'text-emerald-400' : 'text-red-400'" class="text-[10px] font-black bg-white/5 px-2 py-1 rounded-lg border border-white/5">{{ m.delta }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div class="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden h-[400px]">
              <h3 class="text-xl font-bold uppercase tracking-widest mb-8 text-emerald-500">Income Stream ($M)</h3>
              <canvas ref="incomeChartRef"></canvas>
           </div>
           <div class="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden h-[400px]">
              <h3 class="text-xl font-bold uppercase tracking-widest mb-8 text-blue-500">Sales By Property</h3>
              <canvas ref="salesChartRef"></canvas>
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
           <h2 class="text-4xl font-bold uppercase tracking-widest text-emerald-500">Asset Portfolio</h2>
           <button @click="openAddAsset" class="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-600/20">+ Deploy New Asset</button>
        </div>
        <div class="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <table class="w-full text-left">
            <thead class="bg-white/5 text-[10px] font-black uppercase text-slate-500">
              <tr><th class="p-8">Asset</th><th class="p-8">Region</th><th class="p-8">Valuation</th><th class="p-8">Views</th><th class="p-8 text-right">Protocol</th></tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="p in inventory" :key="p.id" class="group hover:bg-white/5 transition-all">
                <td class="p-8 font-bold text-lg text-white">{{ p.title }}</td>
                <td class="p-8 text-[11px] uppercase font-black text-slate-500">{{ p.location }}</td>
                <td class="p-8 font-mono text-emerald-400 font-black text-lg">{{ formatCurr(p.price) }}</td>
                <td class="p-8 text-slate-500 font-bold">{{ p.views }}</td>
                <td class="p-8 text-right space-x-2">
                  <button @click="openEditAsset(p)" class="p-3 bg-white/5 rounded-xl hover:bg-emerald-600 transition-colors">✏️</button>
                  <button @click="deleteAsset(p.id)" class="p-3 bg-white/5 rounded-xl hover:bg-red-500 transition-colors text-red-400 hover:text-white">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'history'" class="space-y-8 animate-entry">
        <h2 class="text-4xl font-bold uppercase tracking-widest text-amber-500">Audit Logs</h2>
        <div v-if="historyLogs.length === 0" class="text-slate-500 italic p-12 text-center">No version history detected.</div>
        <div class="grid gap-4">
          <div v-for="log in historyLogs" :key="log.id" class="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex justify-between items-center group">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                 <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase" :class="log.action === 'DELETE' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'">{{ log.action }}</span>
                 <p class="text-xl font-bold text-white">{{ log.propertyTitle }}</p>
              </div>
              <p class="text-[10px] text-slate-500 font-bold uppercase">Snapshot: {{ log.timestamp }}</p>
            </div>
            <button @click="revertAsset(log)" class="bg-white/10 hover:bg-white text-slate-200 hover:text-black px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all">Revert</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'traffic'" class="space-y-8 animate-entry">
        <h2 class="text-4xl font-bold uppercase tracking-widest text-blue-400">Live Intel Logs</h2>
        <div class="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10">
          <table class="w-full text-left">
            <thead class="bg-white/5 text-[10px] font-black uppercase text-slate-500">
              <tr><th class="p-8">IP Protocol</th><th class="p-8">City/Region</th><th class="p-8">Country</th><th class="p-8 text-right">Timestamp</th></tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="v in trafficLogs" :key="v.ip" class="hover:bg-blue-500/5 transition-colors">
                <td class="p-8 font-mono text-blue-400 text-sm font-bold">{{ v.ip }}</td>
                <td class="p-8 font-light text-slate-300">{{ v.city }}</td>
                <td class="p-8 text-[10px] font-black uppercase opacity-60">{{ v.country }}</td>
                <td class="p-8 text-right text-slate-600 font-mono text-xs">{{ v.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <transition name="modal">
      <div v-if="showAssetModal" class="fixed inset-0 z-[20000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
        <div class="relative w-full max-w-2xl bg-[#0f172a] p-12 rounded-[4rem] border border-white/10 shadow-3xl">
          <h3 class="text-2xl font-black uppercase tracking-[0.2em] text-emerald-500 mb-10 text-center">{{ isEditMode ? 'Modify High-Value Asset' : 'Initialize Global Listing' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Identity</label>
               <input v-model="assetForm.title" type="text" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-white transition-all" />
            </div>
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valuation ($)</label>
               <input v-model.number="assetForm.price" type="number" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-emerald-400 font-mono text-xl transition-all" />
            </div>
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sales Volume (Monthly)</label>
               <input v-model.number="assetForm.sales_volume" type="number" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-emerald-400 font-mono text-xl transition-all" />
            </div>
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
               <select v-model="assetForm.status" class="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none text-white transition-all"><option>Active</option><option>Reserved</option><option>Negotiation</option></select>
            </div>
          </div>
          <div class="flex flex-col gap-4 mt-12">
            <button @click="saveAsset" class="w-full py-6 bg-emerald-600 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-[1.02] transition-all text-white">Commit to Inventory</button>
            <button @click="showAssetModal = false" class="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Abort Protocol</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
.animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
.animate-entry { animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.gate-leave-active { transition: all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); }
.gate-leave-to { opacity: 0; filter: blur(40px); transform: scale(1.1); }
.modal-enter-active, .modal-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9); }
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
</style>