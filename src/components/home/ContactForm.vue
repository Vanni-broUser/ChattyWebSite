<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="20" class="form-container" v-if="botId == ''">
          <v-card-title style="white-space: normal;">
            <div class="d-flex align-center justify-space-around">
              <v-avatar image="@/assets/logo.jpeg" size="120" />
            </div>
            <div>Registrati e richiedi una demo gratuita</div>
          </v-card-title>
          <v-form fast-fail @submit.prevent="askBot">
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12" md="5">
                  <v-text-field v-model="name" label="Nome dell'azienda" :rules="requiredRules" />
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="5">
                  <v-text-field v-model="site" label="Sito web" :rules="siteRules" />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="5">
                  <v-text-field v-model="email" label="Email" :rules="emailRules" />
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="5">
                  <v-text-field v-model="password" type="password" label="Password" :rules="passwordRules" />
                </v-col>
              </v-row>
              <div v-if="error != ''" class="error-message">{{ error }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn variant="tonal" type="submit" block class="mt-2 gradient">Ottieni la tua demo</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <OtpVerification :mail="email" :botId="botId" :home="true" v-else />
      </v-col>
      <v-col class="timeline-container">
        <Timeline />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import utils from '@/utils/utils';
  import { SHA256 } from 'crypto-js';
  import { ref } from 'vue';
  import Timeline from '@/components/home/Timeline';
  import OtpVerification from '@/components/shared/OtpVerification';

  const site = ref('');
  const name = ref('');
  const email = ref('');
  const error = ref('');
  const botId = ref('');
  const password = ref('');

  const requiredRules = [
    (value) => {
      if (value) return true;
      return 'Campo obbligatorio';
    },
  ];
  const emailRules = requiredRules.concat([
    (value) => {
      if (/.+@.+\..+/.test(value)) return true;
      return 'E-mail non valida.';
    }
  ]);
  const siteRules = requiredRules.concat([
    (value) => {
      if (/^(https?:\/\/)?([\w-]+\.)+([a-z]{2,})+(\/[\w-]*)*(\?[a-z0-9-]+=[a-z0-9-%]+(&[a-z0-9-]+=[a-z0-9-%]+)*)?$/i.test(value))
          return true;
      return 'Sito non valido.';
    }
  ]);
  const passwordRules = requiredRules.concat([
    (value) => {
      if (/[A-Z]/.test(value)) return true;
      return 'La password deve contenere almeno una lettera maiscola.';
    },
    (value) => {
      if (/[a-z]/.test(value)) return true;
      return 'La password deve contenere almeno una lettera minuscola.';
    },
    (value) => {
      if (/\d/.test(value)) return true;
      return 'La password deve contenere almeno un numero.';
    },
    (value) => {
      if (value.length >= 8) return true;
      return 'La password deve contenere almeno 8 caratteri.';
    }
  ]);

  const askBot = () => {
    if (
      !utils.validateInput(name.value, requiredRules) && !utils.validateInput(email.value, emailRules) &&
      !utils.validateInput(site.value, siteRules) && !utils.validateInput(password.value, passwordRules)
    ) {
      error.value = '';
      const post = utils.postRequest({
        name: name.value,
        email: email.value,
        website: site.value,
        password: SHA256(password.value).toString()
      });

      fetch(`${post.hostname}ask-bot`, post.options)
        .then(response => {
          if (!response.ok)
            throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          if (data.status == 'ok') {
            botId.value = data.bot_id;
          } else
            error.value = data.error;
        })
        .catch(error => {
          console.error('Errore nella richiesta:', error);
        });
    }
  };
</script>

<style scoped>
  .form-container {
    max-width: 1100px;
    padding: 10px;
    margin: auto;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .timeline-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
