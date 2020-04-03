<template lang="pug">
  v-container
    v-layout(row justify-center align-center)
      v-flex(xs12 md8)
        v-card(v-if="!isMounting" flat)
          v-card-text
            h2.text-xs-center Would you like to accept this invitation?
          v-card-actions
            v-spacer
            v-btn(
              large
              depressed
              :loading="loading"
              @click.stop="accept"
            ).text-none.primary Confirm
            v-btn(
              large
              flat
              :disabled="loading"
              @click.stop="decline"
            ).text-none.error--text Cancel
            v-spacer
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    isMounting: true,
  }),
  async beforeMount () {
    // TODO: put this in the route guard somehow
    if (!this.$currentUser) {
      return this.$router.push({
        path: '/signin?target=' + this.$route.fullPath,
      });
    }

    if (!this.id) {
      return this.$router.push({ path: '/notfound' });
    }
  },
  async mounted () {
    try {
      const invitation = await this.$sdk.service('account-invitations').findOne({ id: this.id });
      if (!invitation) this.$router.push({ path: '/' });
    } catch (error) {
      this.$snack(error);
    } finally {
      this.isMounting = false;
    }
  },
  methods: {
    async accept () {
      this.loading = true;
      try {
        await this.$sdk.service('account-invitations').update(this.id, { accept: true });
        this.$snack({
          text: 'Confirmation is successful!',
          color: 'success',
        });
        this.$router.push({ path: '/' });
      } catch (error) {
        this.$snack(error);
      } finally {
        this.loading = false;
      }
    },
    decline () {
      this.$router.push({ path: '/' });
    },
  },
};
</script>
