<template>
    <nav class="bg-stone-800 text-white px-8 py-4 flex items-center justify-between">
        <RouterLink to="/home">
            <img src="../assets/LogoLight.svg" alt="Logo" class="hidden sm:block w-45" />
            <img src="../assets/only_logo.svg" alt="Logo" class="block sm:hidden w-8" />
        </RouterLink>
        <div class="flex items-center gap-6">
            <RouterLink to="/home" class="text-stone-300 hover:text-white transition" @click="auth.clearAuth">
                Logout
            </RouterLink>
            <a href="https://github.com/MikeSrz" target="_blank" class="text-stone-300 hover:text-white transition">
                GitHub
            </a>
            <RouterLink to="/user-options">
                <img src="../assets/user_icon.svg" alt="user-config" class="w-8">
            </RouterLink>
        </div>

    </nav>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
export default {
    setup(){
        const auth = useAuthStore();
        return {auth}; 
    },
}
</script>