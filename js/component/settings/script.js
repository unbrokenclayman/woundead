const SKIN_KEY = 'WOUNDEAD_SKIN';
const PLATECARRIER_KEY = 'WOUNDEAD_PLATECARRIER';
const HELMET_KEY = 'WOUNDEAD_HELMET';
const RULES_KEY = 'WOUNDEAD_RULES';

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

    rules: {
      get() {
        return this.$root.rules;
      },
      set(value) {
        this.$root.rules = value;
      },
    },
  },

  watch: {
    hasHelmet() {
      this.head.hasArmor = this.hasHelmet == 'true';
      localStorage.setItem(HELMET_KEY, this.hasHelmet);
    },

    hasPlatecarrier() {
      this.torso.hasArmor = this.hasPlatecarrier == 'true';
      localStorage.setItem(PLATECARRIER_KEY, this.hasPlatecarrier);
    },

    skin() {
      localStorage.setItem(SKIN_KEY, this.skin);
    },

    rules() {
      localStorage.setItem(RULES_KEY, this.rules);
    },
  },

  methods: {
    toggleSettings() {
      this.settingsShown = !this.settingsShown;
    },

    loadSettings() {
      const helmetSetting = localStorage.getItem(HELMET_KEY);
      const platecarrierSetting = localStorage.getItem(PLATECARRIER_KEY);
      const skinSetting = localStorage.getItem(SKIN_KEY);
      const rulesSetting = localStorage.getItem(RULES_KEY);
      this.hasHelmet = helmetSetting ? helmetSetting : false;
      this.hasPlatecarrier = platecarrierSetting ? platecarrierSetting : false;
      this.skin = skinSetting ? skinSetting : 'marine';
      this.rules = rulesSetting ? rulesSetting : 'helmand';
    },

    resetApp() {
      this.$root.reset();
    },
  },

  mounted() {
    this.loadSettings();
  },
};
