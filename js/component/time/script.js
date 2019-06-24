export default {
  name: 'time-edit',

  computed: {
    timer: {
      get() {
        switch(this.$parent.timerFor) {
          case 'stabilization':
            return this.$parent.stabilizationTimeLeft;
          case 'stun':
            return this.$parent.stunTimeLeft;
        };
      },
      set(value) {
        switch(this.$parent.timerFor) {
          case 'stabilization':
            this.$parent.stabilizationTimeLeft = value;
            break;
          case 'stun':
            this.$parent.stunTimeLeft = value;
            break;
        };
      },
    },

    timeFormatted() {
      switch(this.$parent.timerFor) {
        case 'stabilization':
          return this.$parent.stabilizationTimeLeftFormatted;
        case 'stun':
          return this.$parent.stunTimeLeftFormatted;
      };
    },
  },

  methods: {
    toggleTimeEditor(timerFor = 'stabilization') {
      this.$parent.timerFor = timerFor;
      this.$parent.toggleTimeEditor();
    },

    decreaseTime(seconds) {
      let changedTime = this.timer - seconds * 1000;
      if ( changedTime > 0 ) {
        this.timer = changedTime;
      }
    },

    increaseTime(seconds) {
      let changedTime = this.timer + seconds * 1000;
      this.timer = changedTime;
    },
  },
};
