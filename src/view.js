// @ts-check

import { object, string } from 'yup';
import onChange from 'on-change';

const isValidUrl = (feed) => {
  const schema = object({ feed: string().url() });
  return schema.isValid({ feed });
};

const state = {
  newFeed: null,
  feeds: [],
};

const watchedState = onChange(state, () => {
  const urlInput = document.getElementById('url-input');
  urlInput.classList.remove('is-invalid');

  isValidUrl(state.newFeed).then((isUrl) => {
    const hasUrl = state.feeds.includes(state.newFeed);

    const isValid = isUrl && !hasUrl;
    if (isValid) {
      state.feeds.push(state.newFeed);
      urlInput.value = '';
      urlInput.focus();
      return;
    }
    urlInput.classList.add('is-invalid');
  });
});

export default watchedState;
