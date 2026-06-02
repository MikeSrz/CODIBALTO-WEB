<template>
    <NavBar/>
    <div class="min-h-screen bg-stone-900 flex items-center justify-center">
        <div class="bg-stone-800 rounded-lg p-8 w-full max-w-md">
            <LoginForm/>
            <h2 class="text-stone-300">
                Si no tienes cuenta puedes 
                <router-link 
                    to="/registro"
                    class="text-blue-400 hover:text-blue-300 underline ">
                    registrarte
                </router-link>
            </h2>
        </div>
    </div>
</template>
<script>
import LoginForm from '../components/LoginForm.vue'
import NavBar from '@/components/NavBar.vue';
export default {
    components: {
        LoginForm,
        NavBar
    }
}
</script>
