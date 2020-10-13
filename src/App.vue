<template>
  <div id="app">
    <!-- default layout consists of top bar and nav bar. + content from whichever router-view -->
    <DefaultLayout/>
  </div>
</template>

<script>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

export default {
  name: 'App',

  components: {
    DefaultLayout
  },

  data: () => ({
    //
  }),
};
</script>
