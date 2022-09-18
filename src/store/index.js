import { createStore } from "vuex";

export default createStore({
  state: {
    url: localStorage.getItem("url") || "",
    bookSources: [], // 临时存放所有书源,
    rssSources: [],   // 临时存放所有订阅源
    currentSource: {}, // 当前编辑的源
    currentTab: localStorage.getItem("tabName") || "editTab",
    editTabSourceInfo: {},  // 生成序列化的json数据
    deBugMsg: "",
    searchKey: "",
  },
  getters: {},
  mutations: {
    changeSearchKey(state, key) {
      state.searchKey = key;
    },

    //拉取源后保存
    saveSources(state, data) {
      if (/bookSource/.test(location.href)) {
        state.bookSources = data;
      } else {
        state.rssSources = data;
      }
    },
    // 更改当前编辑的源
    changeCurrentSource(state, source) {
      const newContent = JSON.stringify(source);
      state.currentSource = JSON.parse(newContent);
    },
    // 修改当前源的某一个值
    changeCurrentSourceValue(state, data) {
      if (data.type.includes("_")) {
        let rule1 = data.type.split("_")[0],
          rule2 = data.type.split("_")[1],
          value = {};
        value[rule2] = data.value;
        //state.currentSource[rule1] is Object, use `Object.assign` to override value
        state.currentSource[rule1] = Object.assign(state.currentSource[rule1] || {}, value)
      } else {
        state.currentSource[data.type] = data.value;
      }
      // edit last time
      state.currentSource.lastUpdateTime = new Date().getTime();
    },
    // update editTab tabName and editTab info
    changeTabName(state, tabName) {
      state.currentTab = tabName;
      localStorage.setItem("tabName", tabName);
      console.log(tabName);
    },
    changeEidtTabSourceInfo(state) {
      state.editTabSourceInfo = state.currentSource;
    },
    editHistory(state, history) {
      let historyObj;
      if (localStorage.getItem("history")) {
        historyObj = JSON.parse(localStorage.getItem("history"));
        historyObj.new.push(history);
        if (historyObj.new.length > 50) {
          historyObj.new.shift();
        }
        if (historyObj.old.length > 50) {
          historyObj.old.shift();
        }
        localStorage.setItem("history", JSON.stringify(historyObj));
      } else {
        const arr = { new: [history], old: [] };
        localStorage.setItem("history", JSON.stringify(arr));
      }
    },
    editHistoryUndo(state) {
      if (localStorage.getItem("history")) {
        let historyObj = JSON.parse(localStorage.getItem("history"));
        historyObj.old.push(state.currentSource);
        if (historyObj.new.length) {
          state.currentSource = historyObj.new.pop();
        }
        localStorage.setItem("history", JSON.stringify(historyObj));
      }
    },
    clearAllHistory() {
      localStorage.setItem("history", JSON.stringify({ new: [], old: [] }));
    },
    clearEdit(state) {
      state.editTabSourceInfo = {};
      state.currentSource = {};
    },
    appendDeBugMsg(state, msg) {
      let el = document.querySelector("#debug_text");
      el.scrollTop = el.scrollHeight;
      state.deBugMsg += msg + "\n";
    },
    clearDeBugMsg(state) {
      state.deBugMsg = "";
    },

    // clear all source
    clearAllSource(state) {
      state.bookSources = [];
      state.rssSources = [];
    },
  },
  actions: {},
  modules: {},
});
