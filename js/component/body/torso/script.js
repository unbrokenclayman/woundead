import Vue from 'vue';
import bodyPart from '../body-part';
import bodyArmor from '../../armor/body-armor/body-armor.vue';

export default Vue.extend({
  mixins: [bodyPart, bodyArmor],
  name: 'unit-torso',
  data() {
    return {
      hitpoints: 1,
      hasArmor: true,
    }
  },
});
