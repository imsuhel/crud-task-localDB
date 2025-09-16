import {BehaviorSubject} from 'rxjs';

export const replicationStatus$ = new BehaviorSubject({
  active: false,
  last: null,
  error: null,
  online: true,
});

export function setOnline(online) {
  const curr = replicationStatus$.getValue();
  replicationStatus$.next({...curr, online});
}

export function setActive(active) {
  const curr = replicationStatus$.getValue();
  replicationStatus$.next({...curr, active});
}

export function setLast(last) {
  const curr = replicationStatus$.getValue();
  replicationStatus$.next({...curr, last});
}

export function setError(error) {
  const curr = replicationStatus$.getValue();
  replicationStatus$.next({...curr, error});
}
