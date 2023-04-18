// Modal 
let modalRepo = (function(){
    let modalContainer = document.querySelector('#modal-container');
    let prevX = null;
    let prevY = null;

    function hideModal(){
        modalContainer.classList.remove('is-visible');
    }

    function handleStart(e){
        prevX = e.pageX;
        prevY = e.pageY;
        console.log('start');
    }

    function handleEnd(){
        prevX = null;
        prevY = null;
        console.log('end');
    }

    // Handle swipe functionality
    function handleMove(e, pokemon){
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
            let position = pokemonList.indexOf(pokemon);

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

    // Create element and assign values 
    function buildElement(type, innerText, elementClass = null, event = null, eventFunction = null){
        let modalElement = document.createElement(type);
        modalElement.innerText = innerText;
        if(elementClass){
            modalElement.classList.add(elementClass);
        }

        if(event && eventFunction){
            modalElement.addEventListener(event, eventFunction);
        }

        return modalElement;
    }

    // Build and show modal
    function showModal(pokemon){
        // remove existing modal
        modalContainer.innerHTML = "";

        // create modal
        let modal = buildElement('div', null, 'modal');

        // create close button
        let closeButton = buildElement('button', 'X', 'modal-close', 'click', hideModal);

        // title
        let titleElement = buildElement('h1', pokemon.name);

        // content
        let text = 'Height ' + pokemon.height + '\nType:';
            for(let i = 0; i < pokemon.types.length; i++){
                text += ' ' + pokemon.types[i].type.name;

                if(i !== (pokemon.types.length - 1)){
                    text += ',';
                }
            }
            
        let contentElement = buildElement('p', text);

        // image container (prevButton, image, nextButton)
        let imageContainer = buildElement('div', null, 'modal-image-container');

        // prevButton
        let pokemonList = pokemonRepository.getAll();
        let position = pokemonList.indexOf(pokemon);
        if(position !== 0){
            let prevButtonElement = buildElement('button', '<', 'modal-prev', 'click', (e) => {
                pokemonRepository.showDetails(pokemonList[position-1]);
            });
            imageContainer.appendChild(prevButtonElement);
        }

        // image
        let imageElement = buildElement('img', null, 'modal-picture');
        imageElement.src = pokemon.imageURL;
        imageContainer.appendChild(imageElement);

        // nextButton
        if(position !== (pokemonList.length - 1)){
            let nextButtonElement = buildElement('button', '>', 'modal-next', 'click', (e) => {
                pokemonRepository.showDetails(pokemonList[position+1]);
            });
            imageContainer.appendChild(nextButtonElement);
        }

        
        // append elements
        modal.appendChild(closeButton);
        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modal.appendChild(imageContainer);

        modal.addEventListener('pointerdown', handleStart);
        modal.addEventListener('pointerup', handleEnd);
        modal.addEventListener('pointercancel', handleEnd);
        modal.addEventListener('pointermove', (e) => handleMove(e, pokemon));

        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
        modalContainer.addEventListener('click', (e) => {
            if(e.target === modalContainer){
                hideModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
            hideModal();
        }
    });

    return {
        showModal : showModal
    }
})();

// Pokemon List 
let pokemonRepository = (function (){
    // Variables
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    // Add a pokemon to pokemonList
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

    // Return pokemonList
    function getAll() {return pokemonList;};

    // Return pokemon names that inlude string parameter
    function getFiltered(name) {
        return pokemonList.filter(pokemon => pokemon.name.includes(name.toUpperCase()))
    };

    // Add list element to HTML page
    function addListItem(pokemon){
        const node = document.createElement('li');
        let button = document.createElement('button');

        button.innerText = pokemon.name;
        button.classList.add('custom-button');
        node.appendChild(button);
        addButtonClickEvent(button, pokemon);
    
        let pokemonListElement = document.querySelector('.pokemonList');
        pokemonListElement.appendChild(node);
    }

    // Remove all list items
    function clearList()
    {
        let pokemonListElement = document.querySelector('.pokemonList');
        pokemonListElement.innerHTML = "";
    }

    // Clear current list and print the filtered list to the HTML page
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

    // Load pokemon list from JSON
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

    // Load pokemon stats/info into pokemon object
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


    // Print pokemon details in console
    function showDetails(pokemon){
        loadDetails(pokemon).then(function(response){
            console.log(pokemon);
    
            modalRepo.showModal(pokemon);
        })
    }

    function addButtonClickEvent(button, pokemon){
        button.addEventListener('click', function (event){
            showDetails(pokemon);
        })
    }

    function showLoadingMessage(){
        let loadingMsg = document.createElement('p');
        let pokemonList = document.querySelector('.pokemonList');
        loadingMsg.classList.add('loading-msg');
        loadingMsg.innerText = 'Loading...';
        document.querySelector('.page-content').insertBefore(loadingMsg, pokemonList);
    }

    function hideLoadingMessage(){
        let loadingMsg = document.querySelector('.loading-msg');
        console.log(loadingMsg);
        document.querySelector('.page-content').removeChild(loadingMsg);
    }

    return{
        add : add,
        getAll : getAll,
        getFiltered : getFiltered,
        addListItem : addListItem,
        printFiltered : printFiltered,
        loadList : loadList,
        loadDetails : loadDetails,
        showDetails : showDetails
    };
})();

// Load pokemon
pokemonRepository.loadList().then(function (response){
    pokemonRepository.getAll().forEach(function (pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});

/*// Loop through all of the pokemon and print
pokemonRepository.getAll().forEach(function(item){
    pokemonRepository.addListItem(item);
})*/


// Filter if characters are typed in search bar
window.addEventListener('keyup', function(event){
    if(event.target.getAttribute('id') === 'search'){
        pokemonRepository.printFiltered(event.target.value);
    }
})



