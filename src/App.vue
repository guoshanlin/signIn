<template>
  <div id="app">
    <!--<img src="./assets/ogo_core.gif">-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  @import 'iview/dist/styles/iview.css';
  /*公用css*/
  @import 'css/common.css';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
