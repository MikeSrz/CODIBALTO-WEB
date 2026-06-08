<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-lg">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <h2 class="text-stone-100 text-base font-medium mb-3">Registro Usuario</h2>
                </div>
            </div>
            <form class="flex flex-col gap-3" @submit.prevent="procesaRegistro">
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Nombre:</label>
                    <input v-model="form.nombre" type="text" required 
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                    
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Apellido(Opcional):</label>
                    <input v-model="form.apellido" type="text" 
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Email:</label>
                    <input v-model="form.email" type="email" required placeholder="johndoe@codibalto.es"
                        class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                    <label class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Nickname:</label>
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
                    <button type="submit" :disabled="loading"
                        class="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">
                        {{ loading ? 'Registrando...' : 'Guardar' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script >
import { register } from '../services/authService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default {
    setup() {
        const router = useRouter()
        const toast = useToast()
        return { router, toast }
    },
    data() {
        return {
            form: {
                nombre: '',
                apellido: '',
                email: '',
                username: '',
                password: '',
                passwordRepeat: ''
            },
            errorPassword: '',
            loading: false
        }
    },
    methods: {
        async procesaRegistro() {
            this.errorPassword = ''

            if (this.form.password !== this.form.passwordRepeat) {
                this.errorPassword = 'Las contraseñas no coinciden'
                return
            }

            try {
                this.loading = true
                await register(this.form.username, this.form.email, this.form.password, this.form.nombre, this.form.apellido)
                this.toast.success('Cuenta creada correctamente')
                this.router.push('/login')
            } catch (error) {
                const status = error.response?.status
                if (status === 409) {
                    this.errorPassword = 'Ya existe una cuenta con ese email'
                } else {
                    this.toast.error('[ERROR] Al crear la cuenta surgió un problema, inténtalo más tarde')
                }
            } finally {
                this.loading = false
            }
        }
    }
}
</script>