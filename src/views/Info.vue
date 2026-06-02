<template>
  <div>
    <NavBarUser v-if="authStore.isAuthenticated"/>
    <NavBar v-else/>
    <h1>Página de información</h1>
    <p>Información de la aplicación.</p>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import NavBarUser from '@/components/NavBarUser.vue';
import { useAuthStore } from '@/stores/auth.ts';
export default {
    components: {
        NavBar,
        NavBarUser
    },
    setup(){
        const authStore = useAuthStore()
        return {authStore};
    }
}
</script>