import {
  STABILIZATION_TIME,
  SERIOUS_WOUND_BLEEDING_TIME_AFTER_FIRST_AID,
} from 'js/config.js';

export default {
  name: 'health-status',

  data() {
    return {
      woundTimers: [],
      easyWounds: 0,
      seriousWounds: 0,
      deadlyWounds: 0,
      firstAidGiven: false,
      firstAidPoints: 3,
      stabilizationTimer: null,
      stabilizationTimeLeft: null,
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
  },

  methods: {
    giveFirstAid() {
      if (this.isSeriouslyWounded) {
        if (this.firstAidPoints > 0) {
          this.addTimeToWoundTimer(SERIOUS_WOUND_BLEEDING_TIME_AFTER_FIRST_AID);
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
            self.stabilizationTimeLeft -= 1000;
          } else {
            clearInterval(self.stabilizationTimer);
            self.isDead = true;
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
          // return;
        }
        if (item.isSeriouslyWounded) {
          self.seriousWounds += 1;
          // return;
        }
        if (item.isEasilyWounded) {
          self.easyWounds += 1;
          // return;
        }
      });
      if (self.isDead) {
        this.$root.$emit('die');
        return;
      }
      if (self.isSeriouslyWounded && self.isEasilyWounded) {
        self.startWoundTimer(STABILIZATION_TIME);
      }
    });

    self.$root.$on('die', () => {
      self.resetWoundTimer();
      self.$root.isDead = true;
    });
  },
};
