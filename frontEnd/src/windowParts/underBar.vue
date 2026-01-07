<template>
  <div class="parent" :class="{ closing: isClosing, opening: isOpening }">
    <draggable
      v-model="itemList"
      group="people"
      item-key="id"
      handle=".handle"
      class="items"
    >
      <template #item="{ element, index }">
        <div
          class="drag-item"
          @dragstart="() => onDragStart(element)"
          @click="clickItem(element)"
          @mouseenter="hoverType = element.type"
          @mouseleave="hoverType = null"
          :class="{
            onHoverStyle: hoverType === element.type && element.type === 'icon',
          }"
        >
          <div class="handle" :data-index="index">
            <useIcons class="icon" :scale="0.7" :name="element.icon"></useIcons>
            <div class="text">
              <input
                v-if="element.editing && element.type != 'icon'"
                v-model="element.name"
                @keydown.enter="finishEdit(element)"
                class="edit-input"
                ref="editInput"
              />
              <span v-else>
                {{ element.name || "名前を入力" }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script setup>
import useIcons from "../components/useIcons.vue";
import items from "../plugins/items";
import draggable from "vuedraggable";
import { ref, watch, defineProps, nextTick } from "vue";
const isClosing = ref(true);
const hoverType = ref(null);
const isOpening = ref(false);
const itemList = ref([]);
const editInput = ref(null);

let previouslyElement = null;
let closing = false;
let sendForDistinctionBool = false;
let changeNameItem = null;
const props = defineProps({
  sendElement: String,
  menuInfo: String,
  sendUnderber: String,
});

const draggedData = ref(null);
const emit = defineEmits(["sendItem"]);
function finishEdit(element) {
  if (changeNameItem) {
    element.editing = false;
    if (!element.name) element.name = "未命名";
    items.reName(changeNameItem, element.name);
  }
}
function cleateId(name) {
  return name + Math.random().toString().slice(2, 7);
}
function clickItem(element) {
  if (element.name != "追加" || previouslyElement == null) return;
  addItem(
    cleateId(previouslyElement.name),
    previouslyElement.name,
    previouslyElement.attribute
  );
}

function changeName(dom) {
  const thisDom = dom;
  if (!thisDom.classList.contains("handle")) return;
  const index = thisDom.dataset.index;
  if (itemList.value[index].deleteTrue != true) return;
  itemList.value[index].editing = true;
  changeNameItem = {
    id: itemList.value[index].id,
    element: previouslyElement.name,
  };
  itemList.value = [...items[previouslyElement.name]];
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
      editInput.value.select();
    }
  });
}
function addItem(id, parent, type, name = "") {
  let this_editing = true;
  if (name) {
    this_editing = false;
  }
  const this_item = {
    name: name,
    icon: "add",
    id: id,
    type: type,
    element: parent,
    editing: this_editing,
    deleteTrue: true,
  };
  changeNameItem = {
    id: this_item.id,
    element: parent,
  };
  items.add(this_item);
  itemList.value = [...items[parent]];
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
      editInput.value.select();
    }
  });
}
function deleteItem(dom) {
  const thisDom = dom;
  const index = thisDom.dataset.index;
  const this_item = itemList.value[index];
  const deleteItem = {
    id: this_item.id,
    element: previouslyElement.name,
  };
  if (this_item.deleteTrue) {
    thisDom.remove();
    items.delete(deleteItem);
    itemList.value = [...items[previouslyElement.name]];
  }
}

function openMenu(dom) {
  dom.classList.add("clickOn");
}

let openMenuDom = null;
function menuPos(pos) {
  if (openMenuDom != null) openMenuDom.classList.remove("clickOn");
  switch (pos.menu) {
    case "削除":
      if (openMenuDom != null) deleteItem(openMenuDom);
      break;
    case "名前変更":
      if (openMenuDom != null) changeName(openMenuDom);
      break;
    case "openMenu":
      openMenuDom = document.elementFromPoint(pos.pos.x, pos.pos.y);
      if (!openMenuDom.classList.contains("handle")) {
        openMenuDom = null;
        return;
      }
      openMenu(openMenuDom);
      break;
  }
}

function onDragStart(item) {
  if (item.type == "icon") {
    return;
  }
  sendForDistinctionBool = !sendForDistinctionBool;
  draggedData.value = {
    name: item.name,
    bool: sendForDistinctionBool,
    type: item.type,
    icon: item.icon,
  };
  emit("sendItem", JSON.stringify(draggedData.value));
}

watch(
  () => props.sendElement,
  (newVal, oldVal) => {
    const elementInfo = JSON.parse(newVal);
    if (newVal != oldVal && isClosing.value) {
      click();
    }
    if (newVal) {
      if (elementInfo.attribute == undefined) {
        itemList.value = items.search(elementInfo.name);
        return;
      }
      if (elementInfo.bool == false) {
        click();
        return;
      }
      itemList.value = items[elementInfo.name];
      previouslyElement = elementInfo;
    }
  }
);
watch(
  () => props.menuInfo,
  (newVal) => {
    menuPos(JSON.parse(newVal));
  }
);
watch(
  () => props.sendUnderber,
  (newVal) => {
    setSavedItems(JSON.parse(newVal));
  }
);
function setSavedItems(this_data) {
  const keys = Object.keys(this_data);
  keys.forEach((key) => {
    const this_items = this_data[key];
    const type = items[key][0].type;
    this_items.forEach((item) => {
      addItem(cleateId(item), key, type, item);
    });
  });
}
function click() {
  closing = !closing;
  if (closing) {
    isOpening.value = true;
    isClosing.value = false;
    return;
  }
  isOpening.value = false;
  isClosing.value = true;
}
</script>
<style scoped>
.parent {
  position: fixed;
  background-color: rgb(255, 255, 255);
  box-shadow: -5px -5px 10px 2px rgba(0, 0, 0, 0.3);
  bottom: -70px;
  height: 80px;
  width: 30%;
  align-items: flex-start;
  padding: 0px 50px;
  display: flex;
  flex-direction: column;
  border-radius: 50px;
  overflow-x: auto;
  overflow-y: hidden;
}
.handle {
  position: relative;
  padding: 1px 15px;
  font-weight: 800;
  font-size: 15px;
  z-index: 20;
  width: 40px;
  height: 70px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.itemBox {
  position: relative;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  z-index: 1;
}
.boxParent {
  position: relative;
  width: 100vw;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}
.color {
  position: relative;
  width: 40px;
  height: 30px;
  border: 2px solid rgb(255, 255, 255);
  z-index: 1;
  transition: transform 0.2s;
  border-radius: 10px;
}
.clickOn {
  background-color: #53525236;
  border-radius: 20px;
}
.color:hover {
  transform: scale(1.1);
}

@keyframes slideInUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 1;
  }
}

.closing {
  animation: slideOutUp 220ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}
.edit-input {
  width: 50px;
}

@keyframes slideOutUp {
  0% {
    transform: translateY(-100%);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.opening {
  animation: slideInUp 220ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}

.color.active {
  transform: scale(1.2);
}

.drag-item {
  width: auto;
  height: auto;
  z-index: 3;
  padding-left: 5px;
}
.items {
  position: absolute;
  height: 100%;
  display: flex;
  width: auto;
  z-index: 2;
}
.elementNameClass {
  font-size: 10px;
}
.onHoverStyle {
  transform: scale(1.05);
}
.handle:hover {
  background-color: #817f7f36;
  border-radius: 20px;
}
.text {
  position: absolute;
  width: auto;
  height: auto;
  font-size: 11px;
  font-weight: 800;
  bottom: 0%;
}
.icon {
  position: absolute;
  top: 0%;
}
</style>
