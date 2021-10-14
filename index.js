const fetchData = async (searchTerm) => {
  const response = await axios.get(
    "https://www.cheapshark.com/api/1.0/games?",
    {
      params: {
        title: searchTerm,
        limit: 10,
      },
    }
  );

  return response.data;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search for a Game</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropwdown-content results">
      </div>
    </div>
  </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (e) => {
  const games = await fetchData(e.target.value);

  if (!games.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let game of games) {
    const option = document.createElement("a");
    const imgSRC = game.thumb === "N/A" ? " " : game.thumb;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src="${imgSRC}" />
      ${game.external}
      ${game.cheapest}
      
    `;

    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = game.external;
      onGameSelect(game);
    });

    resultsWrapper.appendChild(option);
  }
};

input.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

//REMEMBER TO PUT BUTTON BACK LATER!!!!!!
{
  /* <input type="button" onclick="location.href='https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}';" value=" Go to Deal" /> */
}

const onGameSelect = async (game) => {
  const response = await axios.get(
    "https://www.cheapshark.com/api/1.0/games?",
    {
      params: {
        id: game.gameID,
      },
    }
  );

  console.log(response.data);
  document.querySelector("#summary").innerHTML = gameTemplate(response.data);
};

const gameTemplate = (gameDetail) => {
  return `
    <article class="media">
      <figure class='media-left'>
        <p class='image'>
          <img src="${gameDetail.info.thumb}" />
        </p>
      </figure>
      <div class='media-content'>
        <h1>${gameDetail.info.title}</h1>
        <h4>${gameDetail.deals[0].price}</h4>
        
        <p></p>
      </div>
    </article>
  `;
};
