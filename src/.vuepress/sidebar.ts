import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "测试",
      icon: "laptop-code",
      prefix: "demo/",
      link:"demo/",
      collapsible: true,
      children: "structure",
    },
    "slides",
    "guide/",
  
  ],
});
