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
    function getFiltered(name) {return pokemonList.filter(pokemon => pokemon.name === name)};

    return{
        add : add,
        getAll : getAll,
        getFiltered : getFiltered
    };
})();

pokemonRepository.add({name : 'Bulbasaur', height : 7, type : ['grass','poison']});
pokemonRepository.add({name : 'Charmander', height : 6, type : ['fire']});
pokemonRepository.add({name : 'Squirtle', height : 5, type : ['water']});

pokemonRepository.getAll().forEach(function(item){
    document.write(item.name + ' (height: ' + item.height + ') ');

    if(item.height > 6){
        document.write("- Wow, that's big!");
    }

    document.write('<br>');
})

function printFiltered(name) {
    pokemonRepository.getFiltered(name).forEach(function(item){
   
        document.write(item.name + ' (height: ' + item.height + ') ');

    if(item.height > 6){
        document.write("- Wow, that's big!");
    }

    document.write('<br>');
})}



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