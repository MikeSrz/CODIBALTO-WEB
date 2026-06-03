<template>
    <div class="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-2xl">

            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-[17px] h-[17px] text-indigo-400"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M12 3a9 9 0 0 0-9 9v.6l2.8 5.4A2 2 0 0 0 7.6 19H9v-7h6v7h1.4a2 2 0 0 0 1.8-1l2.8-5.4V12a9 9 0 0 0-9-9z" />
                        </svg>
                    </div>
                    <h2 class="text-stone-100 text-base font-medium">Verificación de seguridad</h2>
                </div>
                <button
                    class="w-7 h-7 rounded-md border border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/5 flex items-center justify-center text-sm transition"
                    @click="$emit('close')" aria-label="Cerrar">✕</button>
            </div>

            <p class="text-stone-400 text-sm mb-5 leading-relaxed">
                Ingresa tu contraseña para confirmar esta operación.
            </p>

            <!-- Formulario -->
            <form @submit.prevent="verifyPassword">
                <div class="mb-5">
                    <label for="password"
                        class="block text-xs font-medium text-stone-300 uppercase tracking-widest mb-2">
                        Contraseña
                    </label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                            placeholder="••••••••••••"
                            class="w-full bg-stone-950 border rounded-lg px-3.5 pr-10 py-2.5 text-stone-100 text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 transition"
                            :class="error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'" />
                        <button type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition"
                            @click="showPassword = !showPassword" aria-label="Mostrar contraseña">
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        </button>
                    </div>
                    <p v-if="error" class="text-red-400 text-xs mt-2">{{ error }}</p>
                </div>

                <!-- Botón -->
                <button type="submit" :disabled="loading"
                    class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5 transition">
                    <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    {{ loading ? 'Verificando...' : 'Verificar' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { quickAuth } from '@/services/authService';

export default {
    emits: ['close', 'verified'],

    data() {
        return {
            password: '',
            showPassword: false,
            error: '',
            loading: false,
        }
    },

    methods: {
        async verifyPassword() {
            this.error = '';
            this.loading = true;
            try {
                const valido = await quickAuth(this.password);
                if (valido) {
                    this.$emit('verified', this.password);
                    this.$emit('close');
                } else {
                    this.error = 'Contraseña no válida. Inténtalo de nuevo.';
                }
            } catch {
                this.error = 'Error al verificar. Inténtalo de nuevo.';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>