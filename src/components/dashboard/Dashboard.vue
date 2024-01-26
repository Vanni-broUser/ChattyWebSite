<template>
    <v-sheet class="mx-auto login-box dashboard" elevation="20">
        <h2>{{ botData.name }} - Pacchetto {{ botData.plan }}</h2>
        <h1>{{ botData.monthly_thread_usage }} / {{ limit }} chat in questo mese</h1>
        <br><h3>Incolla questo script per integrare il bot nel tuo sito</h3>
        <div class="code-block">
            {{ code }}
            <v-btn density="comfortable" icon="mdi-content-copy" class="copy-button" @click="copyCode" />
        </div>
        <br><v-divider :thickness="3" /><br>
        <ModifyPanel @btnSetupBot="emitBtnSetupBot" />
        <br><v-divider :thickness="3" /><br>
        <h2>Visualizza le conversazioni avvenute con il bot</h2><br>
        <v-btn variant="outlined" type="submit" block class="mt-2 gradient" @click="emitBtnSetupBot">
            Vedi
        </v-btn>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue';
    import prices_list from '@/utils/prices';
    import ModifyPanel from '@/components/dashboard/ModifyPanel';

    const code = ref("Codice qui");
    const emit = defineEmits(['btnSetupBot']);
    const { botData } = defineProps(['botData']);
    const limit = ref(100);     // TEST_PLAN_THREADS_LIMIT
    const plan = prices_list.prices.find(plan => plan.name == botData.plan);
    if (plan)
        limit.value = parseInt(plan.features[0].text.split(' ')[0]);

    const emitBtnSetupBot = () => {
        emit('btnSetupBot');
    };

    const copyCode = () => {
      var textarea = document.createElement('textarea');
      textarea.value = code.value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    };
</script>

<style scoped>
    .dashboard {
        max-width: 1000px;
    }
    .code-block {
        background: #ECEFF1;
        color: #78909C;
        border-radius: 2px;  
        font-family: "helvetica", sans-serif;
        padding-left: 10px;
        line-height: 50px;
    }
    .copy-button {
        margin-top: 5px;
        margin-right: 10px;
        float: right;
    }
</style>
