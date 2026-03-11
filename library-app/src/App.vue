<template>
  <nav>
    <router-link to="/">Home</router-link>
    <span>|</span>
    <router-link to="/reservations">My Reservations</router-link>
    <span>|</span>
    <router-link to="/admin">Admin</router-link>
  </nav>
  <router-view/>
</template>

<script>
export default {
  name: "App"
}
</script>
