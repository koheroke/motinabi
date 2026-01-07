const items = {
  貴重品: [
    {
      name: "現地通貨",
      id: "cashStack",
      icon: "cashStack",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "お金",
      id: "cash",
      icon: "cash",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],
  収容: [
    {
      name: "かばん",
      id: "briefcase",
      icon: "briefcase",
      type: "case",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "スーツケース",
      id: "suitcase",
      icon: "suitcase",
      type: "case",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],
  衣類: [
    {
      name: "パジャマ",
      id: "shirtButton",
      icon: "shirtButton",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "上着",
      id: "tshirt",
      icon: "tshirt",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "シャツ",
      id: "jacket",
      icon: "jacket",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "下着",
      id: "underwear",
      icon: "underwear",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "ズボン",
      id: "pants",
      icon: "pants",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],
  洗面衛生: [
    {
      name: "石鹸",
      id: "soapPump",
      icon: "soapPump",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "歯ブラシ",
      id: "toothbrush",
      icon: "toothbrush",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "カミソリ",
      id: "razor",
      icon: "razor",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "スプレー",
      id: "sprayBottle",
      icon: "sprayBottle",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],
  医薬品: [
    {
      name: "包帯",
      id: "bandage",
      icon: "bandage",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "薬瓶",
      id: "medicineBottle",
      icon: "medicineBottle",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],
  電子機器: [
    {
      name: "スマホ",
      id: "smartphone",
      icon: "smartphone",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "電卓",
      id: "calculator",
      icon: "calculator",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "電池残量",
      id: "batteryLow",
      icon: "batteryLow",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "予備電池",
      id: "batteryPlusMinus",
      icon: "batteryPlusMinus",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "カメラ",
      id: "camera",
      icon: "camera",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "懐中電灯",
      id: "flashlight",
      icon: "flashlight",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "扇風機",
      id: "fan",
      icon: "fan",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],
  レジャー: [
    {
      name: "水着",
      id: "swimsuit",
      icon: "swimsuit",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "水泳パン",
      id: "swimShorts",
      icon: "swimShorts",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "スリッパ",
      id: "slippers",
      icon: "slippers",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "傘",
      id: "umbrella",
      icon: "umbrella",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "チケット",
      id: "ticket",
      icon: "ticket",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "メガネ",
      id: "glasses",
      icon: "glasses",
      type: "item",
      editing: false,
      deleteTrue: false,
    },
    {
      name: "追加",
      id: "add",
      icon: "add",
      type: "icon",
      editing: false,
      deleteTrue: false,
    },
  ],

  search(name, parent = null) {
    if (parent != null) {
      return this[parent].filter((obj) => obj.name === name);
    }
    const result = Object.values(this)
      .filter(Array.isArray)
      .flat()
      .filter((obj) => obj.name === name);
    return result;
  },
  add(item) {
    const this_elem = this[item.element];
    this_elem.splice(this_elem.length - 1, 0, item);
  },
  delete(item) {
    const list = this[item.element];
    const index = list.findIndex((elem) => elem.id === item.id);
    list.splice(index, 1);
  },
  reName(item, newName) {
    const list = this[item.element];
    const index = list.findIndex((elem) => elem.id === item.id);
    list[index].name = newName;
  },

  getAddItemList() {
    const result = {};
    const keys = Object.keys(this).filter((key) => Array.isArray(this[key]));
    keys.forEach((key) => {
      const addItems = this[key]
        .filter((item) => item.deleteTrue === true)
        .map((item) => item.name);

      if (addItems.length > 0) {
        result[key] = addItems;
      }
    });
    return result;
  },
};
export default items;
