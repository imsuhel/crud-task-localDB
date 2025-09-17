import {generateId} from './util';
import {getOrInitDB} from './index';

export async function createBusiness(db, data) {
  try {
    const database = await getOrInitDB(db);
    const doc = {
      id: data.id || generateId(),
      name: data.name,
      updatedAt: Date.now(),
    };
    let dataset = await database.businesses.insert(doc);
    console.log('dataset', dataset);
    return doc;
  } catch (error) {
    console.log('error', error);
  }
}

export function listBusinesses(db) {
  // Don't await here - we want to return the query object
  return getOrInitDB(db).then(database =>
    database.businesses.find().sort({name: 'asc'}),
  );
}

export async function createArticle(db, data) {
  try {
    const database = await getOrInitDB(db);
    const doc = {
      id: data.id || generateId(),
      name: data.name,
      qty: Number(data.qty),
      selling_price: Number(data.selling_price),
      business_id: data.business_id,
      updatedAt: Date.now(),
    };
    await database.articles.insert(doc);
    return doc;
  } catch (error) {
    console.log(error, 'error');
  }
}

export async function listArticlesByBusiness(db, businessId) {
  const database = await getOrInitDB(db);
  return database.articles
    .find({selector: {business_id: businessId}})
    .sort({name: 'asc'});
}

export async function updateArticle(db, id, data) {
  try {
    const database = await getOrInitDB(db);
    const doc = await database.articles.findOne(id).exec();
    if (!doc) throw new Error('Article not found');

    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };

    await doc.update({
      $set: updateData,
    });

    return doc.toJSON();
  } catch (error) {
    console.log(error, 'error');
  }
}

export async function deleteArticle(db, id) {
  const database = await getOrInitDB(db);
  const doc = await database.articles.findOne(id).exec();
  if (!doc) throw new Error('Article not found');

  await doc.remove();
  return {success: true};
}
