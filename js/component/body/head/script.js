import Vue from 'vue';
import bodyPart from '../body-part';
import helmetArmor from '../../armor/helmet/helmet.vue';

export default Vue.extend({
  mixins: [bodyPart, helmetArmor],
  name: 'unit-head',
  data() {
    return {
      hitpoints: 0,
      // hasArmor: true,
    }
  },
});
