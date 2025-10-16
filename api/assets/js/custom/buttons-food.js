window.addEventListener("load", () => {
  let btnsChangeFood = document.querySelectorAll(".buttons-food"),
    foodDiv = document.querySelectorAll(".food-div");

  foodDiv.forEach((item, index) => {
    item.addEventListener("mouseover", () => {
      btnsChangeFood[index].classList.remove("d-none");
    });
  });

  foodDiv.forEach((item, index) => {
    item.addEventListener("mouseout", () => {
      btnsChangeFood[index].classList.add("d-none");
    });
  });
});
