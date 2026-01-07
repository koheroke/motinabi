<template>
  <Transition name="slow-fade">
    <textanm
      text="診断中..."
      :act="textanmAct"
      class="textanm"
      v-show="textanmAct"
      name="slow-fade"
    />
  </Transition>
</template>
<script setup>
import { ref, watch } from "vue";
import textanm from "./textanm.vue";
const textanmAct = ref(false);
let anm = false;
const anmbood = defineProps({
  act: Boolean,
});

async function act() {
  textanmAct.value = true;
  await new Promise((r) => setTimeout(r, 1700));
  textanmAct.value = false;
  await new Promise((r) => setTimeout(r, 1000));
  if (anm == false) {
    return;
  }
  act();
}
watch(
  () => anmbood.act,
  async (newval) => {
    anm = newval;
    if (newval == true) act();
    if (anm == false) {
      textanmAct.value = false;
    }
  }
);
</script>
<style scoped>
.textanm {
  position: relative;
  width: auto;
  height: auto;
  font-size: 50px;
  font-weight: 900;
}

.slow-fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.slow-fade-enter-from {
  opacity: 0;
}
.slow-fade-leave-to {
  opacity: 0;
}
.slow-fade-enter-to {
  opacity: 1;
  z-index: 200;
}
</style>
