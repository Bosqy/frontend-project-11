// @ts-check

import watchedState from './view.js';
import { rssForm } from './render.js';
import resources from './locales/index.js';
import i18nInstance from './i18n.js';

export default () => {
  i18nInstance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    rssForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.newFeed = url.trim();
    });
  });
};
