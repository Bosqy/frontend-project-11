// @ts-check

import onChange from 'on-change';

import { setRssFeedback, renderFeed } from './render.js';
import {
  isValidUrl, getRss, parseFeed, hasFeed,
} from './utils.js';

const state = {
  newFeed: null,
  feeds: [],
};

export default onChange(state, (path, value) => {
  switch (path) {
    case 'newFeed':
      if (hasFeed(state, value)) {
        setRssFeedback('rssExists');
        return;
      }
      isValidUrl(value).then((isUrl) => {
        if (isUrl) {
          getRss(value).then((response) => {
            const parsedFeed = parseFeed(response.data.contents, value);
            state.feeds.push(parsedFeed);
            state.newFeed = null;
            renderFeed(parsedFeed, state.feeds.length);
            setRssFeedback('rssSuccess');
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
