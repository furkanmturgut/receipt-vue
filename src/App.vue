<template>
  <nav-bar></nav-bar>

  <router-view></router-view>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",

  components: {
    NavBar,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:ital@1&display=swap');

* {
  font-family: 'PT Sans', sans-serif;
}
</style>
