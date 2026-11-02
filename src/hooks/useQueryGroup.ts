import { useAppData } from '../context/AppDataContext';

export default function useQueryGroup(
  names: Array<keyof ReturnType<typeof useAppData>['queries']>,
) {
  const { queries } = useAppData();
  const group = names.map(name => queries[name]);
  return {
    loading: group.some(query => query.loading),
    refreshing: group.some(query => query.refreshing),
    error: group.find(query => query.error)?.error || null,
    lastUpdated: group.every(query => query.lastUpdated)
      ? group.map(query => query.lastUpdated).sort()[0]
      : null,
    refresh: () => Promise.all(group.map(query => query.refresh())),
  };
}
