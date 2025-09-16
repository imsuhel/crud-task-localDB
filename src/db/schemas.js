export const businessSchema = {
  title: 'business schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {type: 'string', maxLength: 100},
    name: {type: 'string'},
    updatedAt: {type: 'number'},
    deviceId: {type: 'string'},
    type: {type: 'string', default: 'business'},
  },
  required: ['id', 'name'],
  indexes: ['name'],
};

export const articleSchema = {
  title: 'article schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {type: 'string', maxLength: 100},
    name: {type: 'string'},
    qty: {type: 'number'},
    selling_price: {type: 'number'},
    business_id: {type: 'string'},
    updatedAt: {type: 'number'},
    deviceId: {type: 'string'},
    type: {type: 'string', default: 'article'},
  },
  required: ['id', 'name', 'qty', 'selling_price', 'business_id'],
  indexes: ['business_id'],
};
