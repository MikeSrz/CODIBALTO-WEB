<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <!-- Cabecera -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-xl font-bold">Nueva contraseña</h2>
                <button class="text-stone-400 hover:text-white" @click="$emit('close')">✕</button>
            </div>
            <!-- Formulario -->
            <form @submit.prevent="addCard" class="flex flex-col gap-4">
                <input v-model="form.tagname" type="text" required placeholder="Tagname"
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>

                <input v-model="form.card_site.domain" type="text" placeholder="google.com"
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                <input v-model="form.card_site.site" type="text" placeholder="https://www.wikipedia.org (opcional)"
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>

                <input v-model="form.password" type="password" required minlength="8" placeholder="••••••••"
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>
                
                <input v-model="form.email_card" type="email" required minlength="6" placeholder="johndoe@gmail.es"
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>

                <textarea v-model="form.notes" placeholder="Notas (opcional)" rows="3" maxlength="500"
                    class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"/>

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
                tagname: '',
                password: '',
                email_card: '',
                tagname: '',
                notes: '',
                card_site: {
                    site: '',
                    domain: ''
                }
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
             if (!this.form.tagname || !this.form.password || !this.form.email_card || !this.form.card_site.domain) {
                return false;
            }
            return true
        }
    }
}
</script>