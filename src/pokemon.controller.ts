import { Request, Response } from 'express';
import { getPokemonOfTheDay } from './pokemon.service';

export async function getDailyPokemon(req: Request, res: Response) {
  try {
    const data = await getPokemonOfTheDay();
    return res.json(data);
  } catch (err) {
    return res
      .status(502)
      .json({ error: 'Failed to fetch Pokémon of the day' });
  }
}
