// Add pokemon to list

let pokemonRepository = (function (){
    let pokemonList = [];


    // Add a pokemon to pokemonList
    function add(pokemon) {
        if(typeof(pokemon) === 'object'){
            let keys = Object.keys(pokemon);
            if(keys[0] === 'name' && keys[1] === 'height' && keys[2] === 'type'){  
                pokemonList.push(pokemon);
            }    
        }
    };

    // Return pokemonList
    function getAll() {return pokemonList;};

    // Return pokemon names that inlude string parameter
    function getFiltered(name) {
        return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()))
    };

    // Print pokemon details in console
    function showDetails(pokemon){
        console.log(pokemon);
    }

    function addButtonClickEvent(button, pokemon){
        button.addEventListener('click', function (event){
            showDetails(pokemon);
        })
    }

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

    return{
        add : add,
        getAll : getAll,
        getFiltered : getFiltered,
        addListItem : addListItem,
        printFiltered : printFiltered
    };
})();

// Add pokemon
pokemonRepository.add({name : 'Bulbasaur', height : 7, type : ['grass','poison']});
pokemonRepository.add({name : 'Charmander', height : 6, type : ['fire']});
pokemonRepository.add({name : 'Squirtle', height : 5, type : ['water']});


// Loop through all of the pokemon and print
pokemonRepository.getAll().forEach(function(item){
    pokemonRepository.addListItem(item);
})


// Filter if characters are typed in search bar
window.addEventListener('keyup', function(event){
    if(event.target.getAttribute('id') === 'search')
    {
        pokemonRepository.printFiltered(event.target.value);
    }
})



/*{
        name: 'Bulbasaur',
        height: 7,
        type: ['grass','poison']
   },

   {
        name: 'Charmander',
        height: 6,
        type: ['fire']
   },

   {
        name: 'Squirtle',
        height: 5,
        type: ['water']
   }*/