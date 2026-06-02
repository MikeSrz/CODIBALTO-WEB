<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-stone-800 rounded-lg p-8 w-full max-w-md ">
            <RegisterForm/>
        </div>
    </div>
</template>
<script>
import RegisterForm from '@/components/RegisterForm.vue';
export default {
    components: {
        RegisterForm
    }
}
</script>