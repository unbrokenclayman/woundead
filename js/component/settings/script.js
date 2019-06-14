export default {
  name: 'settings-widget',

  data() {
    return {
      settingsShown: false,
      hasHelmet: false,
      hasPlatecarrier: false,
    }
  },

  computed: {
    head() {
      return this.$root.$refs.body.$refs.head;
    },

    torso() {
      return this.$root.$refs.body.$refs.torso;
    },

    skin: {
      get() {
        return this.$root.skin;
      },
      set(value) {
        this.$root.skin = value;
      },
    },
  },

  watch: {
    hasHelmet() {
      this.head.hasArmor = this.hasHelmet == 'true';
    },

    hasPlatecarrier() {
      this.torso.hasArmor = this.hasPlatecarrier == 'true';
    },
  },

  methods: {
    toggleSettings() {
      this.settingsShown = !this.settingsShown;
    }
  },
};
