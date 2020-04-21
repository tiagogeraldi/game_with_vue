<template>
  <div id="app">
    <app-tank></app-tank>
  </div>
</template>

<script>
  import Tank from './components/Tank.vue';

  export default {
    components: {
      'app-tank': Tank
    }
  };
</script>


<style>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
  }

  #app {
    width: 100%;
    height: 100%;
    background-color: grey;
    border: 5px solid black;
  }
</style>
