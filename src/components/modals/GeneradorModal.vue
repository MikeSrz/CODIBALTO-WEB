<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-lg shadow-2xl">

            <div class="flex justify-between items-center mb-6">
                <h2 class="text-stone-100 text-base font-medium">Generador de Contraseñas</h2>
                <button
                    class="w-7 h-7 rounded-md border border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/5 flex items-center justify-center text-sm transition"
                    @click="$emit('close')"
                    aria-label="Cerrar"
                >✕</button>
            </div>

            <div class="flex flex-col gap-3">

                <!-- Contraseña -->
                <div class="w-full bg-stone-950 rounded-lg px-4 py-2 flex items-center justify-between">
                    <div>
                        <p class="text-xs text-stone-400 mb-0.5">Contraseña</p>
                        <p class="text-white text-sm font-mono">
                            {{ showPassword ? generatedPassword : '••••••••' }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 ml-4">
                        <!-- Desplegable de longitud -->
                        <select
                            v-model="selectedLength"
                            @change="generateNewPassword(selectedLength)"
                            class="bg-stone-800 text-stone-300 text-xs rounded-md px-2 py-1 border border-white/10 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option :value="16">16</option>
                            <option :value="32">32</option>
                        </select>

                        <!-- Ver/Ocultar -->
                        <button type="button"
                            class="text-stone-500 hover:text-stone-300 transition"
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
                </div>
            </div>

            <div class="flex justify-end mt-5 gap-2">
                <button type="button" @click="copyToClipboard()"
                    class="text-stone-400 hover:text-white transition text-xs"
                >
                {{ copied ? 'Copiado!' : 'Copiar' }}
                </button>
                <button @click="generateNewPassword(selectedLength)"
                    class="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition">
                    Generar
                </button>
                <button
                    @click="$emit('close')"
                    class="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { generatePassword } from '@/services/passwordService';
export default {
    emits: ['close'],
    data() {
        return {
            showPassword: false,
            generatedPassword: '',
            selectedLength: 16,
            copied: false
        }
    },
    mounted() {
        this.generatedPassword = generatePassword(this.selectedLength)
    },
    methods: {
        generateNewPassword(len) {
            this.generatedPassword = generatePassword(len)
        },
        async copyToClipboard() {
            await navigator.clipboard.writeText(this.generatedPassword)
            this.copied = true
            setTimeout(() => this.copied = false, 2000)
        }
    }
}
</script>