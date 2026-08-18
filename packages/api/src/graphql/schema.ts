// Import modules to register their types and resolvers
import '../modules/booking-request/types.js';
import '../modules/booking-request/resolvers.js';
import '../modules/booking/types.js';
import '../modules/booking/resolvers.js';
import '../modules/artist/resolvers.js';

import { builder } from './builder.js';

export const schema = builder.toSchema();
