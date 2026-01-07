<template>
  <div class="menu" v-show="menuShow" ref="menuRef">
    <div
      v-for="({ menu }, index) in menuList"
      :key="index"
      @click="onClick(menu)"
      class="menu-item"
    >
      {{ menu }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const menuList = [{ menu: "削除" }, { menu: "名前変更" }];
const menuShow = ref(false);
const menuRef = ref(null);
const pos = { x: 0, y: 0 };
const emit = defineEmits(["menuPos"]);
function onClick(menu) {
  menuRef.value.style.pointerEvents = "none";
  menuShow.value = false;
  const info = {
    menu: menu,
    pos: pos,
  };
  emit("menuPos", JSON.stringify(info));
}

onMounted(() => {
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menuRef.value.style.pointerEvents = "";
    menuRef.value.style.left = e.pageX + "px";
    menuRef.value.style.top = e.pageY - 60 + "px";
    pos.x = e.pageX;
    pos.y = e.pageY;
    const info = {
      menu: "openMenu",
      pos: pos,
    };
    emit("menuPos", JSON.stringify(info));
    menuShow.value = true;
  });

  window.addEventListener("click", () => {
    menuShow.value = false;
  });
});
</script>

<style scoped>
.menu {
  position: absolute;
  background-color: #eaeaea;
  border-radius: 5%;
  padding: 10px;
  font-weight: bolder;
  box-shadow: -2px -2px 10px 2px rgba(129, 127, 127, 0.3);
  z-index: 20;
}

.menu-item {
  padding: 5px;
  background-color: #eaeaea;
  color: rgb(68, 66, 66);
  font-size: 12px;
  text-align: center;
  font-family: sans-serif;
  border-radius: 5%;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #616db8;
  color: #fff;
}
</style>
