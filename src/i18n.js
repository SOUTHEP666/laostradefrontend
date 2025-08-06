import { createI18n } from "vue-i18n";
import zh from "./locales/zh";
import lo from "./locales/lo";

const i18n = createI18n({
  legacy: false,
  locale: "zh", // 默认语言
  fallbackLocale: "zh",
  messages: {
    zh,
    lo,
  },
});

export default i18n;
