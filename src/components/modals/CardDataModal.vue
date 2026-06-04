<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <h2 class="text-stone-100 text-base font-medium mb-3">Datos de su contraseña</h2>
                </div>
                <button class="w-7 h-7 rounded-md border border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/5 flex items-center justify-center text-sm transition" @click="$emit('close')" aria-label="Cerrar">✕</button>
            </div>

            <!-- Datos -->
                 <div class="flex flex-col gap-3">
                <div class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    <p class="text-xs text-stone-400 mb-0.5">Dominio</p>
                    <p class="text-white text-sm">{{ card.card_site.domain || 'Cargando...' }}</p>
                </div>
                
                <div class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    <p class="text-xs text-stone-400 mb-0.5">URL</p>
                    <p class="text-white text-sm">{{ card.card_site.site || 'Cargando...' }}</p>
                </div>

                <!-- Email -->
                <div class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    <p class="text-xs text-stone-400 mb-0.5">Email</p>
                    <p class="text-white text-sm">{{ decrypted.email || 'Cargando...' }}</p>
                </div>

                <!-- Contraseña -->
                <div class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between">
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
                <div v-if="card.notes" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
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
