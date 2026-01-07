<script setup>
import { ref } from "vue";
import sideBar from "../windowParts/sideBar.vue";
import mainWindow from "../windowParts/mainWindow.vue";
import loasItemWIndowArea from "../windowParts/loasItemWIndowArea.vue";
import items from "../windowParts/underBar.vue";
import Menu from "../components/menu.vue";
import topBar from "../windowParts/topBar.vue";
import loadanm from "../anmcomponents/loadanm.vue";
const sendElement = ref();
const sendItem = ref();
const menuInfo = ref();
const topbarInfo = ref();
const sendTopber = ref();
const sendUnderber = ref();
const sendLostItemWindow = ref();
const waitBool = ref(false);
function sendElementFunc(data) {
  sendElement.value = data;
}
function sendLostItemWindowFunc(data) {
  switch (JSON.parse(data).type) {
    case "waitResponse":
      waitBool.value = true;
      break;
    case "sendRespose":
      waitBool.value = false;
      sendLostItemWindow.value = data;
      break;
  }
}
function sendItemFunc(data) {
  sendItem.value = data;
}
function sendUnderberFunc(data) {
  sendUnderber.value = data;
}
function menuPosFunc(data) {
  menuInfo.value = data;
}
function topbarSendFunc(data) {
  topbarInfo.value = data;
}
function sendTopberFunc(data) {
  sendTopber.value = data;
}
</script>
<template>
  <div class="window" translate="no">
    <div class="waitGeminiResponce">
      <loadanm :act="waitBool" />
    </div>
    <div class="topbar">
      <topBar
        @topBarSend="topbarSendFunc"
        @sendElement="sendElementFunc"
        :sendTopber="sendTopber"
      ></topBar>
    </div>
    <div class="main">
      <div class="sidebarClass">
        <sideBar @sendElement="sendElementFunc"></sideBar>
      </div>
      <div class="mainWindowClass">
        <mainWindow
          @sendUnderber="sendUnderberFunc"
          :sendItem="sendItem"
          :menuInfo="menuInfo"
          :topbarSend="topbarInfo"
          @sendTopber="sendTopberFunc"
          @sendLostItemWindow="sendLostItemWindowFunc"
        ></mainWindow>
      </div>
      <div class="underBarClass">
        <items
          :sendUnderber="sendUnderber"
          :sendElement="sendElement"
          @sendItem="sendItemFunc"
          :menuInfo="menuInfo"
        ></items>
      </div>

      <Menu @menuPos="menuPosFunc"></Menu>
    </div>
    <loasItemWIndowArea
      :sendLostItemWindow="sendLostItemWindow"
    ></loasItemWIndowArea>
  </div>
</template>

<style></style>
<style scoped>
.window {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0vh;
  left: 0vw;
  overflow: hidden;
}
.waitGeminiResponce {
  position: absolute;
  z-index: 20;
  left: 50vw;
  top: 50vh;
  transform: translate(-25%, -50%);
}
.topbar {
  position: relative;
  z-index: 10;
}

.main {
  position: relative;
  display: flex;
  width: 100%;
  height: 95%;
  background-color: #f3f4f6;
  z-index: 1;
}

.underBarClass {
  position: absolute;
  left: 30%;
  z-index: 10;
}
.mainWindowClass {
  position: relative;
  width: 90%;
  height: auto;
  padding: 15px;
}
.sidebarClass {
  position: relative;
  width: auto;
  height: auto;
  bottom: 0%;
}
</style>
