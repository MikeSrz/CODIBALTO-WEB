<!-- LoginForm.vue — sin fondo ni pantalla completa -->
<template>
    <div class="bg-stone-800 rounded-lg p-8 w-full max-w-md">
        <h1 class="text-white text-2xl font-bold mb-6">Login</h1>

        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">

            <div class="flex flex-col gap-1">
                <label class="text-stone-300 text-sm">Usuario / E-mail</label>
                <input v-model="form.usernameEmail" type="text" required
                    class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-stone-300 text-sm">Contraseña</label>
                <input v-model="form.password" type="password" required
                    class="bg-stone-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

            <button type="submit" :disabled="loading"
                class="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-800 transition mt-2 disabled:opacity-50">
                {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>

        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { login } from '../services/authService'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter()

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
                if (status === 401) {
                    error.value = 'Usuario o contraseña incorrectos'
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