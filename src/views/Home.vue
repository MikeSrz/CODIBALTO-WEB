<template>
    <NavBarUser v-if="auth.isAuthenticated" />
    <NavBar v-else/>
    <h2 v-if="auth.isAuthenticated" class="bg-stone-900 text-white text-center py-10 text-3xl font-bold"> Hola, {{ capitalize(userInfo.nombre) }} </h2>
    <div class="min-h-screen bg-stone-900 text-white p-8">
        <ul class="flex flex-col gap-4">
            <RouterLink to="/registro" v-if="!auth.isAuthenticated">
                <li class="group bg-stone-800 rounded-lg p-6 hover:bg-indigo-800 transition">
                    <h2 class="text-lg font-semibold mb-1 group-hover:text-white">Registrarse</h2>
                    <p class="text-stone-400 text-sm group-hover:text-white">Crea tu cuenta de forma segura con autenticación criptográfica.</p>
                </li>
            </RouterLink>
            <RouterLink to="/password-vault" v-if="auth.isAuthenticated">
                <li class="group bg-stone-800 rounded-lg p-6 hover:bg-indigo-800 transition">
                    <h2 class="text-lg font-semibold mb-1 group-hover:text-white">Vault de contraseñas</h2>
                    <p class="text-stone-400 text-sm group-hover:text-white">Guarda y gestiona todas tus contraseñas en un lugar seguro y cifrado.</p>
                </li>
            </RouterLink>

            <li class="bg-stone-800 rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-1">Auditor de contraseñas</h2>
                <p class="text-stone-400 text-sm">Analiza la seguridad de tus contraseñas y detecta las más vulnerables.</p>
            </li>
        </ul>
    </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import NavBarUser from '@/components/NavBarUser.vue';
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts';
import { capitalize } from '@/services/utils.ts';
export default {
    components: {
        NavBar,
        NavBarUser
    },
    setup(){
        const auth = useAuthStore()
        const userInfo = auth.user
        return {auth, userInfo, capitalize}
    }
}
</script>