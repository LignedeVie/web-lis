/**
 * @typedef {Object} SearchParamsFilter
 * @property {string} key
 * @property {'eq'|'in'|'ne'|'nin'|'contains'} op NOTE: not yet implemented. always use 'eq'
 * @property {any} value
 */

/**
 * @typedef {Object} SearchParamsSort
 * @property {string} key
 * @property {1|-1} direction
 */

/**
 * @typedef {Object} SearchParamsPagination
 * @property {number} page
 * @property {number} pageSize
 */

/**
 * @typedef {Object} SearchParams
 * @property {SearchParamsFilter[]} filters
 * @property {SearchParamsSort[]} sortings
 * @property {SearchParamsPagination} pagination
 * @property {Object} calendar for calendar view
 * @property {number} calendar.start
 * @property {number} calendar.end
 * @property {'month'|'week'|'day'} calendar.view
 * @property {string|null} search search string
 * @property {string[]} searchFields
 */

/**
 * @param {Object.<string,any>[]} items
 * @param {SearchParams} searchParams
 * @returns {Object.<string,any>[]}
 */
export function applySearchParams (items, searchParams) {
  // TODO: implement sort

  // implement pagination
  const page = searchParams?.pagination?.page;
  const pageSize = searchParams?.pagination?.pageSize;
  const skip = typeof page === 'number' && typeof pageSize === 'number' && pageSize * (page - 1);
  if (skip) {
    items = items.slice(skip);
  }

  // implement filter and search
  const filters = searchParams?.filters || [];
  const searchFields = searchParams?.searchFields || [];
  const searchRegex = searchParams?.search && new RegExp(`^${searchParams.search}`, 'i');
  if (filters.length || (searchFields.length && searchRegex)) {
    items = items.filter(d => {
      if (filters.length && !filters.every(f => d[f.key] && d[f.key] === f.value)) return;
      if (!searchFields.length || !searchRegex) return true;
      return searchFields.some(f => d[f] && searchRegex.test(d[f]));
    });
  }

  // implement limit
  const limit = pageSize;
  if (limit) {
    items = items.slice(0, limit);
  }

  return items;
}
