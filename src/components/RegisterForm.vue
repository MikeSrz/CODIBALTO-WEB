<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-lg">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <h2 class="text-stone-100 text-base font-medium mb-3">Registro Usuario </h2>
                </div>
            </div>
            <!--Formusmlario-->
            <form class="flex flex-col gap-3" @submit.prevent="procesaRegistro">
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Nombre:</label>
                    <input v-model="form.nombre" type="text" required 
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Email:</label>
                    <input v-model="form.email" type="email" required placeholder="johndoe@codibalto.es"
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">nickname:</label>
                    <input v-model="form.username" type="text" required 
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Contraseña:</label>
                    <input v-model="form.password" type="password" required minlength="8"
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Repetir contraseña:</label>
                    <input v-model="form.passwordRepeat" type="password" required
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                    <p v-if="errorPassword" class="text-red-400 text-xs mt-1">{{ errorPassword }}</p>


                <div class="flex justify-end gap-3 mt-2">
                    <button type="submit"
                        class="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded-lg transition">
                        Guardar
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { register } from '../services/authService'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
    nombre: '',
    email: '',
    username: '',
    password: '',
    passwordRepeat: ''
})

const errorPassword = ref('')

async function procesaRegistro() {
    errorPassword.value = ''

    if (form.password !== form.passwordRepeat) {
        errorPassword.value = 'Las contraseñas no coinciden'
        return
    }

    await register(form.username, form.email, form.password, form.nombre, '')
    router.push('/login')
}
</script>