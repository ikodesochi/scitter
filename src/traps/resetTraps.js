// traps/resetTraps.js
import { resetOilSlicks as ros } from './oil_slick.js';
import { resetSpikes as rs } from './spikes.js';
import { resetPlatforms as rp } from './disappearing_platform.js';

export function resetOilSlicks() { ros(); }
export function resetSpikes() { rs(); }
export function resetPlatforms() { rp(); }