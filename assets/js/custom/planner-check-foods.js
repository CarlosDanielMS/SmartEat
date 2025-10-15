window.addEventListener("load", () => {
  let sectionContent = document.querySelector("section.content"),
    pPercentage = parseFloat(sectionContent.getAttribute("data-p")),
    cPercentage = parseFloat(sectionContent.getAttribute("data-c")),
    fPercentage = parseFloat(sectionContent.getAttribute("data-f")),
    meals = document.querySelectorAll(".meals"),
    caloriesMeals = document.querySelectorAll(".calories-meal"),
    inputFoodsP = document.querySelectorAll("[name=P]"),
    inputFoodsC = document.querySelectorAll("[name=C]"),
    inputFoodsF = document.querySelectorAll("[name=F]"),
    url = sectionContent.getAttribute("data-url");

  for (let i = 0; i < meals.length; i++) {
    if (!caloriesMeals[i]) continue;

    let subtractingCaloriesTotal = parseFloat(
      caloriesMeals[i].getAttribute("data-calories-meal")
    );

    if (inputFoodsP[i] && inputFoodsP[i].checked) {
      let subtractingCalories =
        parseFloat(caloriesMeals[i].innerHTML.split(" ")[0]) -
        subtractingCaloriesTotal * pPercentage;
      caloriesMeals[i].innerHTML = `${subtractingCalories.toFixed(2)} Calorias`;
    }

    if (inputFoodsC[i] && inputFoodsC[i].checked) {
      let subtractingCalories =
        parseFloat(caloriesMeals[i].innerHTML.split(" ")[0]) -
        subtractingCaloriesTotal * cPercentage;
      caloriesMeals[i].innerHTML = `${subtractingCalories.toFixed(2)} Calorias`;
    }

    if (inputFoodsF[i] && inputFoodsF[i].checked) {
      let subtractingCalories =
        parseFloat(caloriesMeals[i].innerHTML.split(" ")[0]) -
        subtractingCaloriesTotal * fPercentage;
      caloriesMeals[i].innerHTML = `${subtractingCalories.toFixed(2)} Calorias`;
    }

    if (parseFloat(caloriesMeals[i].innerHTML.split(" ")[0]) < 1) {
      caloriesMeals[i].innerHTML = "0.00 Calorias";
    }
  }

  for (let k = 0; k < inputFoodsP.length; k++) {
    inputFoodsP[k].addEventListener("change", async () => {
      if (!caloriesMeals[k] || !inputFoodsP[k]) return;

      let subtractingCaloriesTotal = parseFloat(
        caloriesMeals[k].getAttribute("data-calories-meal")
      );

      if (inputFoodsP[k].checked) {
        await fetch(`${url}/app/planner/food-checked`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked: 1,
            food_id: inputFoodsP[k].getAttribute("data-food_id"),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error Requisition");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });

        let subtractingCalories =
          parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) -
          subtractingCaloriesTotal * pPercentage;
        caloriesMeals[k].innerHTML = `${subtractingCalories.toFixed(2)} Calorias`;
      } else {
        await fetch(`${url}/app/planner/food-checked`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked: 0,
            food_id: inputFoodsP[k].getAttribute("data-food_id"),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error Requisition");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });

        let addingCalories =
          parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) +
          subtractingCaloriesTotal * pPercentage;
        caloriesMeals[k].innerHTML = `${addingCalories.toFixed(2)} Calorias`;
      }

      if (parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) < 1) {
        caloriesMeals[k].innerHTML = "0.00 Calorias";
      }
    });
  }

  for (let k = 0; k < inputFoodsC.length; k++) {
    inputFoodsC[k].addEventListener("change", async () => {
      if (!caloriesMeals[k] || !inputFoodsC[k]) return;

      let subtractingCaloriesTotal = parseFloat(
        caloriesMeals[k].getAttribute("data-calories-meal")
      );

      if (inputFoodsC[k].checked) {
        await fetch(`${url}/app/planner/food-checked`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked: 1,
            food_id: inputFoodsC[k].getAttribute("data-food_id"),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error Requisition");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });

        let subtractingCalories =
          parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) -
          subtractingCaloriesTotal * cPercentage;
        caloriesMeals[k].innerHTML = `${subtractingCalories.toFixed(2)} Calorias`;
      } else {
        await fetch(`${url}/app/planner/food-checked`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked: 0,
            food_id: inputFoodsC[k].getAttribute("data-food_id"),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error Requisition");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });

        let addingCalories =
          parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) +
          subtractingCaloriesTotal * cPercentage;
        caloriesMeals[k].innerHTML = `${addingCalories.toFixed(2)} Calorias`;
      }

      if (parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) < 1) {
        caloriesMeals[k].innerHTML = "0.00 Calorias";
      }
    });
  }

  for (let k = 0; k < inputFoodsF.length; k++) {
    inputFoodsF[k].addEventListener("change", async () => {
      if (!caloriesMeals[k] || !inputFoodsF[k]) return;

      let subtractingCaloriesTotal = parseFloat(
        caloriesMeals[k].getAttribute("data-calories-meal")
      );

      if (inputFoodsF[k].checked) {
        await fetch(`${url}/app/planner/food-checked`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked: 1,
            food_id: inputFoodsF[k].getAttribute("data-food_id"),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error Requisition");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });

        let subtractingCalories =
          parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) -
          subtractingCaloriesTotal * fPercentage;
        caloriesMeals[k].innerHTML = `${subtractingCalories.toFixed(2)} Calorias`;
      } else {
        await fetch(`${url}/app/planner/food-checked`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked: 0,
            food_id: inputFoodsF[k].getAttribute("data-food_id"),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error Requisition");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });

        let addingCalories =
          parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) +
          subtractingCaloriesTotal * fPercentage;
        caloriesMeals[k].innerHTML = `${addingCalories.toFixed(2)} Calorias`;
      }

      if (parseFloat(caloriesMeals[k].innerHTML.split(" ")[0]) < 1) {
        caloriesMeals[k].innerHTML = "0.00 Calorias";
      }
    });
  }
});
