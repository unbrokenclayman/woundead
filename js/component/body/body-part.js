import {
  STABILIZATION_TIME,
  EASY_WOUND_BLEEDING_TIME_AFTER_FIRST_AID,
  SERIOUS_WOUND_BLEEDING_TIME_AFTER_FIRST_AID,
} from 'js/config.js';

export default {
  props: {
    side: String,
  },

  data() {
    return {
      woundState: 0,
      hitpoints: 2,
      firstAidGiven: false,
      firstAidPoints: 3,
      stabilizationTimer: null,
      stabilizationTimeLeft: null,
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

    stabilizationTimeLeftFormatted() {
      return this.millisecondsToTime(this.stabilizationTimeLeft);
    },
  },

  methods: {
    addWound() {
      if (this.woundState < this.hitpointsWithArmor + 1) {
        this.woundState += this.armorDestroyed ? 2 : 1;
      }
      this.$root.$emit('wounded');
      this.resetWoundTimer();
      if (!this.isDeadlyWounded && !this.$root.isDead && this.isEasilyWounded) {
        this.startWoundTimer(STABILIZATION_TIME);
      }
      this.armorDestroyed = this.hasArmor ? true : false;
    },

    removeWound() {
      if (this.woundState > 0) {
        this.woundState -= 1;
      }
    },

    giveFirstAid() {
      if (this.isEasilyWounded) {
        if (!this.firstAidGiven) {
          this.resetWoundTimer();
          this.startWoundTimer(EASY_WOUND_BLEEDING_TIME_AFTER_FIRST_AID)
        }
      }
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
    },

    millisecondsToTime(ms) {
      let hours = Math.floor((ms / (60 * 60 * 1000)) % 60);
      let minutes = Math.floor((ms / (60 * 1000)) % 60);
      let seconds = Math.floor((ms / 1000) % 60);

      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      return (hours ? hours + ':' : '') + minutes + ':' + seconds;
    },

    editTime() {

    },
  },

  mounted() {
    const self = this;
    self.$root.$on('die', () => {
      self.resetWoundTimer();
      self.$root.isDead = true;
    });
  },
}
