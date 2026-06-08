<template>
    <div class="relative" ref="wrapper">
        <button
            @click="showDropdown = !showDropdown"
            class="flex items-center justify-center w-12 h-12 rounded-md hover:bg-stone-700 transition cursor-pointer"
        >
            <img src="@/assets/user_icon.svg" alt="user-config" class="w-8" />
        </button>

        <div
            v-if="showDropdown"
            class="absolute right-0 top-[calc(100%+8px)] w-60 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl z-50 overflow-hidden"
        >
            <div class="flex items-center gap-3 px-4 py-3 border-b border-stone-200 dark:border-stone-700">
                <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {{ initials }}
                    </span>
                </div>
                <div class="min-w-0">
                    <p class="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                        {{ auth.user.nombre }} {{ auth.user.apellido }}
                    </p>
                    <p class="text-xs text-stone-500 dark:text-stone-400">@{{ auth.user.username }}</p>
                </div>
            </div>

            <div class="px-4 py-3">
                <div class="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800 mb-3">
                    <span class="text-xs text-stone-500 dark:text-stone-400">Contraseñas guardadas</span>
                    <span class="text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full">
                        {{ auth.user.passCards.length }}
                    </span>
                </div>
                <div class="flex gap-2">
                   <!-- <RouterLink
                        to="/user-options"
                        class="flex-1 text-xs text-center py-1.5 rounded-md border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                        @click="showDropdown = false"
                    >
                        Opciones
                    </RouterLink> Aun no está implementado-->
                    <button
                        @click="handleLogout"
                        class="flex-1 text-xs py-1.5 rounded-md border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
    setup() {
        const auth = useAuthStore()
        const router = useRouter()
        return { auth, router }
    },
    data() {
        return {
            showDropdown: false,
        }
    },
    computed: {
        initials(){
            const n = this.auth.user.nombre?.[0] ?? ''
            const a = this.auth.user.apellido?.[0] ?? ''
            return (n + a).toUpperCase() || '?'
        }
    },
    methods: {
        handleLogout() {
            this.showDropdown = false
            this.auth.clearAuth()
            this.router.push('/home')
        },
        handleClickOutside(e) {
            const el = this.$refs.wrapper
            if (el && !el.contains(e.target)) {
                this.showDropdown = false
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    }
}
</script>