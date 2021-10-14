const autoCompleteConfig = {
  renderOption(game) {
    const imgSRC = game.thumb === "N/A" ? " " : game.thumb;
    return `
    <img src="${imgSRC}" />
    ${game.title}
    ${game.salePrice}
  `;
  },
  inputValue(game) {
    return game.title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get(
      "https://www.cheapshark.com/api/1.0/deals?",
      {
        params: {
          title: searchTerm,
          pageSize: 10,
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
    `https://www.cheapshark.com/api/1.0/deals?id=${game.dealID}`
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
  //To compare pricing and rating you can use
  // const dealPrice = parseFloat(gameDetail.deals[0].price)

  // for metascore rating it would be the same thing just using a different variable
  // const metaScoreRating = parseInt(gameDetail.rating.replace(/,/g, '')

  return `
    <article class="media">
      <figure class='media-left'>
        <p class='image'>
          <img src="${gameDetail.gameInfo.thumb}" />
        </p>
      </figure>
      <div class='media-content'>
        <div class='content'>
        <h1>${gameDetail.gameInfo.name}</h1>
        <h5>Game Genre goes here...</h5>
        
        <p>Game summary goes here...</p>

        <input type='button' value='Add to Favorites' />

        </div>
      </div>
      </article>
      <article class="notification is-primary">
        <p class='title'>${gameDetail.gameInfo.salePrice}</p>
        <p class='subtitle'>Cheapest Price</p>

      </article>
      <article class="notification is-primary">
        <p class='title'>${gameDetail.gameInfo.steamRatingPercent} (${gameDetail.gameInfo.steamRatingText}) </p>
        <p class='subtitle'>Steam Rating</p>
      </article>
    <article class="notification is-primary">
      <p class='title'>Gameplay Trailer goes here</p>
      <p class='subtitle'>Gameplay</p>
    </article>
  `;
};

{
  /* <input type="button" onclick="location.href='https://www.cheapshark.com/redirect?dealID=${gameDetail.dealID}';" value=" Get this Deal!" />  */
}
