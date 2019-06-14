import UnitHead from './head/head.vue';
import UnitArm from './arm/arm.vue';
import UnitTorso from './torso/torso.vue';
import UnitLeg from './leg/leg.vue';

export default {
  name: 'human-body',

  components: {
    UnitHead,
    UnitArm,
    UnitTorso,
    UnitLeg,
  },

  computed: {
    skinClass() {
      return this.$root.skin + '-skin';
    },
  },
};
