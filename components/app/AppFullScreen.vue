<template>
  <button
    class="
      rounded-md
      hover:text-primary-500
      focus:outline-none
      transition
      ease-in-out
      duration-150
    "
    @click="onToggleScreen"
    :title="fullscreen ? '全螢幕縮小' : '全螢幕放大'"
  >
    <span v-if="fullscreen" class="material-icons"> zoom_in_map </span>
    <span v-else class="material-icons"> zoom_out_map </span>
  </button>
</template>
<script>
import screenfull from "screenfull";

export default {
  data() {
    return {
      fullscreen: false,
    };
  },
  methods: {
    onToggleScreen() {
      this.fullscreen = !this.fullscreen;
      if (screenfull.isEnabled) {
        screenfull.toggle();
      }
    },
  },
};
</script>