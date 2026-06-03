<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <!-- Cabecera -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-xl font-bold">Nueva contraseña</h2>
                <button class="text-stone-400 hover:text-white" @click="$emit('close')">✕</button>
            </div>
            <!-- Formulario -->
            <form @submit.prevent="addCard" class="flex flex-col gap-4">
                <input v-model="form.domain" type="text" required placeholder="google.com"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>

                <input v-model="form.password" type="password" required minlength="8" placeholder="••••••••"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                <input v-model="form.email_card" type="email" required minlength="6" placeholder="johndoe@gmail.es"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>

                <textarea v-model="form.notes" placeholder="Notas (opcional)" rows="3" maxlength="500"
                    class="w-full bg-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"/>

                <div class="flex justify-end gap-3 mt-2">
                    <button type="button" class="text-stone-400 hover:text-white px-4 py-2 transition" @click="$emit('close')">
                        Cancelar
                    </button>
                    <button type="submit"
                        @click="addCard"
                        class="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded-lg transition">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import { storeCard } from '@/services/cardService';

export default {
    emits: ['close', 'password'],
    props: {
        password: { type: String, required: true }
    },
    data() {
        return {
            form : {
                password: '',
                email_card: '',
                domain: '',
                notes: ''
            }
        }
    },
    methods:{
        addCard(){
            if(this.checkForm()){ 
                //Tengo que cifrar contraseñas, email antes de enviar.
                storeCard(this.form, this.password)
                this.$emit('close')
            } else
                console.warn("No se han ingresado los campos obligatorios") 
        },
        checkForm() {
             if (!this.form.domain || !this.form.password) {
                return false;
            }
            return true
        }
    }
}
</script>