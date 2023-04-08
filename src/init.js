// @ts-check

import watchedState from './view.js';

export default () => {
  const rssForm = document.querySelector('.rss-form');

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.newFeed = url.trim();
  });
};
