export function useSearch<T>(
  items: T[] | (() => T[]),
  config: {
    searchFields: (keyof T)[];
    initialSort?: [keyof T, 'asc' | 'desc'];
  },
) {
  let value = $state<string>('');
  let sortFields = $state<[keyof T, 'asc' | 'desc'][]>(
    config.initialSort ? [config.initialSort] : [],
  );

  function compareValues(a: unknown, b: unknown): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  let filteredItems = $derived.by(() => {
    const resolvedItems = typeof items === 'function' ? items() : items;
    let result = resolvedItems;

    if (value) {
      const lowerSearch = value.toLowerCase();
      result = resolvedItems.filter((item) =>
        config.searchFields.some((field) => {
          const fieldValue = String(item[field]).toLowerCase();
          return fieldValue.includes(lowerSearch);
        }),
      );
    }

    if (sortFields.length) {
      return [...result].sort((left, right) => {
        for (const [field, direction] of sortFields) {
          const comparison = compareValues(left[field], right[field]);
          if (comparison !== 0) {
            return direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return result;
  });

  return {
    get value() {
      return value;
    },
    set value(input: string) {
      value = input;
    },
    get filteredItems() {
      return filteredItems;
    },
    sort(key: keyof T, order: 'asc' | 'desc') {
      // if key is already sorted, toggle reset to unsorted
      if (sortFields[0]?.[0] === key) {
        sortFields = config.initialSort ? [config.initialSort] : [];
        return;
      }

      sortFields = [[key, order]];
    },
    reset() {
      value = '';
      sortFields = config.initialSort ? [config.initialSort] : [];
    },
    get currentSort() {
      return sortFields[0]?.[0] || null;
    },
    get allowReset() {
      return (
        value !== '' ||
        (sortFields.length > 0 &&
          !(
            config.initialSort &&
            sortFields.length === 1 &&
            sortFields[0][0] === config.initialSort[0]
          ))
      );
    },
  };
}