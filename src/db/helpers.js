import {getDB, initDB} from './index';

import {v4 as uuidv4} from 'uuid';

export async function createBusiness(db, data) {
  const database = db || (await initDB());
  const doc = {
    id: data.id || uuidv4(),
    name: data.name,
    updatedAt: Date.now(),
  };
  await database.businesses.insert(doc);
  return doc;
}

export async function listBusinesses(db) {
  const database = db || (await initDB());
  return database.businesses.find().sort({name: 'asc'});
}

export async function createArticle(db, data) {
  const database = db || (await initDB());
  const doc = {
    id: data.id || uuidv4(),
    name: data.name,
    qty: Number(data.qty),
    selling_price: Number(data.selling_price),
    business_id: data.business_id,
    updatedAt: Date.now(),
  };
  await database.articles.insert(doc);
  return doc;
}

export async function listArticlesByBusiness(db, businessId) {
  const database = db || (await initDB());
  return database.articles
    .find({selector: {business_id: businessId}})
    .sort({name: 'asc'});
}
