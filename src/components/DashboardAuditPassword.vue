<template>
    <div class="mt-6">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div
                v-for="(test, key) in results"
                :key="key"
                class="flex flex-col gap-1"
            >
                <dt class="text-[10px] text-stone-200 uppercase tracking-widest truncate">
                    {{ test.label }}
                </dt>
                <dd
                    v-if="test.security_level"
                    :class="[
                        'text-xs leading-snug',
                        {
                            'text-emerald-500': test.security_level === 'high',
                            'text-amber-500':   test.security_level === 'mid',
                            'text-red-500':     test.security_level === 'low',
                        }
                    ]"
                >
                    {{ messages[key][test.security_level] }}
                </dd>
                <dd v-else class="text-xs text-stone-700">—</dd>

                <!-- Breach count solo en breaches -->
                <span
                    v-if="key === 'breaches' && breachCount != null && breachCount > 0"
                    class="text-[10px] text-stone-200"
                >
                    {{ breachCount.toLocaleString() }} encuentros
                </span>
            </div>
        </dl>
    </div>
</template>

<script>
export default {
    props: {
        password:     { type: String, required: true },
        auditResults: { type: Object, required: true },
        breachCount:  { type: Number },
    },
    data() {
        return {
            messages: {
                length: {
                    high: 'La contraseña tiene una longitud adecuada.',
                    mid:  'La contraseña es algo corta, considera alargarla.',
                    low:  'La contraseña es demasiado corta.',
                },
                diversity: {
                    high: 'Buena variedad de caracteres.',
                    mid:   'Diversidad media, combina más tipos.',
                    low:  'Diversidad insuficiente, mezcla mayuscuñlas, minusculas, numeros y simbolos especiales.',
                },
                entropy: {
                    high: 'La entropía es suficientemente alta.',
                    mid:  'La entropía es moderada.',
                    low:  'La entropía es muy baja, la contraseña es predecible.',
                },
                patterns: {
                    high: 'No se detectaron patrones predecibles.',
                    mid:  'Se detectó algún patrón leve como secuencias cortas.',
                    low:  'La contraseña sigue un patrón muy predecible (ej. "abc123").',
                },
                breaches: {
                    high: 'No aparece en filtraciones de datos conocidas.',
                    mid:  'Aparece en un número reducido de filtraciones.',
                    low:  'Encontrada en filtraciones conocidas.',
                },
            },
        }
    },
    computed: {
        results() {
            return {
                length:    { security_level: this.auditResults.length,    label: 'Length test' },
                diversity: { security_level: this.auditResults.diversity, label: 'Character diversity' },
                entropy:   { security_level: this.auditResults.entropy,   label: 'Entropy analysis' },
                patterns:  { security_level: this.auditResults.patterns,  label: 'Pattern detection' },
                breaches:  { security_level: this.auditResults.breaches,  label: 'Breach database lookup' },
            }
        },
    },
}
</script>