import React, {useEffect} from 'react';

import {getOrInitDB} from '../db';
import {listArticlesByBusiness} from '../db/helpers';
import useReactiveQuery from './useReactiveQuery';

export default function useArticleList(businessId) {
  const [query, setQuery] = React.useState(null);
  const data = useReactiveQuery(
    query || {exec: async () => [], $: {subscribe: () => ({unsubscribe() {}})}},
  );

  // console.log(data, 'dataddd');

  useEffect(() => {
    getBusinesses();
  }, []);

  const getBusinesses = async () => {
    try {
      const db = await getOrInitDB();
      const q = await listArticlesByBusiness(db, businessId); // Don't await here, pass the query object directly

      console.log('Query created:', q);
      setQuery(q);
    } catch (error) {
      console.error('Error in getBusinesses:', error);
    }
  };

  return data ? data : [];
}
