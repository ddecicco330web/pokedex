/////// Create loading message //////////
function showLoadingMessage(){
    /*let loadingMsg = $('#loading-msg');
    loadingMsg.addClass('is-visible');*/
    $('#loadingModal').modal({backdrop: 'static', keyboard: false});
}

//////// Remove loading message //////////
function hideLoadingMessage(){
    //let loadingMsg = $('#loading-msg');
    //loadingMsg.removeClass('is-visible');
    $('#loadingModal').modal('hide');
}

 /////////// Create element and assign values //////////////
 function buildElement(createElementText, innerText, elementClasses = null, event = null, eventFunction = null){
    
    /////// Check if createElementText is valid HTML
    let dummyElement = document.createElement('p');
    dummyElement.innerHTML = createElementText;
    let childNodes = dummyElement.childNodes;
    console.log(childNodes[0].nodeType);
    if(childNodes[0].nodeType !== 1){
        console.log('buildElement: Enter valid HTML for createElementText');
        return;
    }

    // Build element
    let element = $(createElementText);

    if(innerText && typeof(innerText) === 'string'){
        element.append(document.createTextNode(innerText));
    }
   
    if(elementClasses){
        if(Array.isArray(elementClasses)){
            elementClasses.forEach((item) => {
                if(typeof(item) === 'string'){
                    element.addClass(item);
                }
            });
        }
        else if(typeof(elementClasses) === 'string'){
            element.addClass(elementClasses);
        }
    }

    if(event && eventFunction && typeof(event) === 'string' && typeof(eventFunction) === 'function'){
        element.on(event, eventFunction);
    }

    return element;
}

////////////////////// Modal ////////////////////////////////
let modalRepo = (function(){

    /////////// Variables /////////////
    let modalContainer = document.querySelector('#infoModal');
    let prevX = null;
    let prevY = null;

    function hideModal(){
        modalContainer.classList.remove('is-visible');
    }

    ////////// Initiate swipe ////////////
    function handleStart(e){
        prevX = e.pageX;
        prevY = e.pageY;
    }

    /////// Reset swipe vars ////////////
    function handleEnd(){
        prevX = null;
        prevY = null;
    }

    //////// Handle swipe functionality ////////
    function handleMove(e){

        if(!prevX || !prevY){
            return;
        }

        let x = e.pageX;
        let y = e.pageY;

        let xDiff = x - prevX;
        let yDiff = y - prevY;

        // Itterate to the next/previous pokemon
        if(Math.abs(xDiff) > Math.abs(yDiff)){
            let pokemonList = pokemonRepository.getAll();
            let position = pokemonList.indexOf(pokemonRepository.getCurrent());

            if(xDiff > 0){
                // swipe rigght
                if(position !== (pokemonList.length - 1)){
                    pokemonRepository.showDetails(pokemonList[position+1]);
                }
            }
            else{
                // swipe left
                if(position !== 0){
                    pokemonRepository.showDetails(pokemonList[position-1]);
                }
            }
        }

        prevX = null;
        prevY = null;

    }

    ///////////// Build and show modal /////////////////
    function showModal(pokemon){

        // Get Modal Elements
        let modal = $('.modal-dialog');
        let modalTitle = $('.modal-title');
        let modalBody = $('.modal-body');

        modalTitle.empty();
        modalBody.empty();

        // Make Header
        // title
        let titleElement = buildElement('<h2></h2>', pokemon.name);
        modalTitle.append(titleElement);
        

        // Make Body
        // pokemon text
        let text = 'Height ' + pokemon.height + '\nType:';
            for(let i = 0; i < pokemon.types.length; i++){
                text += ' ' + pokemon.types[i].type.name;

                if(i !== (pokemon.types.length - 1)){
                    text += ',';
                }
            }
            
        let contentElement = buildElement('<p></p>', text);
        modalBody.append(contentElement);

        // image container (prevButton, image, nextButton)
        let imageContainer = buildElement('<div></div>', null, 'modal-image-container');

        // prevButton
        let pokemonList = pokemonRepository.getAll();
        let position = pokemonList.indexOf(pokemon);
        if(position !== 0){
            let prevButtonElement = buildElement('<button></button>', '<', 'modal-prev', 'click', () => {
                pokemonRepository.showDetails(pokemonList[position-1]);
            });
            
            imageContainer.append(prevButtonElement);
        }

        // image
        let imageElement = buildElement('<img>', null, 'modal-picture');
        imageElement.attr('src', pokemon.imageURL);
        imageContainer.append(imageElement);

        // nextButton
        if(position !== (pokemonList.length - 1)){
            let nextButtonElement = buildElement('<button></button>', '>', 'modal-next', 'click', () => {
                pokemonRepository.showDetails(pokemonList[position+1]);
            });

            imageContainer.append(nextButtonElement);
        }

        modalBody.append(imageContainer);


        // Add swipe event listeners
        modal.on('pointerdown', handleStart);
        modal.on('pointerup', handleEnd);
        modal.on('pointercancel', handleEnd);
        modal.on('pointermove', (e) => handleMove(e));



    }

    /////////// Return ///////////////
    return {
        showModal : showModal
    }
})();

////////////////////////// Pokemon List ///////////////////////////////
let pokemonRepository = (function (){
    //////////// Variables /////////////
    let pokemonList = [];
    let currentPokemon = null;
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    /////////// Add a pokemon to pokemonList //////////
    function add(pokemon) {
        if(typeof(pokemon) === 'object'){
            let keys = Object.keys(pokemon);
            if(keys.includes('name') && keys.includes('detailsURL')){
                pokemonList.push(pokemon);
                return;
            }
        }

        console.log('Failed to add pokoemon ' + pokemon + ' to the list.');
    };

    ////////// Return pokemonList //////////
    function getAll() {return pokemonList;};

    ///// Return current pokemon that is showing info //////
    function getCurrent(){return currentPokemon;};

    ///// Return pokemon names that inlude string parameter /////
    function getFiltered(name) {
        return pokemonList.filter(pokemon => pokemon.name.includes(name.toUpperCase()))
    };

    //////// Add list element to HTML page ///////////
    function addListItem(pokemon){
        // Create list item
        const node = $('<li></li>');
        node.addClass('list-group-item');

        // Create button
        let classArr = ['btn', 'btn-primary', 'custom-button'];
        let button = buildElement('<button></button>', pokemon.name, classArr, 'click', () => {
            showDetails(pokemon);
        });
        button.attr('data-toggle', 'modal');
        button.attr('data-target', '#infoModal');
        node.append(button);

        // Add item to list
        let pokemonListElement = $('.pokemonList');
        pokemonListElement.append(node);
    }

    ///////// Remove all list items ////////////
    function clearList()
    {
        let pokemonListElement = $('.pokemonList');
        pokemonListElement.empty();
    }

    ///// Clear current list and print the filtered list to the HTML page /////
    function printFiltered(name) {
        if(name===""){
            clearList();
            getAll().forEach(function(item){
                addListItem(item);
            })
        }
        else{
            clearList();
            getFiltered(name).forEach(function(item){
                addListItem(item);
            })
        }
    }

    ///////// Load pokemon list from JSON////////////
    function loadList(){
        showLoadingMessage();
        return fetch(apiUrl).then(function (response){
            return response.json();
        }).then(function (json){
            json.results.forEach(function (item){
                let pokemon = {
                    name : item.name.toUpperCase(),
                    detailsURL : item.url
                };
                add(pokemon);
            });
            hideLoadingMessage();
        }).catch(function (e){
            console.error(e);
           hideLoadingMessage();
        });
    }

    ////////// Load pokemon stats/info into pokemon object //////////////
    function loadDetails(item){
        showLoadingMessage();
        let url = item.detailsURL;
        return fetch(url).then(function(response){
            return response.json();
        }).then(function(details){
            item.imageURL = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
            hideLoadingMessage();
        }).catch(function(e){
            console.error(e);
            hideLoadingMessage();
        });
    }

    //////////// Print pokemon details in console ////////////
    function showDetails(pokemon){
        loadDetails(pokemon).then(function(response){
            currentPokemon = pokemon;
            modalRepo.showModal(pokemon);
        })
    }

    ////////// Return /////////////
    return{
        add : add,
        getAll : getAll,
        getFiltered : getFiltered,
        addListItem : addListItem,
        printFiltered : printFiltered,
        loadList : loadList,
        loadDetails : loadDetails,
        showDetails : showDetails,
        getCurrent : getCurrent
    };
})();



////////// Load pokemon //////////
pokemonRepository.loadList().then(function (response){
    pokemonRepository.getAll().forEach(function (pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});


//////// Filter pokemon list when searchbar value changes //////////
let searchBar = document.querySelector('#search');
console.log(searchBar);
searchBar.addEventListener('input', function(e){
    pokemonRepository.printFiltered(e.target.value);
});


