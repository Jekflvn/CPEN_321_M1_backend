import { Router } from 'express';
import { getDailyPokemon } from './pokemon.controller';

const router = Router();

router.get('/daily', getDailyPokemon);

export default router;
