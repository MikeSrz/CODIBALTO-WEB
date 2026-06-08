<template>
    <div class="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div class="flex items-center justify-between mb-3">
                <h2 class="text-stone-100 text-base font-medium">Borrar Contraseña</h2>
                <button class="w-7 h-7 rounded-md border border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/5 flex items-center justify-center text-sm transition" @click="$emit('close')" aria-label="Cerrar">✕</button>
            </div>

            <p class="text-stone-400 text-sm mb-5 leading-relaxed">Los cambios no se podrán revertir</p>

            <div class="flex justify-end gap-2">
                <button
                    class="px-4 py-2 rounded-lg text-sm text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-white/10 transition"
                    @click="$emit('close')"
                >
                    Cancelar
                </button>
                <button class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-800 text-white transition" @click="deleteCard()">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteCard } from '@/services/cardService';
export default {
    emits: ['close', 'confirm'],
    props: {
        card: { type: Object, required: true },
        password: { type: String, required: true }
    },
    methods: {
        async deleteCard(){
            await deleteCard(this.card.id)
            this.$emit('close')
        }
    }

}
</script>