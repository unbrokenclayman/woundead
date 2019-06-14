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
  },
  components: {
    HumanBody,
    HealthStatus,
    SettingsWidget,
  },
});
