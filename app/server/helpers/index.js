// @ts-check

import i18next from "i18next";
// Шаблоны зовут _.get с путями, _.groupBy строкой и _.isEmpty, поэтому во
// вьюхи отдаётся compat-слой: у него семантика lodash, а в корне es-toolkit
// части этих функций нет вовсе.
import * as _ from "es-toolkit/compat";

export default (app) => ({
  route(name, placeholdersValues, options) {
    return app.reverse(name, placeholdersValues, options);
  },
  t(key) {
    return i18next.t(key);
  },
  _,
  getAlertClass(type) {
    switch (type) {
      // case 'failure':
      //   return 'danger';
      case "error":
        return "border-red-300 bg-red-50 text-red-900";
      case "success":
        return "border-green-300 bg-green-50 text-green-900";
      case "info":
        return "border-blue-300 bg-blue-50 text-blue-900";
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
});
