import Vue from 'vue';
import {
  morphAge,
  morphCapitalize,
  morphDate,
  morphTruncate,
  morphUpperCase,
} from 'vue-morphling';

const morphs = {
  morphAge,
  morphCapitalize,
  morphDate,
  morphTruncate,
  morphUpperCase,
};

for (const key in morphs) {
  Vue.use(morphs[key]);
}
