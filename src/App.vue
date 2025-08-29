<script setup>
//import HelloWorld from './components/HelloWorld.vue'
//import TheWelcome from './components/TheWelcome.vue'
</script>

<
<template>
  <div style="text-align: center">
    <nav class="navbar bg-light px-3">
      <a class="navbar-brand">Youth Mental Health</a>
      <div>
        <router-link to="/" class="nav-link d-inline">Home</router-link>
        &nbsp;&nbsp;&nbsp;
        <router-link to="/login" class="nav-link d-inline">Login</router-link>
        &nbsp;&nbsp;&nbsp;
        <router-link to="/resources" class="nav-link d-inline">Resources</router-link>
      </div>
    </nav>
    <div style="margin-top: 20px">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
