import { rules } from 'js/config.js';

export default {
  name: 'health-status',

  data() {
    return {
      easyWounds: 0,
      seriousWounds: 0,
      deadlyWounds: 0,
      firstAidGiven: false,
      firstAidPoints: 3,
      isStunned: false,
      stabilizationTimer: null,
      stabilizationTimeLeft: null,
      stunTimer: null,
      stunTimeLeft: null,
      lastTickTime: false,
      stunLastTickTime: false,
    }
  },

  computed: {
    bodyParts() {
      return [
        this.$root.$refs.body.$refs.head,
        this.$root.$refs.body.$refs.leftArm,
        this.$root.$refs.body.$refs.rightArm,
        this.$root.$refs.body.$refs.torso,
        this.$root.$refs.body.$refs.leftLeg,
        this.$root.$refs.body.$refs.rightLeg,
      ];
    },

    isDead() {
      if (this.deadlyWounds) return true;
      if (this.seriousWounds > 1) return true;
      if (this.seriousWounds && this.easyWounds) return true;
      if (this.easyWounds > 3) return true;
      return false;
    },

    isSeriouslyWounded() {
      if (this.seriousWounds) return true;
      if (this.easyWounds > 2) return true;
    },

    isEasilyWounded() {
      if (this.easyWounds) return true;
    },

    statusText() {
      if ( this.isDead ) {
        return 'status: dead';
      }
      if ( this.isSeriouslyWounded ) {
        return 'status: serious wounds';
      }
      if ( this.isEasilyWounded ) {
        return 'status: easy wounds';
      }
      return 'status: healthy';
    },

    stabilizationTimeLeftFormatted() {
      return this.millisecondsToTime(this.stabilizationTimeLeft);
    },

    stunTimeLeftFormatted() {
      return this.millisecondsToTime(this.stunTimeLeft);
    },

    rules() {
      return this.$root.rules;
    },
  },

  watch: {
    isStunned(newValue) {
      if (newValue == true) {
        this.startStunTimer(rules[this.rules].CONTUSION_TIME);
      }
    }
  },

  methods: {
    giveFirstAid() {
      if (this.isSeriouslyWounded) {
        console.log(this.firstAidPoints);
        if (this.firstAidPoints > 0) {
          this.addTimeToWoundTimer(rules[this.rules].SERIOUS_WOUND_BLEEDING_TIME_AFTER_FIRST_AID);
          this.firstAidPoints -= 1;
        }
      }
      this.firstAidGiven = true;
    },

    startWoundTimer(time) {
      const self = this;
      if (!self.stabilizationTimer) {
        self.stabilizationTimeLeft = time;
        self.stabilizationTimer = setInterval(function() {
          if (self.stabilizationTimeLeft > 1000) {
            const timeNow = Date.now();
            const timeDiff = self.lastTickTime ? timeNow - self.lastTickTime : 1000;
            self.stabilizationTimeLeft -= timeDiff;
            self.lastTickTime = timeNow;
          } else {
            clearInterval(self.stabilizationTimer);
            self.lastTickTime = false;
            self.isDead = true;
          }
        }, 1000);
      }
    },

    startStunTimer(time) {
      const self = this;
      if (!self.stunTimer) {
        self.stunTimeLeft = time;
        self.stunTimer = setInterval(function() {
          if (self.stunTimeLeft > 1000) {
            const timeNow = Date.now();
            const timeDiff = self.stunLastTickTime ? timeNow - self.stunLastTickTime : 1000;
            self.stunTimeLeft -= timeDiff;
            self.stunLastTickTime = timeNow;
          } else {
            clearInterval(self.stunTimer);
            self.stunLastTickTime = false;
            self.isStunned = false;
          }
        }, 1000);
      }
    },

    addTimeToWoundTimer(time) {
      this.stabilizationTimeLeft += time;
    },

    resetWoundTimer() {
      if (this.stabilizationTimer) {
        clearInterval(this.stabilizationTimer);
        this.stabilizationTimer = null;
      }
      this.stabilizationTimeLeft = null;
      this.lastTickTime = false;
    },

    millisecondsToTime(ms) {
      let hours = Math.floor((ms / (60 * 60 * 1000)) % 60);
      let minutes = Math.floor((ms / (60 * 1000)) % 60);
      let seconds = Math.floor((ms / 1000) % 60);

      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      return (hours ? hours + ':' : '') + minutes + ':' + seconds;
    },
  },

  mounted() {
    const self = this;

    self.$root.$on('wounded', () => {
      self.easyWounds = 0;
      self.seriousWounds = 0;
      self.deadlyWounds = 0;
      self.bodyParts.forEach((item) => {
        if (item.isDeadlyWounded) {
          self.deadlyWounds += 1;
        }
        if (item.isSeriouslyWounded) {
          self.seriousWounds += 1;
        }
        if (item.isEasilyWounded) {
          self.easyWounds += 1;
        }
      });
      if (self.isDead) {
        this.$root.$emit('die');
        return;
      }
      if (self.isSeriouslyWounded && self.isEasilyWounded) {
        self.startWoundTimer(rules[this.rules].SERIOUS_WOUND_STABILIZATION_TIME);
      }
    });

    self.$root.$on('die', () => {
      self.resetWoundTimer();
      self.$root.isDead = true;
    });
  },

  created() {
    this.$nextTick(() => {
      this.firstAidPoints = rules[this.rules].FIRST_AID_POINTS;
    });
  },
};
