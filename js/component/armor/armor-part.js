export default {
  data() {
    return {
      hasArmor: false,
      armorDestroyed: false,
    }
  },

  computed: {
    armorHitpoints() {
      return this.hasArmor ? 1 : 0;
    },
  },
}
