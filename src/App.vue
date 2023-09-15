<template>
  <nav-bar></nav-bar>

  <router-view></router-view>

  <the-footer></the-footer>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import TheFooter from './components/TheFooter.vue';
export default {
  name: "App",

  components: {
    NavBar,
    TheFooter
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:ital@1&display=swap');

* {
  font-family: 'PT Sans', sans-serif;
  box-sizing: border-box;
}


</style>
