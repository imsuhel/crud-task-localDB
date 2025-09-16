import React from 'react';

export default function useReactiveQuery(rxQuery) {
  const [result, setResult] = React.useState([]);

  React.useEffect(() => {
    let sub;
    let cancelled = false;
    async function start() {
      const initial = await rxQuery.exec();
      if (!cancelled) setResult(initial);
      sub = rxQuery.$.subscribe(docs => setResult(docs));
    }
    start();
    return () => {
      cancelled = true;
      sub && sub.unsubscribe();
    };
  }, [rxQuery]);

  return result;
}
