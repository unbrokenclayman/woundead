import Vue from 'vue';
import armorPart from '../armor-part';

export default Vue.extend({
  mixins: [armorPart],
  name: 'body-armor',
  computed: {
    armorHitpoints() {
      return this.hasArmor ? 2 : 0;
    },
  },
});
