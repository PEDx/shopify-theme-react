document.addEventListener("DOMContentLoaded", () => {
  const sectionId = document.currentScrip.getAttribute("data-section-id");
  const sectionSettings = document.currentScript.getAttribute(
    "data-section-settings",
  );
  console.log(sectionId, sectionSettings);
  // 初始化 React 应用
  const root = createSection(document.getElementById(sectionId));
  root.render(<App />);
});
