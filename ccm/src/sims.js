// Registre des 20 simulations (une par mission)
import { SIMS_A } from './sims_a.js';
import { SIMS_B } from './sims_b.js';
import { SIMS_C } from './sims_c.js';
export const SIMS = { ...SIMS_A, ...SIMS_B, ...SIMS_C };
