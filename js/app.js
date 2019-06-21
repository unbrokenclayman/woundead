import Vue from 'vue';
import LongPress from 'vue-directive-long-press';
import HumanBody from './component/body/body.vue';
import HealthStatus from './component/health/health.vue';
import SettingsWidget from './component/settings/settings.vue';

Vue.directive('long-press', LongPress)

Vue.create = obj => new Vue(obj);

Vue.create({
  el: '#app',
  data: {
    isDead: false,
    skin: 'marine',
    rules: 'helmand',
    timeEditorShown: false,
  },
  components: {
    HumanBody,
    HealthStatus,
    SettingsWidget,
  },
  methods: {
    reset() {
      // Все это мудацтво не нужно, оно только от срочности. Надо переписать на vuex.
      this.isDead = false;
      this.$refs.status.easyWounds = 0;
      this.$refs.status.seriousWounds = 0;
      this.$refs.status.deadlyWounds = 0;
      this.$refs.status.firstAidGiven = false;
      this.$refs.status.firstAidPoints = 3;
      this.$refs.status.isStunned = false;
      this.$refs.status.stabilizationTimer = null;
      this.$refs.status.stabilizationTimeLeft = null;
      this.$refs.status.lastTickTime = false;
      this.$refs.status.stunLastTickTime = false;
      clearInterval(this.$refs.status.stunTimer);
      this.$refs.status.stunTimeLeft = null;
      this.$refs.status.stunTimer = null;
      this.$refs.status.isStabilized = false;
      this.$refs.body.$refs.head.woundState = 0;
      this.$refs.body.$refs.head.firstAidGiven = false;
      this.$refs.body.$refs.head.firstAidPoints = 3;
      this.$refs.body.$refs.head.timeEditorShown = false;
      this.$refs.body.$refs.head.armorDestroyed = false;
      this.$refs.body.$refs.head.resetWoundTimer();
      this.$refs.body.$refs.head.stabilizationTimer = null;
      this.$refs.body.$refs.head.isStabilized = false;
      this.$refs.body.$refs.leftArm.woundState = 0;
      this.$refs.body.$refs.leftArm.firstAidGiven = false;
      this.$refs.body.$refs.leftArm.firstAidPoints = 3;
      this.$refs.body.$refs.leftArm.timeEditorShown = false;
      this.$refs.body.$refs.leftArm.resetWoundTimer();
      this.$refs.body.$refs.leftArm.stabilizationTimer = null;
      this.$refs.body.$refs.leftArm.isStabilized = false;
      this.$refs.body.$refs.rightArm.woundState = 0;
      this.$refs.body.$refs.rightArm.firstAidGiven = false;
      this.$refs.body.$refs.rightArm.firstAidPoints = 3;
      this.$refs.body.$refs.rightArm.timeEditorShown = false;
      this.$refs.body.$refs.rightArm.resetWoundTimer();
      this.$refs.body.$refs.rightArm.stabilizationTimer = null;
      this.$refs.body.$refs.rightArm.isStabilized = false;
      this.$refs.body.$refs.torso.woundState = 0;
      this.$refs.body.$refs.torso.firstAidGiven = false;
      this.$refs.body.$refs.torso.firstAidPoints = 3;
      this.$refs.body.$refs.torso.timeEditorShown = false;
      this.$refs.body.$refs.torso.armorDestroyed = false;
      this.$refs.body.$refs.torso.resetWoundTimer();
      this.$refs.body.$refs.torso.stabilizationTimer = null;
      this.$refs.body.$refs.torso.isStabilized = false;
      this.$refs.body.$refs.leftLeg.woundState = 0;
      this.$refs.body.$refs.leftLeg.firstAidGiven = false;
      this.$refs.body.$refs.leftLeg.firstAidPoints = 3;
      this.$refs.body.$refs.leftLeg.timeEditorShown = false;
      this.$refs.body.$refs.leftLeg.resetWoundTimer();
      this.$refs.body.$refs.leftLeg.stabilizationTimer = null;
      this.$refs.body.$refs.leftLeg.isStabilized = false;
      this.$refs.body.$refs.rightLeg.woundState = 0;
      this.$refs.body.$refs.rightLeg.firstAidGiven = false;
      this.$refs.body.$refs.rightLeg.firstAidPoints = 3;
      this.$refs.body.$refs.rightLeg.timeEditorShown = false;
      this.$refs.body.$refs.rightLeg.resetWoundTimer();
      this.$refs.body.$refs.rightLeg.stabilizationTimer = null;
      this.$refs.body.$refs.rightLeg.isStabilized = false;
    }
  },
});
