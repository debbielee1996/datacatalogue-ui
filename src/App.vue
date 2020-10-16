<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
    <!-- default layout consists of top bar and nav bar. + content from whichever router-view -->
    <!-- <DefaultLayout/> -->
  </div>
</template>

<script>
const default_layout = "default";

export default {
  name: 'App',

  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + '-layout'
    }
  }
};
</script>
