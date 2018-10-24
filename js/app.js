import Vue from 'vue';
import HumanBody from './component/body/body.vue';

Vue.create = obj => new Vue(obj);

Vue.create({
  el: '#app',
  components: {
    HumanBody,
  },
});
