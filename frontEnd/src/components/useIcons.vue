<template>
  <div :class="['useIcons']" :style="iconStyle" ref="useIconsRef"></div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import iconsArea from "../plugins/iconsArea";
const useIconsRef = ref(null);
const maxWidthSize = 588;
const props = defineProps({
  name: String,
  scale: { type: Number, default: 1 },
});

let ratio = props.scale;
onMounted(() => {
  useIconsRef.value.style.backgroundSize = `${maxWidthSize * ratio}px auto`;
});

const pos = iconsArea[props.name].pos;
const iconStyle = computed(() => ({
  backgroundPosition: `${pos.x * ratio}px ${pos.y * ratio}px`,
  width: iconsArea[props.name].size * ratio + "px",
  height: iconsArea[props.name].size * ratio + "px",
  transformOrigin: "top left",
}));
</script>

<style scoped>
.useIcons {
  background-image: url("/public/cssSprite/cssSprite.png");
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 2;
}
</style>
