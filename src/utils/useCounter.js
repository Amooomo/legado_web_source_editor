import { reactive, toRefs, watchEffect } from "vue";
import store from "@/store";

export default function () {
  const data = reactive({
    bookContent: store.state.currentSource
  });
  const upData = (data) => {
    store.commit("changeCurrentSourceValue", data);
  };
  const setContent = (elId) => {
    try {
      if (elId.includes("_")) {
        let rule1 = elId.split("_")[0];
        let rule2 = elId.split("_")[1];
        return data.bookContent[rule1][rule2];
      } else {
        return data.bookContent[elId];
      }
    } catch (e) {
      console.log("导入错误", e.TypeError);
      store.commit("clearEdit");
    }
  };

  watchEffect(() => {
    data.bookContent = store.state.currentSource;
  });
  return {
    ...toRefs(data),
    upData,
    setContent,
  };
}
