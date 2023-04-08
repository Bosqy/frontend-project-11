// @ts-check

import { object, string } from 'yup';
import onChange from 'on-change';

const isValidUrl = (feed) => {
  const schema = object({ feed: string().url() });
  return schema.isValid({ feed });
};

export default () => {
  const state = {
    newFeed: null,
  };
  const feeds = [];

  const watchedState = onChange(state, () => {
    const urlInput = document.getElementById('url-input');
    urlInput.classList.remove('is-invalid');

    isValidUrl(state.newFeed).then((isUrl) => {
      const hasUrl = feeds.includes(state.newFeed);

      console.log(`${isUrl}  ${hasUrl}`);

      const isValid = isUrl && !hasUrl;
      if (isValid) {
        feeds.push(state.newFeed);
        console.log(feeds);
        urlInput.value = '';
        return;
      }
      urlInput.classList.add('is-invalid');
    });
  });
  // Controller
  const rssForm = document.querySelector('.rss-form');

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.newFeed = url.trim();
  });
};
