export default {
  props: {
    side: String,
  },

  data() {
    return {
      woundState: 0,
      hitpoints: 2,
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
  },

  methods: {
    addWound() {
      if (this.woundState < this.hitpointsWithArmor + 1) {
        this.woundState += this.armorDestroyed ? 2 : 1;
      }
      this.armorDestroyed = this.hasArmor ? true : false;
    },

    removeWound() {
      if (this.woundState > 0) {
        this.woundState -= 1;
      }
    },
  },
}
