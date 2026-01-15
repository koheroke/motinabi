<template>
  <div class="parent" ref="parent" @dragover.prevent @drop="onDrop">
    <div class="parentArea" ref="parentArea"></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, h, render } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { post } from "../plugins/appPost";
import items from "../plugins/items";
import useIcons from "../components/useIcons.vue";
let dracDom = null;
class DomManegiment {
  constructor(parentAreaElement) {
    if (!parentAreaElement) {
      console.error("DomManegiment: parentAreaElementが未定義です。");
    }
    this.parentArea = parentAreaElement;
    this.currentDropTarget = null;
  }
  domDrag(pos) {
    dracDom = document.elementFromPoint(pos.x, pos.y);
    if (
      !dracDom.classList.contains("item") &&
      !dracDom.classList.contains("case")
    )
      dracDom = null;
  }
  domAddcleate(element) {
    const div = document.createElement("div");
    const addSpan = (text) => {
      const span = document.createElement("span");
      span.classList.add("textContent");
      span.textContent = text;
      span.style.pointerEvents = "none";
      return span;
    };
    if (element.type == "case") {
      const closeButton = document.createElement("div");
      closeButton.classList.add("closeButton");
      div.appendChild(closeButton);
    }
    if (element.type == "item") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("checkBoxClass");
      div.appendChild(checkbox);
    }
    div.classList.add(element.type);
    div.appendChild(addSpan(element.name));
    //アイコン追加
    const imageArea = document.createElement("div");
    imageArea.classList.add("imageAreaClass");
    let icon = element.icon;
    if (icon == null) {
      icon = items.search(element.name)[0].icon;
      if (!icon) {
        icon = "add";
      }
    }
    this.mountIcon(imageArea, { name: icon, scale: 0.5 });
    div.appendChild(imageArea);
    div.draggable = true;
    return div;
  }
  mountIcon(container, props) {
    const vnode = h(useIcons, props);
    render(vnode, container);
  }
  addDOM(element, dropTarget, processed) {
    let newDom = null;
    if (processed) {
      newDom = element;
    } else {
      newDom = this.domAddcleate(element);
    }

    if (
      dropTarget === this.parentArea ||
      dropTarget.classList.contains("parentArea")
    ) {
      this.parentArea.appendChild(newDom);
      return;
    }

    let target = dropTarget;
    if (
      target.classList.contains("textContent") ||
      target.classList.contains("checkBoxClass")
    ) {
      target = target.parentElement;
    }
    if (element.type === "item" || element.type === "case" || processed) {
      if (target.classList.contains("item")) {
        const parentClass = target.parentElement;
        parentClass.appendChild(newDom);
        return;
      }
      if (target.classList.contains("case")) {
        if (this.hasClassInElement(target, "openButton")) {
          newDom.style.display = "none";
        }
        target.appendChild(newDom);
        return;
      }
    }

    this.parentArea.appendChild(newDom);
  }

  getAllTextContent() {
    const spans = this.parentArea.querySelectorAll("span.textContent");
    const texts = Array.from(spans).map((span) => span.textContent);
    return texts;
  }

  textChangeDom(thisDom) {
    if (thisDom.classList.contains("parent")) return;
    const span = thisDom.querySelector(".textContent");
    if (!span) return;
    const input = document.createElement("input");
    input.classList.add("newNameInputBox");
    input.type = "text";
    input.value = span.textContent;
    span.replaceWith(input);
    input.focus();

    const revert = () => {
      if (input && input.parentNode) {
        const newSpan = document.createElement("span");
        newSpan.classList.add("textContent");
        newSpan.textContent = input.value;
        newSpan.style.pointerEvents = "none";
        input.replaceWith(newSpan);
      }
    };
    input.addEventListener("blur", revert);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  }

  openMenu(thisDom) {
    thisDom.classList.add("hover");
  }

  rmDom(thisDom) {
    if (
      thisDom.classList.contains("case") ||
      thisDom.classList.contains("item")
    ) {
      thisDom.remove();
    }
  }

  alldelete() {
    this.parentArea.innerHTML = "";
  }

  addparseDom(element, checkBoxBool = null) {
    const div = this.domAddcleate(element);
    if (checkBoxBool != null) {
      const checkbox = div.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = Number(checkBoxBool);
      }
    }
    if (element.parent === null) {
      this.parentArea.appendChild(div);
    } else {
      element.parent.appendChild(div);
    }
    if (element.type === "case") {
      return div;
    }
    return;
  }

  parseHtmlItemarray(arrayElement, parent) {
    if (!Array.isArray(arrayElement)) {
      const this_name = arrayElement.slice(0, -1);
      this.addparseDom(
        {
          name: this_name,
          parent: parent,
          type: "item",
        },
        arrayElement.slice(-1)
      );
      return arrayElement;
    }
    let this_parent;
    arrayElement.forEach((elem, index) => {
      if (index === 0) {
        this_parent = this.addparseDom({
          name: elem,
          parent: parent,
          type: "case",
        });
        return;
      }
      this.parseHtmlItemarray(elem, this_parent);
    });
  }

  parseJsonHtml(arrayHtml) {
    arrayHtml.forEach((elem) => {
      this.parseHtmlItemarray(elem, null);
    });
  }

  parseElement(elem) {
    if (elem.classList.contains("item")) {
      const checkbox = elem.querySelector('input[type="checkbox"]');
      const checked = checkbox ? checkbox.checked : 0;
      let parseBool = "0";
      if (checked == true) parseBool = "1";
      const text =
        elem.querySelector(".textContent").textContent.trim() + parseBool;
      return text;
    }

    if (elem.classList.contains("case")) {
      const title = elem
        .querySelector(":scope > .textContent")
        .textContent.trim();
      const children = [];
      elem
        .querySelectorAll(":scope > .item, :scope > .case")
        .forEach((child) => {
          children.push(this.parseElement(child));
        });

      return [title, ...children];
    }
  }

  htmlToArray() {
    const result = [];
    this.parentArea
      .querySelectorAll(":scope > .item, :scope > .case")
      .forEach((elem) => {
        result.push(this.parseElement(elem));
      });
    return result;
  }

  hasClassInElement(parent, className) {
    return parent.querySelector(`.${className}`) !== null;
  }
}

const emit = defineEmits(["sendTopber", "sendUnderber", "sendLostItemWindow"]);
const parentArea = ref(null);
const item = ref(null);
const domManager = ref(null);

let sendBool = true;
// function setUpNewpage() {
//   const saveData = localStorage.getItem("data");
// }
onMounted(async () => {
  // const data = await post("/json/get"); //本番用

  if (parentArea.value) {
    domManager.value = new DomManegiment(parentArea.value);
  } else return;

  const handleMouseDown = (e) => {
    if (domManager.value) {
      domManager.value.domDrag(e);
    }
  };
  // if (data.loginBool == false) return;

  // if (data.loginBool == true) {
  //   //本番用
  //   emit(
  //     "sendTopber",
  //     JSON.stringify({
  //       innerText: "ログインされてます",
  //       sendBool: sendBool,
  //       type: "login",
  //     })
  //   );
  // } //本番用ここまで

  // if (data.windowInfo == null) return;
  // const this_data = JSON.parse(data.windowInfo);
  const this_data = JSON.parse(localStorage.getItem("data"));
  if (this_data.arrayHtml.length > 0) {
    domManager.value.parseJsonHtml(this_data.arrayHtml);
  }
  if (Object.keys(this_data.addItems).length > 0) {
    const addItems = JSON.stringify(this_data.addItems);
    emit("sendUnderber", addItems);
  }
  window.addEventListener("mousedown", handleMouseDown);
  onUnmounted(() => {
    window.removeEventListener("mousedown", handleMouseDown);
  });
});
async function checkLostItem() {
  if (!domManager.value) return;
  const getTexts = domManager.value.getAllTextContent();
  const itemsText = getTexts.join(", ");
  emit("sendLostItemWindow", JSON.stringify({ type: "waitResponse" }));
  const responseData = await post("/gemini/itemsCheck", itemsText);
  emit(
    "sendLostItemWindow",
    JSON.stringify({ type: "sendRespose", data: responseData })
  );
}
let openMenuDom = null;
function menuPos(pos) {
  if (openMenuDom != null) openMenuDom.classList.remove("hover");
  if (!domManager.value) return;
  switch (pos.menu) {
    case "削除":
      if (openMenuDom != null) domManager.value.rmDom(openMenuDom);
      break;
    case "名前変更":
      if (openMenuDom != null) domManager.value.textChangeDom(openMenuDom);
      break;
    case "openMenu":
      openMenuDom = document.elementFromPoint(pos.pos.x, pos.pos.y);
      if (
        !openMenuDom.classList.contains("case") &&
        !openMenuDom.classList.contains("item")
      ) {
        openMenuDom = null;
        return;
      }
      domManager.value.openMenu(openMenuDom);
      break;
  }
}

async function downloadPDF() {
  if (!domManager.value || !parentArea.value) return;
  await nextTick();
  const target = parentArea.value;
  target.scrollTop = 0;

  const height = target.scrollHeight;
  const canvas = await html2canvas(target, {
    scale: 2,
    useCORS: true,
    width: target.clientWidth,
    height: height,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let y = 0;
  while (y < imgHeight) {
    pdf.addImage(imgData, "PNG", 0, -y, imgWidth, imgHeight);
    y += 297;

    if (y < imgHeight) pdf.addPage();
  }
  pdf.save("vue-content.pdf");
}

function cleateSaveData() {
  if (!domManager.value || !parentArea.value) return;
  const this_itemList = items.getAddItemList();
  const arrayHtml = domManager.value.htmlToArray();
  const data = {
    arrayHtml: arrayHtml,
    addItems: this_itemList,
  };
  return JSON.stringify(data);
}

// async function sendSaveDataBese() {
//   const data = cleateSaveData();
//   const logText = await post("/json/send", data);
//   sendBool = !sendBool;
//   emit(
//     "sendTopber",
//     JSON.stringify({
//       innerText: logText,
//       bool: sendBool,
//       type: "save",
//     })
//   );
// }

async function sendSaveClientStrage() {
  const data = cleateSaveData();
  localStorage.setItem("data", data);
  sendBool = !sendBool;
  emit(
    "sendTopber",
    JSON.stringify({
      innerText: "保存されました",
      bool: sendBool,
      type: "save",
    })
  );
}

function onDrop(event) {
  const { clientX, clientY } = event;
  const thisDom = document.elementFromPoint(clientX, clientY);
  if (!thisDom) return;
  if (dracDom != null) {
    DropsFromParentArea(thisDom);
    return;
  }
  DropsFromItems(thisDom);
}
let processed = true;
function DropsFromItems(thisDom) {
  if (!item.value || !domManager.value) return;
  const thisItem = JSON.parse(item.value);
  let processed = false;
  domManager.value.addDOM(thisItem, thisDom, processed);
}
function DropsFromParentArea(thisDom) {
  domManager.value.addDOM(dracDom, thisDom, processed);
  dracDom = null;
}

const props = defineProps({
  sendItem: String,
  menuInfo: String,
  topbarSend: String,
});

async function topMenuSend(topbarSend) {
  if (!domManager.value) return;
  switch (topbarSend.menu) {
    case "出力":
      downloadPDF();
      break;
    case "全て削除":
      domManager.value.alldelete();
      break;
    case "ログイン":
      window.location.href = "/api/auth/login";
      break;
    case "ログアウト":
      window.location.href = "/api/user/logout";
      break;
    case "保存":
      sendSaveClientStrage();
      break;
    case "忘れ物診断":
      checkLostItem();
      break;
  }
}

watch(
  () => props.sendItem,
  (newVal) => {
    item.value = newVal;
  }
);

watch(
  () => props.menuInfo,
  (newVal) => {
    if (newVal) {
      menuPos(JSON.parse(newVal));
    }
  }
);

watch(
  () => props.topbarSend,
  (newVal) => {
    if (newVal) {
      topMenuSend(JSON.parse(newVal));
    }
  }
);

window.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("closeButton") &&
    !e.target.classList.contains("openButton")
  )
    return;
  if (e.target.classList.contains("closeButton")) {
    e.target.className = "";
    e.target.classList.add("openButton");
  } else {
    e.target.className = "none";
    e.target.classList.add("closeButton");
  }
  const caseDom = e.target.parentElement;
  const children = caseDom.children;

  for (const child of children) {
    if (child.classList.contains("case") || child.classList.contains("item")) {
      if (child.style.display == "none") {
        child.style.display = "";
      } else {
        child.style.display = "none";
      }
    }
  }
});
</script>

<style>
.case {
  position: relative;
  width: 100%;
  height: auto;
  font-size: 25px;
  background-color: #9ca3af;
  border-radius: 3px;
  color: white;
  font-family: "ヒラギノ角ゴ Std W8", "Hiragino Kaku Gothic Std";
  z-index: 2;
  border: 3px solid rgba(102, 101, 101, 0.878);
  margin: 10px 0px;
}
.checkBoxClass {
  position: absolute;
  left: 15px;
  transform: translate(0%, 50%);
}
.case .item {
  background-color: rgb(255, 255, 255);
  margin: 3px;
}
.case .case {
  margin: 3px 15px;
}
.item {
  z-index: 3;
  width: 100%;
  height: auto;
  font-family: "ヒラギノ角ゴ Std W8", "Hiragino Kaku Gothic Std";
  font-size: 20px;
  color: rgb(92, 87, 87);
  padding: 5px 10px;
  flex-flow: column;
  position: relative;
  display: flex;
  margin: 10px 0px;
}
.item:hover {
  border: 2px solid #33a23d;
  box-sizing: border-box;
}
.case:hover {
  border: 2px solid #33a23d;
  box-sizing: border-box;
}
.hover {
  border: 2px solid #33a23d;
  box-sizing: border-box;
}
.closeButton {
  position: absolute;
  transform: translate(50%, 80%);
  width: 18px;
  height: 15px;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background-color: #e8e5e5;
  z-index: 30;
}
.openButton {
  position: absolute;
  transform: translate(50%, 80%);
  width: 18px;
  height: 15px;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
  background-color: #e8e5e5;
  z-index: 30;
}

.closeButton:hover {
  background-color: #ffffff;
}
.openButton:hover {
  background-color: #ffffff;
}
.textContent {
  display: flex;
  align-items: top;
  padding-left: 160px;
}
.imageAreaClass {
  position: absolute;
  top: -1px;
  left: 50px;
}
.newNameInputBox {
  font-size: 20px;
  display: flex;
  align-items: center;
  padding-left: 160px;
  font-family: "ヒラギノ角ゴ Std W8", "Hiragino Kaku Gothic Std";
}
</style>
<style scoped>
.parent {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 10px 0px;
}
.parentArea {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 150%;
}
</style>
//ショートカットキー追加 //人の持ち物リストを見る、取得　公開できるように
//https://docs.google.com/presentation/u/0/?ec=wgc-slides-globalnav-goto&tgif=d
のデザインを参考に
