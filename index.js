const autoCompleteConfig = {
  renderOption(game) {
    const imgSRC = game.thumb === "N/A" ? " " : game.thumb;
    return `
    <img src="${imgSRC}" />
    ${game.external}
    ${game.cheapest}
  `;
  },
  inputValue(game) {
    return game.external;
  },
  async fetchData(searchTerm) {
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
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(game) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onGameSelect(game, document.querySelector("#left-summary"), "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(game) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onGameSelect(game, document.querySelector("#right-summary"), "right");
  },
});

let leftGame;
let rightGame;
const onGameSelect = async (game, summaryElement, side) => {
  const response = await axios.get(
    "https://www.cheapshark.com/api/1.0/games?",
    {
      params: {
        id: game.gameID,
      },
    }
  );

  console.log(response.data);
  summaryElement.innerHTML = gameTemplate(response.data);

  if (side === "left") {
    leftGame = response.data;
  } else {
    rightGame = response.data;
  }

  if (leftGame && rightGame) {
    runComparison();
  }
};

const runComparison = () => {
  console.log("time to compares");
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
        <div class='content'>
        <h1>${gameDetail.info.title}</h1>
        <h5>Game Genre goes here...</h5>
        <h4>${gameDetail.deals[0].price}</h4>
        <p>Add to Favorites</p>
        
        <p>Game summary goes here...</p>

        <input type="button" onclick="location.href='https://www.cheapshark.com/redirect?dealID=${gameDetail.deals[0].dealID}';" value=" Get this Deal!" /> 
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class='title'>Steam or metacritic score goes here...</p>
      <p class='subtitle'>Rating</p>
    </article>
    <article class="notification is-primary">
      <p class='title'>Gameplay Trailer goes here</p>
      <p class='subtitle'>Gameplay</p>
    </article>
  `;
};
