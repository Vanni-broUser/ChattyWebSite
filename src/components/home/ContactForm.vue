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
                  <v-text-field v-model="name" label="Nome dell'azienda *" :rules="requiredRules" />
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="5">
                  <v-text-field v-model="site" label="Sito web *" :rules="siteRules" />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="12">
                  <v-textarea 
                    label="Altre informazioni sulla tua azienda" v-model="info" rows="2"
                    hint="Più informazioni ci fornirai sulla tua azienda, più il tuo Chatty sarà efficente"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="5">
                  <v-text-field v-model="email" label="Email *" :rules="emailRules" />
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="5">
                  <v-text-field v-model="password" type="password" label="Password *" :rules="passwordRules" />
                </v-col>
              </v-row>
              <div v-if="error != ''" class="error-message">{{ error }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn variant="tonal" type="submit" block class="mt-2 gradient">Ottieni la tua demo</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-card elevation="20" class="form-container" v-else>
          <v-card-title style="white-space: normal;">Verifica la tua mail</v-card-title>
          <v-form @submit.prevent="verifyOtp">
            <v-card-text>
              <div style="text-align: center;">
                Abbiamo inviato una mail all'indirizzo {{ email }} con un codice OTP a 6 cifre.
              </div>
              <v-otp-input v-model="otp" type="password" />
              <div v-if="error != ''" class="error-message">{{ error }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn class="mt-2 gradient" type="submit" variant="tonal">Verifica</v-btn>
              <v-spacer></v-spacer>
              <div class="text-caption" v-if="flagOtpAgain">
                Non hai ricevuto nessun codice? <a href="#" @click.prevent="sendOtpAgain">Invia di nuovo</a>
              </div>
              <div class="text-caption" v-else>
                Non hai ricevuto nessun codice? Richiedi tra {{ timerOtpAgain }}
              </div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col class="timeline-container">
        <Timeline />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, onBeforeUnmount } from 'vue';
  import utils from '@/utils/utils';
  import { SHA256 } from 'crypto-js';
  import { useRouter } from 'vue-router';
  import Timeline from '@/components/home/Timeline';

  const otp = ref('');
  const site = ref('');
  const name = ref('');
  const info = ref('');
  const email = ref('');
  const error = ref('');
  const botId = ref('');
  const password = ref('');
  const router = useRouter();
  const timerOtpAgain = ref(60);
  const flagOtpAgain = ref(false);

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

  const verifyOtp = () => {
    if (otp.value) {
      error.value = '';
      const post = utils.postRequest({
        otp: otp.value,
        bot_id: botId.value
      });

      fetch(`${post.hostname}otp`, post.options)
        .then(response => {
          if (!response.ok)
            throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          if (data.status == 'ok')
            router.push(`/dashboard/${botId.value}`);
          else
            error.value = data.error;
        })
        .catch(error => {
          console.error('Errore nella richiesta:', error);
        });
    }
  };

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
        description: info.value,
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
  
            const timerOptInterval = setInterval(() => {
              if (!flagOtpAgain.value) {
                timerOtpAgain.value -= 1;
                if (timerOtpAgain.value == 0) {
                  flagOtpAgain.value = true;
                }
              }
            }, 1000);

            onBeforeUnmount(() => {
              clearInterval(timerOptInterval);
            });
          } else
            error.value = data.error;
        })
        .catch(error => {
          console.error('Errore nella richiesta:', error);
        });
    }
  };

  const sendOtpAgain = () => {
    flagOtpAgain.value = false;
    timerOtpAgain.value = 60;
    error.value = '';
    const post = utils.postRequest({
      bot_id: botId.value
    });

    fetch(`${post.hostname}send-otp-again`, post.options)
      .then(response => {
        if (!response.ok)
          throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
        return response.json();
      })
      .catch(error => {
        console.error('Errore nella richiesta:', error);
      });
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
