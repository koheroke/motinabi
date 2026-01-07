<template>
  <div class="parent">
    <div
      v-for="menu in menuList"
      :key="menu.id"
      @click="doClick(menu)"
      :class="['menuItem', { selected: selectedMenu === menu.id }]"
    >
      <useIcons class="icon" :name="menu.id"></useIcons>
      <div class="itemText">{{ menu.name }}</div>
    </div>
  </div>
</template>
<script setup>
const selectedMenu = ref(null);
import { ref, onMounted } from "vue";
import useIcons from "../components/useIcons.vue";
const menuList = [
  { id: "suitcase", name: "収容", attribute: "case" },
  { id: "cashStack", name: "貴重品", attribute: "item" },
  { id: "tshirt", name: "衣類", attribute: "item" },
  { id: "soapPump", name: "洗面衛生", attribute: "item" },
  { id: "medicineBottle", name: "医薬品", attribute: "item" },
  { id: "camera", name: "電子機器", attribute: "item" },
  { id: "flashlight", name: "レジャー", attribute: "item" },
];
onMounted(() => {
  doClick(menuList[0]);
});

const emit = defineEmits(["sendElement"]);
let saveName = null;
function doClick(menu) {
  let bool = true;
  selectedMenu.value = menu.id;
  if (saveName == menu.name) {
    bool = false;
    selectedMenu.value = null;
    saveName = null;
  } else {
    saveName = menu.name;
  }

  const menuInfo = {
    name: menu.name,
    bool: bool,
    attribute: menu.attribute,
  };
  emit("sendElement", JSON.stringify(menuInfo));
}
</script>
<style scoped>
.parent {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f8fafc;
  border-right: 1px solid rgb(160, 157, 157);
}

.parent::-webkit-scrollbar {
  display: none;
}

.itemText {
  color: #383838;
  font-size: 11px;
  font-weight: 1000;
  font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体",
    "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif;
  width: auto;
  border-radius: 5px;
  transform: translateY(-30%);
}

.menuItem:hover .icon {
  background-color: #817e7e34;
  border-radius: 20px;
}
.menuItem {
  padding-bottom: 5px;
  border-bottom: 1px solid black;
  margin: 10px;
}
.icon {
  z-index: 20;
}
.menuItem.selected .icon {
  background-color: #817e7e34;
  border-radius: 20px;
}
</style>
