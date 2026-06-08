<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-lg">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <h2 class="text-stone-100 text-base font-medium mb-3">Login Usuario </h2>
                </div>
            </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">

            <div class="flex flex-col gap-1">
                <label class="text-stone-300 text-sm">Usuario / E-mail</label>
                <input v-model="form.usernameEmail" type="text" required
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-stone-300 text-sm">Contraseña</label>
                <input v-model="form.password" type="password" required
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>

            <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

            <button type="submit" :disabled="loading"
                class="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-800 transition mt-2 disabled:opacity-50">
                {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
        </form>
        <p class="text-stone-300">
            Si no tienes cuenta puedes 
            <router-link 
                to="/registro"
                class="text-blue-400 hover:text-blue-300 underline ">
                registrarte
            </router-link>
        </p>
    </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { login } from '../services/authService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
    setup() {
        const router = useRouter()
        const toast = useToast()
        const form = reactive({
            usernameEmail: '',
            password: ''
        })

        const error = ref('')
        const loading = ref(false)

        function parseInput(): { username: string | null, mail: string | null } {
            const isEmail = form.usernameEmail.includes('@')
            return {
                username: isEmail ? null : form.usernameEmail,
                mail:     isEmail ? form.usernameEmail : null
            }
        }
        async function handleLogin() {
            error.value = ''
            loading.value = true

            try {
                const { username, mail } = parseInput()
                await login(username, mail, form.password)
                router.push('/home')

            } catch (e: any) {
                const status = e.response?.status
                if (status === 401 || status === 404) {
                    error.value = 'Usuario o contraseña incorrectos'
                    toast.error('Usuario o contraseña incorrectos')
                } else {
                    error.value = 'Error al iniciar sesión, inténtalo de nuevo'
                }
            } finally {
                loading.value = false
            }
        }
        return { form, error, loading, handleLogin }
    }
})
</script>