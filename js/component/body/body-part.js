import { rules } from 'js/config.js';
import TimeEditor from '../time/time.vue';

export default {
  props: {
    side: String,
  },

  components: {
    TimeEditor,
  },

  data() {
    return {
      woundState: 0,
      hitpoints: 2,
      firstAidGiven: false,
      firstAidPoints: 3,
      stabilizationTimer: null,
      stabilizationTimeLeft: null,
      timeEditorShown: false,
      lastTickTime: false,
      isStabilized: false,
      timerFor: 'stabilization',
    }
  },

  computed: {
    sideClass() {
      return `body-part--${this.side}`;
    },

    hitpointsWithArmor() {
      return this.hasArmor ? this.hitpoints + this.armorHitpoints : this.hitpoints;
    },

    hitpointsLeft() {
      return this.hitpointsWithArmor - this.woundState;
    },

    isHealthly() {
      return !this.woundState;
    },

    isEasilyWounded() {
      return (this.hitpointsLeft == 1 && this.hitpointsLeft != this.hitpointsWithArmor);
    },

    isSeriouslyWounded() {
      return (this.hitpointsLeft <= 0 && this.hitpointsLeft != this.hitpointsWithArmor);
    },

    isDeadlyWounded() {
      return this.hitpointsLeft < 0;
    },

    isStunned() {
      return !this.isHealthly && !this.isEasilyWounded && !this.isSeriouslyWounded;
    },

    stabilizationTimeLeftFormatted() {
      return this.stabilizationTimeLeft ? this.millisecondsToTime(this.stabilizationTimeLeft) : '';
    },

    woundsCanBeStabilized() {
      return this.rules.WOUNDS_CAN_BE_STABILIZED;
    },

    rules() {
      return rules[this.$root.rules];
    },

    firstAidAvailable() {
      return this.isEasilyWounded && !this.firstAidGiven ||
        this.isEasilyWounded && this.woundsCanBeStabilized && !this.isStabilized ||
        this.isSeriouslyWounded && this.firstAidPoints > 0 ||
        this.isSeriouslyWounded && this.woundsCanBeStabilized && !this.isStabilized;
    },
  },

  watch: {
    timeEditorShown(newValue) {
      this.$root.timeEditorShown = newValue;
    },
  },

  methods: {
    addWound(byClick = false) {
      this.firstAidGiven = false;
      this.isStabilized = false;
      if (this.$root.timeEditorShown && byClick) return;
      if (this.woundState < this.hitpointsWithArmor + 1) {
        this.woundState += this.armorDestroyed ? 2 : 1;
      }
      this.$root.$emit('wounded');
      this.resetWoundTimer();
      if (
        !this.isDeadlyWounded && !this.$root.isDead &&
        (this.isEasilyWounded || this.isSeriouslyWounded)
      ) {
        if (this.isSeriouslyWounded) {
          this.startWoundTimer(this.rules.SERIOUS_WOUND_STABILIZATION_TIME);
        } else {
          this.startWoundTimer(this.rules.EASY_WOUND_STABILIZATION_TIME);
        }
      }
      this.armorDestroyed = this.hasArmor ? true : false;
      if (this.isStunned) {
        this.$root.$refs.status.isStunned = true;
      }
    },

    removeWound() {
      if (this.woundState > 0) {
        this.woundState -= 1;
      }
    },

    giveFirstAid() {
      if (this.$root.timeEditorShown) return;
      if (this.isEasilyWounded) {
        if (!this.firstAidGiven) {
          this.resetWoundTimer();
          if (this.rules.EASY_WOUND_BLEEDING_TIME_AFTER_FIRST_AID) {
            this.startWoundTimer(this.rules.EASY_WOUND_BLEEDING_TIME_AFTER_FIRST_AID);
          }
        } else {
          if (this.woundsCanBeStabilized) {
            this.isStabilized = true;
            this.resetWoundTimer();
          }
        }
      }
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
            self.addWound();
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

    toggleTimeEditor(timerFor = 'stabilization') {
      this.timerFor = timerFor;
      this.timeEditorShown = !this.timeEditorShown;
    },
  },

  mounted() {
    const self = this;

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
}
