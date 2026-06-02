<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-stone-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <!-- Cabecera -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-xl font-bold">Editar Datos</h2>
                <button class="text-stone-400 hover:text-white" @click="$emit('close')">✕</button>
            </div>
        </div>
    </div>
</template>
<script>
</script>