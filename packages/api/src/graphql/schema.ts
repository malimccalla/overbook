// Import modules to register their types and resolvers
import '../modules/booking/types.js';
import '../modules/booking/resolvers.js';
import '../modules/artist/resolvers.js';
import '../modules/email-intake/resolvers.js';

import { builder } from './builder.js';

export const schema = builder.toSchema();
