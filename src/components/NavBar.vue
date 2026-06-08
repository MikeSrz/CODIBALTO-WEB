<template>
    <nav class="bg-stone-800 text-white px-8 py-4 flex items-center justify-between">
        <RouterLink to="/home">
            <img src="../assets/LogoLight.svg" alt="Logo" class="hidden sm:block w-45" />
            <img src="../assets/only_logo.svg" alt="Logo" class="block sm:hidden w-8" />
        </RouterLink>
        <div class="flex items-center gap-6">
            <RouterLink to="/login" class="text-stone-300 hover:text-white transition">
                Login
            </RouterLink>
            <a href="https://github.com/MikeSrz" target="_blank" class="text-stone-300 hover:text-white transition">
                GitHub
            </a>
        </div>

    </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>