<template>
        <NavBar/>
        <RegisterForm />
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import RegisterForm from '@/components/RegisterForm.vue';
export default {
    components: {
        RegisterForm,
        NavBar
    }
}
</script>