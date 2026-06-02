<template>
    <div class="flex items-center justify-center">
        <div class="bg-stone-800 rounded-lg p-8 w-full max-w-md">
            <h1 class="text-white text-2xl font-bold mb-6">Regístrate:</h1>

            <form class="flex flex-col gap-4" @submit.prevent="procesaRegistro">

                <div class="flex flex-col gap-1">
                    <label class="text-stone-300 text-sm">Nombre:</label>
                    <input v-model="form.nombre" type="text" required
                        class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-stone-300 text-sm">Email:</label>
                    <input v-model="form.email" type="email" required
                        class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-stone-300 text-sm">Nombre de usuario:</label>
                    <input v-model="form.username" type="text" required
                        class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-stone-300 text-sm">Contraseña:</label>
                    <input v-model="form.password" type="password" required
                        class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-stone-300 text-sm">Repetir contraseña:</label>
                    <input v-model="form.passwordRepeat" type="password" required
                        class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                    <p v-if="errorPassword" class="text-red-400 text-xs mt-1">{{ errorPassword }}</p>
                </div>

                <button type="submit"
                    class="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-800 transition mt-2">
                    Registrarse
                </button>

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