<template>
  <NavBarUser/>
  <div class="min-h-screen bg-stone-900 text-white p-8">
    
    <div class="flex items-center gap-3 mb-6">
      <h1 class="text-xl font-semibold">Mis contraseñas</h1>
      <span class="text-xs text-stone-400 bg-stone-800 border border-stone-700 rounded-full px-3 py-0.5">
        {{ cards.length }} guardadas
      </span>
    </div>

    <!-- Buscador -->
    <div class="flex items-center gap-2 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 mb-4">
      <input v-model="search" placeholder="Buscar..." class="bg-transparent outline-none text-sm flex-1 text-white placeholder-stone-500"/>
    </div>

    <ul class="flex flex-col gap-1.5">
      <li v-for="card in filteredCards" :key="card.id"
          class="group flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 hover:border-stone-500 transition">
        <div class="w-9 h-9 rounded-lg bg-stone-700 flex items-center justify-center font-medium text-sm flex-shrink-0">
          {{ card.domain[0].toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ card.domain }}</p>
          <p class="text-xs text-stone-400 truncate">{{ card.mail }}</p>
        </div>
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button class="p-1.5 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white"><img src="@/assets/icons/pen.svg" alt="Editar" class="w-4 h-4" @click="openModalEditar = true"></button>
          <button class="p-1.5 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white"><img src="@/assets/icons/ojo.svg" alt="Ver" class="w-4 h-4" @click="openModalDatos = true"></button>
          <button class="p-1.5 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-red-400"><img src="@/assets/icons/trash_can.svg" alt="Eliminar" class="w-4 h-4" @click="openModalConfirm = true"></button>
        </div>
      </li>
    </ul>

  </div>

  <button @click="openModalAñadir = true"
    class="fixed bottom-6 right-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white font-medium px-5 py-2.5 rounded-full transition">
    + Añadir
  </button>

  <!-- Modales -->
  <AddCardModal v-if="openModalAñadir" @close="openModalAñadir = false"/>
  <EditCardModal v-if="openModalEditar" @close="openModalEditar = false"/>
  <CardDataModal v-if="openModalDatos" @close="openModalDatos = false"/>
  <ConfirmPasswordModal v-if="openModalConfirm" @close="openModalConfirm = false"/>
  
</template>
/*
<script>
import NavBarUser from '@/components/NavBarUser.vue';
import { useAuthStore } from '@/stores/auth';
import AddCardModal from '@/components/modals/AddCardModal.vue';
import EditCardModal from '@/components/modals/EditCardModal.vue';
import CardDataModal from '@/components/modals/CardDataModal.vue';
import ConfirmPasswordModal from '@/components/modals/ConfirmPasswordModal.vue';

export default {
    components: {
        NavBarUser,
        AddCardModal,
        EditCardModal,
        CardDataModal,
        ConfirmPasswordModal
    },
    data(){
        return {
            search: '',
            openModalAñadir: false,
            openModalEditar: false,
            openModalDatos: false,
            openModalConfirm: false
        }
    },
    setup(){
        const authStore = useAuthStore()
        return {authStore};
    },
    computed: {
        cards() {
            return this.authStore.user.passCards
        },
        filteredCards() { //buscador
            return this.cards.filter(c =>
                c.domain?.toLowerCase().includes(this.search.toLowerCase())
            )
      },
      methods:{}
}
}
</script>