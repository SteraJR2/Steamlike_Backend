const getGamesBtn = document.getElementById("button");
const gamesDiv = document.getElementById("gamesDiv");

let fetchedData;
let displayed = false;

async function gamesList() {
  try {
    const res = await fetch("http://localhost:3000/games");
    fetchedData = await res.json();
  } catch (error) {
    console.error(error);
  }
}

async function displayGames() {
  try {
    if (displayed === true) {
      return;
    } else {
      const dataDiv = document.createElement("div");
      dataDiv.style.textAlign = "center";
      dataDiv.classList.add("gamesStyle");
      gamesDiv.append(dataDiv);
      displayed = true;
      dataDiv.innerHTML += `<span class="headerCell">Name</span> <span class="headerCell">Tags</span> <span class="headerCell">Developer</span> <span class="headerCell">Price</span>`;
      fetchedData.forEach((element) => {
        try {
          dataDiv.innerHTML += `<span class="elementCell"><a style="color:white; text-decoration:none" href="game.html?id=${element.id}">${element.nome}</a></span> <span class="elementCell">[${element.tags}]</span> <span class="elementCell">${element.sviluppatore}</span> <span class="elementCell">${element.prezzo}$</span>`;
        } catch (error) {
          console.error(error);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

const check = localStorage.getItem("wentBack");

async function checkForBack() {
  if (check === "true") {
    await gamesList();
    await displayGames();
  }
  localStorage.setItem("wentBack", "false");
}
checkForBack();

getGamesBtn.addEventListener("click", async () => {
  await gamesList();
  await displayGames();
});
