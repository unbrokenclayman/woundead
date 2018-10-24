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

    hitpointsLeft() {
      return this.hitpoints - this.woundState;
    },

    isHealthly() {
      return !this.woundState;
    },

    isEasilyWounded() {
      return (this.hitpointsLeft == 1 && this.hitpointsLeft != this.hitpoints);
    },

    isSeriouslyWounded() {
      return (this.hitpointsLeft <= 0 && this.hitpointsLeft != this.hitpoints);
    },

    isDeadlyWounded() {
      return this.hitpointsLeft < 0;
    },
  },

  methods: {
    addWound() {
      if (this.woundState < 3) {
        this.woundState += 1;
      }
    },

    removeWound() {
      if (this.woundState > 0) {
        this.woundState -= 1;
      }
    },
  },
}
