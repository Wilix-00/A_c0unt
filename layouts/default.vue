<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title v-text="title" />

      <v-spacer />

      <v-btn color="error" @click="handleLogout">
        Log_out
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container v-if="user">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      title: 'Δ_cØuⁿt'
    }
  },

  computed: {
    ...mapState('auth', ['user'])
  },

  watch: {
    user (value) {
      if (value === null) {
        this.$router.push('/login')
      }
    }
  },

  created () {
    if (this.user === null) {
      this.$router.push('/login')
    }
  },

  methods: {
    async handleLogout () {
      // try {
      await this.$fire.auth.signOut()
      // } catch (err) {
      //   console.error(err)
      // }
    }
  }
}
</script>
