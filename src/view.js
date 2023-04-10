// @ts-check

import onChange from 'on-change';

import { setRssFeedback } from './render.js';
import { isValidUrl, getRss } from './utils.js';

const state = {
  newFeed: null,
  feeds: [],
};

export default onChange(state, (path, value) => {
  switch (path) {
    case 'newFeed':
      if (state.feeds.includes(value)) {
        setRssFeedback('rssExists');
        return;
      }
      isValidUrl(value).then((isUrl) => {
        if (isUrl) {
          getRss(value).then((response) => {
            console.log(response.data);
            console.log(response.status);
            console.log(response.headers);
            state.feeds.push(value);
            state.newFeed = null;
            setRssFeedback('rssSuccess');
            console.log(state.feeds);
          });

          return;
        }
        setRssFeedback('rssInvalidFormat');
      });
      break;
    default:
      break;
  }
});
