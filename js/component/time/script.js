export default {
  name: 'time-edit',

  methods: {
    toggleTimeEditor() {
      this.$parent.toggleTimeEditor();
    },

    decreaseTime(seconds) {
      let changedTime = this.$parent.stabilizationTimeLeft - seconds * 1000;
      if ( changedTime > 0 ) {
        this.$parent.stabilizationTimeLeft = changedTime;
      }
    },

    increaseTime(seconds) {
      let changedTime = this.$parent.stabilizationTimeLeft + seconds * 1000;
      this.$parent.stabilizationTimeLeft = changedTime;
    },
  },
};
