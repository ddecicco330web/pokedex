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
    let name = pokemonList[i].name;
    let height = pokemonList[i].height;
    
    document.write(name + ' (height: ' + height + ') ');

    if(pokemonList[i].height > 6){
        document.write("- Wow, that's big!");
    }

    document.write('<br>');
}