<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <!-- Cabecera -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white font-semibold text-lg">{{ card.domain }}</h2>
                <button class="text-stone-400 hover:text-white" @click="$emit('close')">✕</button>
            </div>

            <!-- Datos -->
            <div class="flex flex-col gap-3">

                <!-- Email -->
                <div class="bg-stone-700 rounded-lg px-4 py-2">
                    <p class="text-xs text-stone-400 mb-0.5">Email</p>
                    <p class="text-white text-sm">{{ decrypted.email || 'Cargando...' }}</p>
                </div>

                <!-- Contraseña -->
                <div class="bg-stone-700 rounded-lg px-4 py-2 flex items-center justify-between">
                    <div>
                        <p class="text-xs text-stone-400 mb-0.5">Contraseña</p>
                        <p class="text-white text-sm font-mono">
                            {{ showPassword ? decrypted.password : '••••••••' }}
                        </p>
                    </div>
                    <button type="button" @click="showPassword = !showPassword"
                        class="text-stone-400 hover:text-white transition text-xs ml-4">
                        {{ showPassword ? 'Ocultar' : 'Ver' }}
                    </button>
                </div>

                <!-- Notas -->
                <div v-if="card.notes" class="bg-stone-700 rounded-lg px-4 py-2">
                    <p class="text-xs text-stone-400 mb-0.5">Notas</p>
                    <p class="text-white text-sm whitespace-pre-wrap">{{ card.notes }}</p>
                </div>

            </div>

            <!-- Cerrar -->
            <div class="flex justify-end mt-5">
                <button @click="$emit('close')"
                    class="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { decryptCard } from '@/services/cardService';

export default {
    name: 'CardDataModal',
    props: {
        card: { type: Object, required: true },
        password: { type: String, required: true }
    },
    data() {
        return {
            showPassword: false,
            decrypted: {
                password: '',
                email: ''
            }
        }
    },
    async mounted() {
        try {
            const secrets = await decryptCard(
                this.card.iv_ps,
                this.card.iv_em,
                this.card.email_card,
                this.card.cipher_password,
                this.password
            );
            this.decrypted = secrets;
        } catch (e) {
            console.error('Error descifrando card:', e);
        }
    }
}
</script>
