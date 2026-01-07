<template>
  <div class="poptext" :class="{ closing: isClosing, poping: isPoping }">
    {{ text }}
  </div>
</template>
<style scoped>
.poptext {
  width: auto;
  height: auto;
  font-size: 16px;
  color: rgb(58, 57, 57);
  font-weight: 800;
  z-index: 1;
  border-radius: 10px;
}
.closing {
  animation: close 220ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}
@keyframes close {
  0% {
    transform: translateY(110%);
    visibility: visible;
    opacity: 1;
  }
  100% {
    transform: translateY(-110%);
    visibility: hidden;
    opacity: 1;
  }
}

.poping {
  animation: pop 220ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}
@keyframes pop {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(130%);
    opacity: 1;
  }
}
</style>
<script setup>
import { ref, watch } from "vue";
const text = ref("");
const isClosing = ref(true);
const isPoping = ref(false);
const props = defineProps({
  actionPopText: String,
});

function action() {
  isPoping.value = true;
  isClosing.value = false;
  setTimeout(() => {
    isPoping.value = false;
    isClosing.value = true;
  }, 2000);
}
watch(
  () => props.actionPopText,
  (newVal) => {
    action();
    text.value = JSON.parse(newVal).text;
  }
);
</script>
