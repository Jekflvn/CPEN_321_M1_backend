export interface PokemonDTO {
    species: string;
    sprite: string;
    types: string[];
  }
  
  export interface GraphQLPokemonData {
    data?: {
      getPokemon?: PokemonDTO;
    };
  }
  