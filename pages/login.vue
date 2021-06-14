<template>
  <div>
    <h1>Δ_cØuⁿt</h1>
    <div class="text-center">
      <v-btn id="log_in" v-ripple="false" class="rounded-t-xl" color="primary" @click="setMode('log_in')">
        log_in
      </v-btn>
      <v-btn id="sign_up" v-ripple="false" class="rounded-t-xl" color="error" @click="setMode('sign_up')">
        sign_up
      </v-btn>
    </div>
    <v-card class="rounded-b-xl" :color="mode==='log_in' ? 'primary' : 'error'">
      <v-card-text>
        <v-text-field
          v-model="email"
          class="white"
          color="black"
          label="Email"
          outlined
        />
        <br>
        <v-text-field
          v-model="password"
          class="white"
          color="black"
          label="Password"
          type="password"
          outlined
          @keydown.enter="handleLogin"
        />
        <br>
        <v-text-field
          v-if="mode==='sign_up'"
          v-model="passwordConfirm"
          class="white"
          color="black"
          label="Confirm password"
          type="password"
          outlined
          @keydown.enter="handleSignup"
        />
        <br v-if="mode==='sign_up'">
        <div class="foot">
          <v-btn v-if="mode==='log_in'" @click="handleLogin">
            Log_in
          </v-btn>
          <v-btn v-else @click="handleSignup">
            Sign_up
          </v-btn>

          <div class="err">
            {{ error }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'blank',

  data () {
    return {
      mode: 'log_in',
      email: '',
      password: '',
      passwordConfirm: '',
      error: ''
    }
  },

  computed: {
    ...mapState('auth', ['user'])
  },

  watch: {
    user (value) {
      if (value) {
        this.$router.push('/')
      }
    }
  },

  created () {
    if (this.user) {
      this.$router.push('/')
    }
  },

  methods: {
    async handleLogin () {
      this.error = ''
      try {
        await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
      } catch (err) {
        this.error = err.message
      }
    },

    async handleSignup () {
      this.error = ''
      if (this.password === this.passwordConfirm) {
        try {
          await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
        } catch (err) {
          this.error = err.message
        }
      } else {
        this.error = 'Las contraseñas no coinciden'
      }
    },

    setMode (mode) {
      this.mode = mode
    }
  }
}
</script>

<style scoped>
h1 {
  width: 100%;
  text-align: center;
  font-size: 7em;
  padding: 7vh 0px;
  color: green;
}

#log_in {
  width: 49.7%;
  height: 3.5em;
}

#sign_up {
  width: 49.7%;
  height: 3.5em;
}

.white {
  background-color: white;
  height: 56px;
}

.foot {
  display: flex;
  justify-content: space-between;
}

.err {
  position: absolute;
  bottom: 22px;
  right: 20px;
  max-width: 70%;
}
</style>
