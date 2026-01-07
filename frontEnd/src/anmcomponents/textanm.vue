<template>
  <div class="top-ttl" ref="textEl"></div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "default text",
  },
  act: {
    type: Boolean,
    default: false,
  },
});
const textEl = ref(null);

watch(
  () => props.act,
  (newval) => {
    if (newval == true) {
      const container = textEl.value;
      container.textContent = "";
      props.text.split("").forEach((char, i) => {
        const outer = document.createElement("span");
        outer.style.display = "inline-block";
        outer.style.overflow = "hidden";
        const inner = document.createElement("span");
        inner.textContent = char;
        inner.style.display = "inline-block";
        inner.style.transform = "translateY(100%)";
        inner.style.opacity = "0";
        inner.style.animation = `showText 0.5s forwards`;
        inner.style.animationDelay = `${i * 0.2}s`;
        outer.appendChild(inner);
        container.appendChild(outer);
      });
    }
  }
);
</script>

<style>
@keyframes showText {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
