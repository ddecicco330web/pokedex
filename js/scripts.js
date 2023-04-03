// Add pokemon to list

let pokemonList= [
   {
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
   }

];

// Print pokemon info
for(let i = 0; i < pokemonList.length; i++){
    document.write(pokemonList[i].name + ' (height: ' + pokemonList[i].height + ') ');
    if(pokemonList[i].height > 6){
        document.write("- Wow, that's big!");
    }
    document.write('<br>');
}