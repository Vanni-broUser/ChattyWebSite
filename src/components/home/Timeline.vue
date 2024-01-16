<template>
    <v-container>
        <v-timeline align="start" side="end" class="timeline-color">
            <v-timeline-item dot-color="#49246E">
                <template v-slot:opposite>
                    Step 1
                </template>
                <div>
                    <div class="text-h6">Richiedi una demo</div>
                    <p>
                        Compila il form per richiedere un bot fatto ad hoc sulla tua azienda, il bot sarà attivato in due giorni lavorativi e sarà basato sulle
                        informazioni che ci condividi e su quello che è scritto sul tuo sito.
                    </p>
                </div>
            </v-timeline-item>
            <v-timeline-item dot-color="#49246E">
                <template v-slot:opposite>
                    Step 2
                </template>
                <div>
                    <div class="text-h6">Prova il tuo Chatty</div>
                    <p>
                        Sperimenta la demo sul nostro sito e inizia a scambiare le prime parole con il tuo assistente virtuale.
                    </p>
                </div>
            </v-timeline-item>
            <v-timeline-item dot-color="#49246E">
                <template v-slot:opposite>
                    Step 3
                </template>
                <div>
                    <div class="text-h6">Effettua l'integrazione</div>
                    <p>
                        Dopo la demo potrai richiedere eventuali modifiche al tuo bot se necessarie. Successivamente si procederà con l'integrazione nel tuo sito
                        attraverso un semplice script.
                    </p>
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script setup>
    //
</script>

<style scoped>
    .timeline-color {
        color: white;
    }
</style>
