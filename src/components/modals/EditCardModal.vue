<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <!-- Cabecera -->
            <div class="flex justify-between items-center mb-4">
                <button class="text-stone-400 hover:text-white" @click="$emit('close')">✕</button>
            </div>
            <!-- Formulario -->
            <form @submit.prevent="addCard" class="flex flex-col gap-4">
                <div
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    <p>{{ form.domain }}</p>
                </div>
                <input v-model="form.password" type="password" required minlength="8" :placeholder="decrypted.password"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />

                <input v-model="form.email_card" type="email" required minlength="6" :placeholder="decrypted.email"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />

                <textarea v-model="form.notes" placeholder="Notas (opcional)" rows="3" maxlength="500"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />

                <div class="flex justify-end gap-3 mt-2">
                    <button type="button" class="text-stone-400 hover:text-white px-4 py-2 transition"
                        @click="$emit('close')">
                        Cancelar
                    </button>
                    <button type="submit" @click="addCard"
                        class="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded-lg transition">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import { useAuthStore } from '@/stores/auth';
import { decryptCard } from '@/services/cardService';

export default {
    name: 'EditCardModal',
    props: {
        card: { type: Object, required: true },
        password: { type: String, required: true }
    },
    data() {
        return {
            form: {
                password: '',
                email_card: '',
                domain: '',
                notes: ''
            },
            decrypted: {
                password: '••••••••',
                email: 'Cargando...'
            }
        }
    },
    async mounted() {
        this.form.domain = this.card.domain;
        this.form.notes = this.card.notes ?? '';

        try {
            const secrets = await decryptCard(
                this.card.iv_ps,
                this.card.iv_em,
                this.card.email_card,       // ciph_mail
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