/////// Create loading message //////////
function showLoadingMessage() {
  $('#loadingModal').modal({ backdrop: 'static', keyboard: false });
}

//////// Remove loading message //////////
function hideLoadingMessage() {
  $('#loadingModal').modal('hide');
}

/////////// Create element and assign values //////////////
function buildElement(
  createElementText,
  innerText,
  elementClasses = null,
  event = null,
  eventFunction = null
) {
  /////// Check if createElementText is valid HTML
  if (typeof createElementText !== 'string') {
    /* eslint-disable no-console */
    console.error('buildElement: Enter valid HTML for createElementText');
    /* eslint-enable no-console */
    return;
  }

  let dummyElement = document.createElement('p');
  dummyElement.innerHTML = createElementText;
  let childNodes = dummyElement.childNodes;
  if (childNodes[0].nodeType !== 1) {
    /* eslint-disable no-console */
    console.error('buildElement: Enter valid HTML for createElementText');
    /* eslint-enable no-console */
    return;
  }

  // Build element
  let element = $(createElementText);

  if (innerText && typeof innerText === 'string') {
    element.append(document.createTextNode(innerText));
  }

  if (elementClasses) {
    if (Array.isArray(elementClasses)) {
      elementClasses.forEach((item) => {
        if (typeof item === 'string') {
          element.addClass(item);
        }
      });
    } else if (typeof elementClasses === 'string') {
      element.addClass(elementClasses);
    }
  }

  if (
    event &&
    eventFunction &&
    typeof event === 'string' &&
    typeof eventFunction === 'function'
  ) {
    element.on(event, eventFunction);
  }

  return element;
}

////////////////////// Modal ////////////////////////////////
let modalRepo = (function () {
  /////////// Variables /////////////
  let prevX = null;
  let prevY = null;

  function getTouches(e) {
    return e.touches || e.originalEvent.touches;
  }

  ////////// Initiate swipe ////////////
  function handleStart(e) {
    let firstTouch = getTouches(e);
    prevX = firstTouch[0].clientX;
    prevY = firstTouch[0].clientY;
  }

  /////// Reset swipe vars ////////////
  function handleEnd() {
    prevX = null;
    prevY = null;
  }

  //////// Handle swipe functionality ////////
  function handleMove(e) {
    if (!prevX || !prevY) {
      return;
    }

    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    let xDiff = x - prevX;
    let yDiff = y - prevY;

    // Itterate to the next/previous pokemon
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      let pokemonList = pokemonRepository.getAll();
      let position = pokemonList.indexOf(pokemonRepository.getCurrent());

      if (xDiff > 0) {
        // swipe rigght
        if (position !== pokemonList.length - 1) {
          pokemonRepository.showDetails(pokemonList[position + 1]);
        }
      } else {
        // swipe left
        if (position !== 0) {
          pokemonRepository.showDetails(pokemonList[position - 1]);
        }
      }
    }

    prevX = null;
    prevY = null;
  }

  ///////////// Build and show modal /////////////////
  function showModal(pokemon) {
    // Get Modal Elements
    let modal = $('#infoModal .modal-dialog');
    let modalTitle = $('#infoModal .modal-title');
    let modalBody = $('.modal-body');

    modalTitle.empty();
    modalBody.empty();

    // Make Header
    // title
    let titleElement = buildElement(
      '<h2></h2>',
      '#' + pokemon.id + ' ' + pokemon.name
    );
    modalTitle.append(titleElement);

    // Make Body
    // pokemon text
    modalBody.append(buildElement('<p></p>', pokemon.flavorText));

    let statsElement = buildElement('<ul></ul>', null, 'pokemon-stats');

    let heightElement = buildElement('<li></li>', 'Height: ');
    statsElement.append(heightElement);
    heightElement.append(buildElement('<p></p>', pokemon.height.toString()));

    let text = 'Type:';
    let typeElement = buildElement('<li></li>', text);
    statsElement.append(typeElement);

    text = '';
    for (let i = 0; i < pokemon.types.length; i++) {
      text += pokemon.types[i].type.name;

      if (i !== pokemon.types.length - 1) {
        text += ', ';
      }
    }

    typeElement.append(buildElement('<p></p>', text));

    text = 'Abilities: ';
    let abilitiesElement = buildElement('<li></li>', text);
    statsElement.append(abilitiesElement);

    text = '';
    for (let i = 0; i < pokemon.abilities.length; i++) {
      text += pokemon.abilities[i].ability.name;

      if (i !== pokemon.types.length - 1) {
        text += ', ';
      }
    }
    abilitiesElement.append(buildElement('<p></p>', text));

    modalBody.append(statsElement);

    // image container (prevButton, image, nextButton)
    let imageContainer = buildElement(
      '<div></div>',
      null,
      'modal-image-container'
    );

    // prevButton
    let pokemonList = pokemonRepository.getAll();
    let position = pokemonList.indexOf(pokemon);
    if (position !== 0) {
      let prevButtonElement = buildElement(
        '<button></button>',
        '<',
        'modal-prev',
        'click',
        () => {
          pokemonRepository.showDetails(pokemonList[position - 1]);
        }
      );

      imageContainer.append(prevButtonElement);
    }

    // image
    let imageElement = buildElement('<img>', null, 'modal-picture');
    imageElement.attr('src', pokemon.imageURL);
    imageElement.attr('alt', pokemon.name);
    imageContainer.append(imageElement);

    // nextButton
    if (position !== pokemonList.length - 1) {
      let nextButtonElement = buildElement(
        '<button></button>',
        '>',
        'modal-next',
        'click',
        () => {
          pokemonRepository.showDetails(pokemonList[position + 1]);
        }
      );

      imageContainer.append(nextButtonElement);
    }

    modalBody.append(imageContainer);

    // Add swipe event listeners
    modal.on('touchstart', handleStart);
    modal.on('touchend', handleEnd);
    modal.on('touchcancel', handleEnd);
    modal.on('touchmove', (e) => handleMove(e));
  }

  /////////// Return ///////////////
  return {
    showModal: showModal,
  };
})();

////////////////////////// Pokemon List ///////////////////////////////
let pokemonRepository = (function () {
  //////////// Variables /////////////
  let pokemonList = [];
  let currentPokemon = null;
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  /////////// Add a pokemon to pokemonList //////////
  function add(pokemon) {
    if (typeof pokemon === 'object') {
      let keys = Object.keys(pokemon);
      if (keys.includes('name') && keys.includes('detailsURL')) {
        pokemonList.push(pokemon);
        return;
      }
    }
  }

  ////////// Return pokemonList //////////
  function getAll() {
    return pokemonList;
  }

  ///// Return current pokemon that is showing info //////
  function getCurrent() {
    return currentPokemon;
  }

  ///// Return pokemon names that inlude string parameter /////
  function getFiltered(name) {
    return pokemonList.filter((pokemon) =>
      pokemon.name.includes(name.toUpperCase())
    );
  }

  //////// Add list element to HTML page ///////////
  function addListItem(pokemon) {
    // Create list item
    const node = $('<li></li>');
    node.addClass('list-group-item');

    // Create button
    let classArr = ['btn', 'btn-primary', 'custom-button'];
    let button = buildElement(
      '<button></button>',
      pokemon.name,
      classArr,
      'click',
      () => {
        showDetails(pokemon);
      }
    );
    button.attr('data-toggle', 'modal');
    button.attr('data-target', '#infoModal');
    button.attr('id', pokemon.name);
    let imagePlaceholder = $('<img>');
    imagePlaceholder.attr('height', '100');
    imagePlaceholder.attr('width', '100');
    button.append(imagePlaceholder);
    node.append(button);

    // Add item to list
    let pokemonListElement = $('.pokemonList');
    pokemonListElement.append(node);
  }

  ///////// Remove all list items ////////////
  function clearList() {
    let pokemonListElement = $('.pokemonList');
    pokemonListElement.empty();
  }

  ///// Clear current list and print the filtered list to the HTML page /////
  function printFiltered(name) {
    if (name === '') {
      clearList();
      getAll().forEach(function (item) {
        addListItem(item);
      });
    } else {
      clearList();
      getFiltered(name).forEach(function (item) {
        addListItem(item);
      });
    }

    showPokemonImages();
  }

  ///////// Load pokemon list from JSON////////////
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name.toUpperCase(),
            detailsURL: item.url,
          };
          add(pokemon);
        });
        hideLoadingMessage();
      })
      .catch(function (e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
        hideLoadingMessage();
      });
  }

  /////// Add pokemon images to buttons ///////////
  function showPokemonImages() {
    for (let i = 0; i < pokemonList.length; i++) {
      let image = $('#' + pokemonList[i].name + ' img');
      image.attr('src', pokemonList[i].imageURL);
      if (i < 10) {
        image.attr('loading', 'lazy');
      }
      image.attr('height', '100');
      image.attr('width', '100');
      image.attr('alt', pokemonList[i].name + ' image');
    }
  }

  ////////// Load pokemon stats/info into pokemon object //////////////
  function loadDetails(item) {
    let url = item.detailsURL;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageURL = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
        item.id = details.id;
        item.abilities = details.abilities;
        item.infoURL = details.species.url;
      })
      .catch(function (e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
        hideLoadingMessage();
      });
  }

  function loadSpeciesInfo(item) {
    let url = item.infoURL;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.flavorText = details.flavor_text_entries[0].flavor_text;
        item.flavorText = item.flavorText.replaceAll('\n', ' ');
        hideLoadingMessage();
      })
      .catch(function (e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
        hideLoadingMessage();
      });
  }
  //////////// Print pokemon details in console ////////////
  function showDetails(pokemon) {
    showLoadingMessage();
    loadDetails(pokemon).then(function () {
      currentPokemon = pokemon;
      loadSpeciesInfo(pokemon).then(function () {
        modalRepo.showModal(pokemon);
      });
    });
  }

  ////////// Return /////////////
  return {
    add: add,
    getAll: getAll,
    getFiltered: getFiltered,
    addListItem: addListItem,
    printFiltered: printFiltered,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    getCurrent: getCurrent,
    showPokemonImages: showPokemonImages,
  };
})();

////////// Load pokemon //////////
pokemonRepository.loadList().then(function () {
  let pokemonList = $('.pokemonList');
  pokemonList.empty();
  let promises = [];
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
  pokemonRepository.getAll().forEach(function (pokemon) {
    promises.push(pokemonRepository.loadDetails(pokemon));
  });
  Promise.allSettled(promises).then(function () {
    pokemonRepository.showPokemonImages();
  });
});

//////// Filter pokemon list when searchbar value changes //////////
let searchBar = document.querySelector('#search');
searchBar.addEventListener('input', function (e) {
  pokemonRepository.printFiltered(e.target.value);
});
