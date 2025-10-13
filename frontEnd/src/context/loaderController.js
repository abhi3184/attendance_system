// src/context/loaderController.js
let _setLoading = null;

export const loaderController = {
  register: (fn) => { _setLoading = fn; },
  start: () => { if (_setLoading) _setLoading(true); },
  stop: () => { if (_setLoading) _setLoading(false); },
};
