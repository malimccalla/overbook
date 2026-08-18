import SchemaBuilder from '@pothos/core';

import type { ApiContext } from './context.js';

export const builder = new SchemaBuilder<{
  Context: ApiContext;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
    JSON: { Input: unknown; Output: unknown };
  };
}>({});

builder.scalarType('DateTime', {
  serialize: (val) => val.toISOString(),
  parseValue: (val) => new Date(val as string),
});

builder.scalarType('JSON', {
  serialize: (val) => val,
  parseValue: (val) => val,
});

builder.queryType({});
builder.mutationType({});
