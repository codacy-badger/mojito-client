<template>
  <div id="app" class="content">
    <!-- display navigation bar -->
    <navbar/>
    <!-- display page contents based on router -->
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/common/Navbar.vue";

export default {
    name: "App",

    components: {
        Navbar,
    },
};
</script>

<style lang="scss">
@import "@/assets/_custom.scss";
</style>
