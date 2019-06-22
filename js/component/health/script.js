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
      isStabilized: false,
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
      return false;
    },

    isEasilyWounded() {
      if (this.easyWounds && !this.isSeriouslyWounded) return true;
      return false;
    },

    isOneHandInvalid() {
      if (this.isTwoHandsInvalid) {
        return false;
      }
      if (
        this.$root.$refs.body.$refs.leftArm.isEasilyWounded ||
        this.$root.$refs.body.$refs.rightArm.isEasilyWounded
      ) {
        return true;
      }
      return false;
    },

    isTwoHandsInvalid() {
      if (
        this.$root.$refs.body.$refs.leftArm.isEasilyWounded &&
        this.$root.$refs.body.$refs.rightArm.isEasilyWounded &&
        !(
          this.$root.$refs.body.$refs.leftArm.isStabilized ||
          this.$root.$refs.body.$refs.rightArm.isStabilized
        )
      ) {
        return true;
      }
      return false;
    },

    handsAreBandaged() {
      if (this.isOneHandInvalid || this.isTwoHandsInvalid) {
        if ((
            this.$root.$refs.body.$refs.leftArm.isHealthly ||
            this.$root.$refs.body.$refs.leftArm.isEasilyWounded &&
            this.$root.$refs.body.$refs.leftArm.firstAidGiven
          ) && (
            this.$root.$refs.body.$refs.rightArm.isHealthly ||
            this.$root.$refs.body.$refs.rightArm.isEasilyWounded &&
            this.$root.$refs.body.$refs.rightArm.firstAidGiven
          )
        ) {
          return true;
        }
      }
      return false;
    },

    handsAreCured() {
      if (this.isOneHandInvalid || this.isTwoHandsInvalid) {
        if ((
            this.$root.$refs.body.$refs.leftArm.isHealthly ||
            this.$root.$refs.body.$refs.leftArm.isEasilyWounded &&
            this.$root.$refs.body.$refs.leftArm.isStabilized
          ) && (
            this.$root.$refs.body.$refs.rightArm.isHealthly ||
            this.$root.$refs.body.$refs.rightArm.isEasilyWounded &&
            this.$root.$refs.body.$refs.rightArm.isStabilized
          )
        ) {
          return true;
        }
      }
      return false;
    },

    isOneLegInvalid() {
      if (this.isTwoLegsInvalid) {
        return false;
      }
      if (
        this.$root.$refs.body.$refs.leftLeg.isEasilyWounded ||
        this.$root.$refs.body.$refs.rightLeg.isEasilyWounded
      ) {
        return true;
      }
      return false;
    },

    isTwoLegsInvalid() {
      if (
        this.$root.$refs.body.$refs.leftLeg.isEasilyWounded &&
        this.$root.$refs.body.$refs.rightLeg.isEasilyWounded &&
        !(
          this.$root.$refs.body.$refs.leftLeg.isStabilized ||
          this.$root.$refs.body.$refs.rightLeg.isStabilized
        )
      ) {
        return true;
      }
      return false;
    },

    legsAreBandaged() {
      if (this.isOneLegInvalid || this.isTwoLegsInvalid) {
        if ((
            this.$root.$refs.body.$refs.leftLeg.isHealthly ||
            this.$root.$refs.body.$refs.leftLeg.isEasilyWounded &&
            this.$root.$refs.body.$refs.leftLeg.firstAidGiven
          ) && (
            this.$root.$refs.body.$refs.rightLeg.isHealthly ||
            this.$root.$refs.body.$refs.rightLeg.isEasilyWounded &&
            this.$root.$refs.body.$refs.rightLeg.firstAidGiven
          )
        ) {
          return true;
        }
      }
      return false;
    },

    legsAreCured() {
      if (this.isOneLegInvalid || this.isTwoLegsInvalid) {
        if ((
            this.$root.$refs.body.$refs.leftLeg.isHealthly ||
            this.$root.$refs.body.$refs.leftLeg.isEasilyWounded &&
            this.$root.$refs.body.$refs.leftLeg.isStabilized
          ) && (
            this.$root.$refs.body.$refs.rightLeg.isHealthly ||
            this.$root.$refs.body.$refs.rightLeg.isEasilyWounded &&
            this.$root.$refs.body.$refs.rightLeg.isStabilized
          )
        ) {
          return true;
        }
      }
      return false;
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

    restrictionsText() {
      let text = '';
      if (this.isSeriouslyWounded) {
        text += this.rules.SERIOUS_WOUND_RESTRICTIONS;
      } else {
        if (this.isOneHandInvalid && !this.handsAreBandaged && !this.handsAreCured) {
          text += this.rules.HAND_WOUND_RESTRICTIONS;
        }
        if ((this.isOneHandInvalid || this.isTwoHandsInvalid) && this.handsAreBandaged && !this.handsAreCured) {
          if (this.isOneHandInvalid) {
            text += this.rules.HANDS_BANDAGE_RESTRICTIONS;
          }
        }
        if (this.isTwoHandsInvalid && !this.handsAreCured) {
          text += this.rules.TWO_HANDS_WOUND_RESTRICTIONS;
        }
        if (this.isTwoLegsInvalid && !this.legsAreBandaged && !this.LegsAreCured) {
          text += this.rules.TWO_LEGS_WOUND_RESTRICTIONS;
        } else {
          if ((this.isOneLegInvalid || this.isTwoLegsInvalid) && !this.legsAreBandaged && !this.legsAreCured) {
            text += this.rules.LEG_WOUND_RESTRICTIONS;
          }
          if ((this.isOneLegInvalid || this.isTwoLegsInvalid) && this.legsAreBandaged && !this.legsAreCured) {
            if (this.isOneLegInvalid) {
              text += this.rules.ONE_LEG_BANDAGE_RESTRICTIONS;
            }
            if (this.isTwoLegsInvalid) {
              text += this.rules.TWO_LEGS_BANDAGE_RESTRICTIONS;
            }
          }
        }
      }
      return text;
    },

    stabilizationTimeLeftFormatted() {
      return this.millisecondsToTime(this.stabilizationTimeLeft);
    },

    stunTimeLeftFormatted() {
      return this.millisecondsToTime(this.stunTimeLeft);
    },

    woundsCanBeStabilized() {
      return this.rules.WOUNDS_CAN_BE_STABILIZED;
    },

    rules() {
      return rules[this.$root.rules];
    },

    firstAidAvailable() {
      return this.isEasilyWounded && !this.firstAidGiven ||
        this.isEasilyWounded && this.woundsCanBeStabilized ||
        this.isSeriouslyWounded && this.firstAidPoints > 0 ||
        this.isSeriouslyWounded && this.woundsCanBeStabilized && !this.isStabilized;
    },
  },

  watch: {
    isStunned(newValue) {
      if (newValue == true) {
        this.startStunTimer(this.rules.CONTUSION_TIME);
      }
    }
  },

  methods: {
    giveFirstAid() {
      if (this.$root.timeEditorShown) return;
      if (this.isSeriouslyWounded) {
        if (this.firstAidPoints > 0) {
          if (this.firstAidGiven) {
            this.isStabilized = true;
          }
          if (this.rules.STABILIZATION_TYPE == 'add') {
            this.addTimeToWoundTimer(this.rules.SERIOUS_WOUND_BLEEDING_TIME_AFTER_FIRST_AID);
          }
          if (this.rules.STABILIZATION_TYPE == 'reset') {
            this.resetWoundTimer();
            this.startWoundTimer(this.rules.SERIOUS_WOUND_BLEEDING_TIME_AFTER_FIRST_AID);
          }
          this.firstAidPoints -= 1;
        } else {
          if (this.woundsCanBeStabilized && !this.isStabilized) {
            this.isStabilized = true;
            this.resetWoundTimer();
            this.startWoundTimer(this.rules.EVACUATION_TIME);
          }
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
      if (self.isSeriouslyWounded && !self.seriousWounds) {
        self.startWoundTimer(this.rules.SERIOUS_WOUND_STABILIZATION_TIME);
      }
    });

    self.$root.$on('die', () => {
      self.resetWoundTimer();
      self.$root.isDead = true;
    });
  },

  created() {
    this.$nextTick(() => {
      this.firstAidPoints = this.rules.FIRST_AID_POINTS;
    });
  },
};
