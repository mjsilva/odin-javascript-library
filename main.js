let app;

function App() {
  const hideAllViews = () => {
    [...document.querySelectorAll(".main section")].forEach((el) => {
      el.classList.remove("visible");
    });
  };

  const showView = (viewName) => {
    const el = document.querySelector(`.main section.${viewName}`);
    el.classList.add("visible");
  };

  this.switchView = function (viewName) {
    hideAllViews();
    showView(viewName);
  };
}

app = app || new App();

// EVENT LISTENERS
[...document.querySelectorAll(".nav-action-wrapper > span")].forEach((el) => {
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    app.switchView(event.currentTarget.dataset.view);
  });
});
