// Add pokemon to list

let pokemonRepository = (function (){
    let pokemonList = [];

    function add(pokemon) {
        if(typeof(pokemon) === 'object'){
            let keys = Object.keys(pokemon);
            if(keys[0] === 'name' && keys[1] === 'height' && keys[2] === 'type'){  
                pokemonList.push(pokemon);
            }    
        }
    };
    function getAll() {return pokemonList;};
    function getFiltered(name) {
        return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()))
    };

    return{
        add : add,
        getAll : getAll,
        getFiltered : getFiltered
    };
})();

// Add pokemon
pokemonRepository.add({name : 'Bulbasaur', height : 7, type : ['grass','poison']});
pokemonRepository.add({name : 'Charmander', height : 6, type : ['fire']});
pokemonRepository.add({name : 'Squirtle', height : 5, type : ['water']});

// Print pokemon names and stats
const printList = (item) => {
    const node = document.createElement('li');

    const text = () => {
        if(item.height > 6){
            return item.name + ' (height: ' + item.height + ') - Wow, that is big!';
        }

        return item.name + ' (height: ' + item.height + ')'
    }

    const textNode = document.createTextNode(text());

    node.appendChild(textNode);
    document.getElementById('pokemonList').appendChild(node);
}

// Loop through all of the pokemon and print
pokemonRepository.getAll().forEach(function(item){
    printList(item);
})

function printFiltered(name) {
    if(name===""){
        clearList();
        pokemonRepository.getAll().forEach(function(item){
            printList(item);
        })
    }
    else{
        pokemonRepository.getFiltered(name).forEach(function(item){
            clearList();
            printList(item);
        })
    }
}

function clearList()
{
    document.getElementById('pokemonList').innerHTML = "";
}



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