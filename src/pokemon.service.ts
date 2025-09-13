import axios from 'axios';
import dayjs from 'dayjs';
import type { PokemonDTO, GraphQLPokemonData } from './pokemon.types';
import { AxiosError } from 'axios';

const GRAPHQL_URL = 'https://graphqlpokemon.favware.tech/v8';

const POKEMON_LIST = [
  'pikachu',
  'charmander',
  'bulbasaur',
  'squirtle',
  'dragonite',
  'gengar',
  'eevee',
  'snorlax',
  'mewtwo',
  'lucario',
  'gardevoir',
  'scizor',
  'salamence',
];

let cachedDay = '';
let cached: PokemonDTO | null = null;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

export async function getPokemonOfTheDay(): Promise<PokemonDTO> {
  const today = dayjs().format('YYYY-MM-DD');
  if (today === cachedDay && cached) return cached;

  const idx = hash(today) % POKEMON_LIST.length;
  const name = POKEMON_LIST[idx];

  const query = `{
    getPokemon(pokemon: ${name}) {
      species
      sprite
      types {
        name
      }
    }
  }`;

  try {
    const { data } = await axios.post<GraphQLPokemonData>(
      GRAPHQL_URL,
      { query },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10_000 }
    );

    console.log('API Response:', JSON.stringify(data, null, 2));

    const p = data?.data?.getPokemon;
    if (!p) {
      console.error('No Pokemon data in response:', data);
      throw new Error('Upstream Pokémon API returned no data');
    }

    cachedDay = today;
    cached = {
      species: p.species,
      sprite: p.sprite,
      types: p.types.map((t: any) => t.name),
    };
    return cached;
  } catch (error) {
    console.error('Pokemon API error:', error);
    if (error instanceof AxiosError && error.response) {
      console.error('API Error Response:', error.response.data);
    }
    throw new Error('Failed to fetch Pokémon data');
  }
}
