import Vue from 'vue';
import bodyPart from '../body-part';

export default Vue.extend({
  mixins: [bodyPart],
  name: 'unit-head',
  data() {
    return {
      hitpoints: 0,
    }
  },
});
