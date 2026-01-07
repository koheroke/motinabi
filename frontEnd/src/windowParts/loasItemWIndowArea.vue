<template>
  <div class="loasItemWIndowAreaClass">
    <div class="lostItemWindowClass" ref="lostItemWindowRef">
      <lostItemWindow
        :sendLostItemWindow="sendLostItemWindow"
        @deleteLostItemWindow="deleteLostItemWindowFnc"
      ></lostItemWindow>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import lostItemWindow from "../components/lostItemWindow.vue";
const lostItemWindowRef = ref(null);
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
const sendLostItemWindow = ref(null);
const props = defineProps({
  sendLostItemWindow: String,
});
watch(
  () => props.sendLostItemWindow,
  (newVal) => {
    lostItemWindowRef.value.style.pointerEvents = "auto";
    sendLostItemWindow.value = newVal;
    const type = JSON.parse(newVal).type;
    if (type == "sendRespose") {
      lostItemWindowRef.value.style.left =
        window.innerWidth / 2 - lostItemWindowRef.value.offsetWidth / 2 + "px";
      lostItemWindowRef.value.style.top =
        window.innerHeight / 2 -
        lostItemWindowRef.value.offsetHeight / 2 +
        "px";
    }
  }
);

onMounted(() => {
  lostItemWindowRef.value.style.pointerEvents = "none";
  lostItemWindowRef.value.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = lostItemWindowRef.value.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
  function onMouseMove(e) {
    if (!isDragging) return;
    lostItemWindowRef.value.style.left = `${e.clientX - offsetX}px`;
    lostItemWindowRef.value.style.top = `${e.clientY - offsetY}px`;
  }
});
function deleteLostItemWindowFnc() {
  lostItemWindowRef.value.style.pointerEvents = "none";
}
</script>
<style scoped>
.lostItemWindowClass {
  position: absolute;
  z-index: 100;
  width: 300px;
  height: 200px;
  top: 35vh;
  left: 35vw;
}
.loasItemWIndowAreaClass {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
}
</style>
