<template lang="pug">
  div
    h2.mb-4 E-Signature
    v-card(flat)
      v-progress-linear(
        v-model="progress"
        height="4"
        color="success"
        v-if="loading"
      )
      v-card-text
        v-layout(row justify-center)
          v-flex(xs12 md4).text-xs-center
            img(width="100%" :src="eSig.doc_eSignatureURL").elevation-1
        v-layout(row justify-center)
          v-flex(xs12 md4).text-xs-center
            input(type="file" style="display:none;" ref="eSigInput" @change="eSigFileChange" )
        v-layout(row)
          v-flex(xs12 md6).pa-1.text-xs-center
            v-btn(
              @click="openESigFileInput"
              color="success"
              :disabled="loading"
              :loading="loading"
              small
              block
            )
              v-icon mdi-cloud-upload-outline
              | &nbsp;Upload {{eSig && eSig.doc_eSignatureURL ? 'New' : ''}} E-Signature
          v-flex(xs12 md6).pa-1.text-xs-center
            v-btn(
              @click="drawDialog = true"
              color="primary"
              :disabled="loading"
              :loading="loading"
              small
              block
            ) Draw
    v-dialog(v-model="drawDialog" width="530" lazy persistent)
      v-card
        v-card-text
          small.mb-3 SIGN IN THE BOX BELOW
          drawing-board(
            ref="canvasRef"
            :pencilColor="'black'"
            :pencilSize="2"
            :canvasWidth="500"
            :canvasHeight="300"
            @save="save"
            style="outline: 1px solid grey;"
          )
        v-divider
        v-card-actions
          v-btn(
            color="error"
            flat
            @click="$refs.canvasRef.clear();"
          ) Clear drawing
          v-spacer
          v-btn(
            color="success"
            @click="$refs.canvasRef.save(); drawDialog = false;"
          ) Save
          v-btn(
            color="error"
            flat
            @click="drawDialog = false; $refs.canvasRef.init();"
          ) Cancel
</template>

<script>
import DrawingBoard from '../commons/canvas';

export const COMPONENT_NAME = 'pd-e-signature';

export default {
  components: {
    DrawingBoard
  },
  props: {
    eSig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    uid: String
  },
  data () {
    return {
      loading: false,
      drawDialog: false,
      progress: 0
    };
  },
  methods: {
    openESigFileInput () {
      this.$refs.eSigInput.click();
    },
    async save (base64) {
      try {
        const uploadTask = await this.$store.dispatch('websiteOnboarding/personalDetailsUpload', { uid: this.uid, file: base64 });
        let payload = {};
        let that = this;
        uploadTask.subscribe({
          next (data) {
            that.loading = true;
            if (!data.done) {
              that.progress = data.progress;
            } else {
              that.eSig.doc_eSignatureURL = base64;
              payload.doc_eSignatureURL = base64;
            }
          },
          async complete () {
            await that.$store.dispatch('personalDetails/updatePersonalDetails', { uid: that.uid, payload });
            that.loading = false;
            that.$enqueueSnack({
              message: 'E-signature saved!',
              color: 'success'
            });
            that.$refs.canvasRef.clear();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    eSigFileChange (file) {
      try {
        if (!file.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
          window.alert('Invalid image file. Must be either JPG, JPEG, PNG or GIF');
          file.target.value = null;
          return;
        }

        let that = this;

        var reader = new window.FileReader();
        reader.readAsDataURL(file.target.files[0]);
        reader.onload = async () => {
          const uploadTask = await this.$store.dispatch('websiteOnboarding/personalDetailsUpload', { uid: this.uid, file: reader.result });
          let payload = {};
          uploadTask.subscribe({
            next (data) {
              that.loading = true;
              if (!data.done) {
                that.progress = data.progress;
              } else {
                that.eSig.doc_eSignatureURL = data.url;
                payload.doc_eSignatureURL = data.url;
              }
            },
            async complete () {
              await that.$store.dispatch('personalDetails/updatePersonalDetails', { uid: that.uid, payload });
              that.loading = false;
              that.$enqueueSnack({
                message: 'E-signature saved!',
                color: 'success'
              });
            }
          });
        };
        reader.onerror = (error) => {
          console.log('Error: ', error);
        };
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

