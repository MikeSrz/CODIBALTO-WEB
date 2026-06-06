<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-900 border border-white/[0.08] rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <!-- Cabecera -->
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <h2 class="text-stone-100 text-base font-medium mb-3">Edición de datos de su contraseña</h2>
                </div>
                <button class="w-7 h-7 rounded-md border border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/5 flex items-center justify-center text-sm transition" @click="$emit('close')" aria-label="Cerrar">✕</button>
            </div>
            <!-- Formulario -->
            <form @submit.prevent="addCard" class="flex flex-col gap-3">
                <label for="card-site" class="block text-xs font-medium text-stone-300 uppercase tracking-widest">tagname: </label>
                <input v-model="form.tagname" type="text" minlength="5" :placeholder="card.tagname" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />

                <label for="card-site" class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Dominio: </label>
                <input v-model="form.card_site.domain" type="text" minlength="5" :placeholder="card.card_site.domain" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />

                <label for="card-site" class="block text-xs font-medium text-stone-300 uppercase tracking-widest">URL(opcional): </label>
                <input v-model="form.card_site.site" type="text" minlength="5" :placeholder="card.card_site.site" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                
                <label for="password" class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Edita la Contaseña: </label>
                <input v-model="form.password" type="password" minlength="8" :placeholder="decrypted.password" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                
                <label for="password" class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Edite el email:  </label>
                <input v-model="form.email_card" type="email" minlength="6" :placeholder="decrypted.email" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                
                <label for="notes" class="block text-xs font-medium text-stone-300 uppercase tracking-widest">Edite las observaciones:  </label>
                <textarea v-model="form.notes" placeholder="Notas (opcional)" rows="3" maxlength="500" class="w-full bg-stone-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />

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
import { decryptCard, modifyCard } from '@/services/cardService';

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
                tagname: '',
                notes: '',
                card_site: {
                    domain : '',
                    site: ''
                }
            },
            decrypted: {
                password: '••••••••',
                email: 'Cargando...'
            }
        }
    },
    async mounted() {
        this.form.tagname = this.card.tagname;
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
    },
    methods: {
        async addCard() {
            console.log(this.card.tagname)
            const payload = {
                tagname: this.form.tagname,
                cipher_password:    this.form.password    || this.decrypted.password, //aun no está cifrado
                email_card:  this.form.email_card  || this.decrypted.email,
                notes:       this.form.notes,
                iv_em:       this.card.iv_em,
                iv_ps:       this.card.iv_ps,
                id:          this.card.id,
                card_site:{
                    domain: this.card.card_site.domain,
                    site: this.card.card_site.site
                } 
            }
            await modifyCard(payload, this.password);
            this.$emit('close');
        }
    }
}
</script>