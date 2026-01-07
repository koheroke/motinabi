<template>
  <div class="lostItemwindow" v-show="show">
    <div class="title">
      {{ "これを忘れていませんか？" }}
    </div>
    <div class="main">
      <div
        v-for="(lostItem, index) in lostItems"
        :key="index"
        class="lostItemClass"
      >
        <input type="checkbox" class="checkBoxClass" />
        <div class="textClass">
          {{ lostItem }}
        </div>
      </div>
    </div>
    <div class="delete" @click="onDeleteBtn">
      {{ "OK" }}
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const lostItems = ref([]);
const show = ref(false);
const props = defineProps({
  sendLostItemWindow: String,
});
const emit = defineEmits(["deleteLostItemWindow"]);

watch(
  () => props.sendLostItemWindow,
  (newVal) => {
    const res = JSON.parse(newVal);
    show.value = true;
    lostItems.value = res.data.split(",");
  }
);
function onDeleteBtn() {
  show.value = false;
  emit("deleteLostItemWindow");
}
</script>
<style scoped>
.lostItemwindow {
  position: relative;
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 2px 2px 10px 2px rgba(43, 43, 43, 0.3);
}
.lostItemClass {
  border-bottom: 1px dotted rgb(79, 77, 77);
  color: rgb(53, 50, 50);
  width: 90%;
  height: auto;
  font-weight: 500;
  padding-bottom: 28px;
}
.main {
  position: relative;
  width: 100%;
  height: 70%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.title {
  background-color: rgb(58, 57, 57);
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 900;
}
.checkBoxClass {
  position: absolute;
  left: 10px;
}
.textClass {
  position: absolute;
  left: 40%;
}
.delete {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(58, 57, 57);
  width: 90px;
  height: 40px;
  border-radius: 15px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.1s;
}
.delete:hover {
  transform: scale(1.08) translateX(-50%);
}
</style>
