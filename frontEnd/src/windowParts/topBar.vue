<template>
  <div class="parent">
    <div class="leftBar">
      <div class="title">{{ "motinabi" }}</div>
      <div class="confirmation" v-show="confirmationShow">
        <div class="confirmationTitle">
          {{ "リストを初期化しますか？" }}
        </div>
        <div class="buttons">
          <div class="button" @click="buttonClick('キャンセル')">
            {{ "キャンセル" }}
          </div>
          <div class="button" @click="buttonClick('初期化')">
            {{ "初期化" }}
          </div>
        </div>
      </div>
      <div class="searchBox">
        <input
          v-model="message"
          placeholder="荷物を検索"
          @blur="onBlur()"
          @keyup.enter="onBlur"
          class="search"
        />
      </div>
    </div>
    <div class="rightBar">
      <div class="popTextClass">
        <popText :actionPopText="poptext" />
      </div>
      <div class="topBar">
        <div
          v-for="(menu, index) in menuList"
          :key="index"
          @click="topBarMenuDoClick(menu)"
          class="menu-item"
        >
          {{ menu }}
        </div>
      </div>
    </div>
    <div class="menuOpenButton" @click="subMenuOpen('acountMenu')">
      <div class="sunMenuClass" v-show="sunMenuShow">
        <div
          v-for="(menu, index) in subMenu"
          :key="index"
          @click="topBarMenuDoClick(menu)"
          class="sunMenu-item"
        >
          {{ menu }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import popText from "../components/popText.vue";
const message = ref(null);
const menuList = ["保存", "出力", "忘れ物診断"];
const subMenu = ref([]);
const menus = reactive({
  acountMenu: ["ログイン", "全て削除"],
});
const sunMenuShow = ref(false);
const confirmationShow = ref(false);
const poptext = ref();
let login = false;
const emit = defineEmits(["topBarSend", "sendElement"]);
function subMenuOpen(menu) {
  sunMenuShow.value = !sunMenuShow.value;
  subMenu.value = menus[menu];
}
const props = defineProps({
  sendTopber: String,
});

let bool1 = false;
let bool2 = false;
let bool3 = false;

watch(
  () => props.sendTopber,
  (newVal) => {
    const sendelem = JSON.parse(newVal);
    switch (sendelem.type) {
      case "login":
        menus.acountMenu = menus.acountMenu.map((menu) => {
          if (menu === "ログイン") return "ログアウト";
          return menu;
        });
        subMenu.value = menus.acountMenu;
        login = true;
        break;
      case "save":
        bool3 = !bool3;
        poptext.value = JSON.stringify({
          text: sendelem.innerText,
          bool: bool3,
        });
        break;
    }
  }
);

function buttonClick(text) {
  if (text == "初期化") {
    bool1 = !bool1;
    const menuInfo = JSON.stringify({ menu: "全て削除", bool: bool1 });
    emit("topBarSend", menuInfo);
  }
  confirmationShow.value = false;
}
function topBarMenuDoClick(menu) {
  if (menu == "全て削除") {
    confirmationShow.value = true;
    return;
  }
  // if (menu == "公開" && !login) {
  //   bool3 = !bool3;
  //   poptext.value = JSON.stringify({ text: "ログインが必要です", bool: bool3 });
  //   return;
  // }
  bool2 = !bool2;
  const menuInfo = JSON.stringify({ menu: menu, bool: bool2 });
  emit("topBarSend", menuInfo);
}
function onBlur() {
  if (message.value != "") {
    bool3 = !bool3;
    emit("sendElement", JSON.stringify({ name: message.value, bool: bool3 }));
    message.value = "";
  }
}
</script>
<style scoped>
.parent {
  background-color: #1f2937;
  width: 100vw;
  display: flex;
  align-items: center;
  z-index: 3;
}

.rightBar {
  position: absolute;
  width: 100%;
  height: 30px;
  padding: 7px 0px;
  color: white;
}
.leftBar {
  position: absolute;
  display: flex;
  align-items: center;
}
@media (max-width: 550px) {
  .rightBar {
    bottom: -10px;
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid black;
    color: black;
  }
  .parent {
    height: 100px;
  }
  .leftBar {
    top: 0;
    padding: 7px;
  }
  .menuOpenButton {
    position: absolute;
    top: 10%;
  }
}
@media (min-width: 551px) {
  .rightBar {
    top: 0;
  }
  .parent {
    height: 50px;
  }
}

.menu-item {
  padding: 5px 10px;
  border-left: 1px solid white;
}
.menu-item:hover {
  background-color: rgb(255, 255, 255);
  color: black;
  border-radius: 4px;
}
.topBar {
  position: absolute;
  width: auto;
  height: auto;
  right: 50px;
  border-radius: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  font-weight: 900;
}
.title {
  color: white;
  width: auto;
  padding-left: 7px;
  font-weight: 900;
  font-size: 20px;
}
.searchBox {
  padding-left: 30px;
  border-radius: 12px;
  z-index: 30;
  border-radius: 90px;
}
.search {
  border-radius: 20px;
  padding: 7px;
}
.menuOpenButton {
  position: absolute;
  right: 10px;
  background-color: rgb(255, 255, 255);
  border-radius: 100%;
  width: 30px;
  height: 30px;
  z-index: 5;
}

.sunMenuClass {
  position: absolute;
  top: 120%;
  right: -10px;
  width: 120px;
  background-color: #ffffff;
  border-radius: 5%;
  font-weight: bolder;
  box-shadow: -2px -2px 10px 2px rgba(129, 127, 127, 0.3);
}

.sunMenu-item {
  padding: 15px 10px;
  background-color: #ffffff;
  color: rgb(68, 66, 66);
  font-size: 12px;
  text-align: center;
  font-family: sans-serif;
  border-radius: 5%;
  cursor: pointer;
}

.sunMenu-item:hover {
  background-color: #757575;
  color: #ffffff;
}
.confirmation {
  position: fixed;
  background-color: rgb(255, 255, 255);
  box-shadow: -2px -2px 10px 2px rgba(129, 127, 127, 0.3);
  width: 300px;
  height: 200px;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.button {
  background-color: white;
  border: 1px solid black;
  width: auto;
  height: auto;
  padding: 5px;
  font-size: 10px;
  color: black;
  margin: 2px;
  border-radius: 2px;
}
.button:hover {
  background-color: rgb(255, 0, 64);
  color: rgb(255, 255, 255);
}
.buttons {
  position: absolute;
  width: auto;
  height: auto;
  display: flex;
  right: 4px;
  bottom: 3px;
}
.confirmationTitle {
  position: absolute;
  font-size: 18px;
  width: 100%;
  height: auto;
  color: black;
  top: 50%;
  left: 50%;
  font-weight: 500;
  transform: translate(-50%, -50%);
}
.popTextClass {
  position: absolute;
  right: 0%;
  bottom: 0%;
  padding: 3px;
}
</style>
