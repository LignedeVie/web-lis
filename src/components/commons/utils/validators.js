/**
 * @typedef {'string'|'number'|'boolean'|'array'|'object'|'date'|'date-range'} PropType
 */
export const PropTypes = ['string', 'number', 'boolean', 'array', 'object', 'date', 'date-range'];

/**
 * @callback RenderFn
 * @param {any} value extracted value of item using the 'key' field in the property
 * @param {any} item the item to render
 * @param {View} view selected view
 * @param {(ctor, data, children) => VNode} h create element function
 * @returns {string|VNode}
 */

/**
 * @typedef {Object} ComponentConfig
 * @property {string} name
 * @property {Object.<string,any>} attrs
 * @property {Object.<string,any>} class
 * @property {Object.<string,any>} style
 * @property {Object.<string,function>} listeners
 */

/**
 * @template G
 * @callback ResolveSmartInputFn
 * @param {any} data model in context (new data in create, updated data in edit)
 * @param {any} [item] original item (n/a in create)
 * @param {'create'|'update'|'filter'} ctx
 * @returns {G}
 */

/**
 * @typedef {Object} Property
 * @property {string} key
 * @property {string|import('vue').Component} name
 * @property {PropType} type
 * @property {string} description
 * @property {ResolveSmartInputFn<any>} default default value to use in generic form
 * @property {ResolveSmartInputFn<any>} visible if component is visible in the generic form
 * @property {RenderFn} render defaults to extracting key and rendering depending on the type
 * @property {string} [dateFormat='MMMM dd, yyyy'] the format to use to render dates
 * @property {boolean} sortable property can be used for sorting
 * @property {boolean} filterable property can be used for filtering (requires component for selecting value)
 * @property {boolean} searchable property can be used for searching using the search field
 * @property {ComponentConfig|ResolveSmartInputFn<ComponentConfig>} component component config
 */

export function propertyValidator (v) {
  if (!v.key) {
    console.warn('key missing in property', v);
    return;
  }
  if (!v.name) {
    console.warn('name missing in property', v);
    return;
  }
  if (!v.type || !~PropTypes.indexOf(v.type)) {
    console.warn('type missing/invalid in property', v);
    return;
  }
  if (v.filterable && !v.component) {
    console.warn('component is required in filterable properties', v);
    return;
  }
  return true;
}

/**
 * @typedef {'table'|'calendar'|'list'|'gallery'} ViewType
 */
export const ViewTypes = ['table', 'calendar', 'list', 'gallery'];

/**
 * @typedef {Object} View
 * @property {string} name
 * @property {ViewType} type
 * @property {boolean} configurable
 *
 * @property {number[]} properties indexes of properties chosen for the view (for table views)
 * @property {boolean} inplaceEdittable for table views
 * @property {boolean} inlineAddable for table views
 *
 * @property {number} previewProperty index of the preview'd property for gallery view
 * @property {number} titleProperty index of title property for calendar and gallery views
 * @property {number} subtitleProperty index of subtitle property for for calendar and gallery views
 * @property {number} dateProperty index of the main date property for calendar views
 */

export function viewValidator (v) {
  if (!v.name) {
    console.warn('name missing in view', v);
    return;
  }
  switch (v.type) {
    case 'table': {
      if (!v.properties?.length || v.properties.some(p => typeof p !== 'number')) {
        console.warn('properties missing/invalid in table view', v);
        return;
      }
      break;
    }
    case 'list':
    case 'gallery': {
      if (typeof v.titleProperty !== 'number') {
        console.warn(`title property invalid in ${v.type} view`, v);
        return;
      }
      break;
    }
    case 'calendar': {
      if (typeof v.dateProperty !== 'number') {
        console.warn(`date property invalid in ${v.type} view`, v);
        return;
      }
      break;
    }
    default: {
      console.warn('type missing/invalid in view', v);
      return;
    }
  }
  return true;
}

/**
 * @typedef {'xlsx'|'csv'|'json'} ExportType
 */
export const ExportTypes = ['xlsx', 'csv', 'json'];

/**
 * @typedef {Object} ExportConfig
 * @property {ExportType} type
 */
export function validateExportConfig (c) {
  if (!c.type || !~ExportTypes.indexOf(c.type)) {
    console.warn('type missing/invalid in export config', c);
    return;
  }
  return true;
}

/**
 * @typedef {'xlsx'|'csv'|'json'} ImportType
 */
export const ImportTypes = ['xlsx', 'csv', 'json'];

/**
 * @typedef {Object} ImportConfig
 * @property {ImportType} type
 * @property {string} templateURL
 */
export function validateImportConfig (c) {
  if (!c.type || !~ImportTypes.indexOf(c.type)) {
    console.warn('type missing/invalid in import config', c);
    return;
  }
  if (!c.templateURL) {
    console.warn('templateURL missing/invalid in import config', c);
    return;
  }
  return true;
}

/**
 * @typedef {Object} PrintConfig
 * @property {string} path printing route
 * @property {(items: any[]) => Object.<string,any>} formatter data formatter for storing data to be used by a print route
 */
export function validatePrintConfig (c) {
  if (!c.path) {
    console.warn('path missing/invalid in print config');
    return;
  }
  return true;
}
