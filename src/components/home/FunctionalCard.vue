<template>
    <v-container>
        <v-card class="mx-auto" elevation="20">
            <v-img
                class="align-end text-white"
                height="200"
                src="@/assets/open-ai.png"
                cover
            />
            <v-card-title>Funzionamento</v-card-title>
            <v-card-text>
                <div>Chatty funziona per mezzo della tecnologia LLM sviluppata da OpenAi con ChatGPT.</div>
                <div>L'azienda americana, leader nel settore delle AI, ha dato da poco la possibilità agli utenti di creare assistenti personalizzati con knowledge base ad hoc.</div>
                <div>I nostri sistemi sfruttano queste nuove tecnologie per creare chat-bot intelligenti in grado di portare a termine compiti complessi.</div>
            </v-card-text>
            <v-card-actions>
                <a href="https://platform.openai.com/docs/introduction"><v-btn>
                    Scopri di più
                </v-btn></a>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
    //
</script>

<style scoped>
    a {
        color: inherit;
    }
</style>
