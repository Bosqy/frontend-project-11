// @ts-check

import onChange from 'on-change';

import { setRssFeedback, renderFeedsMarkup, renderFeed } from './render.js';
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
          getRss(value)
            .then((response) => {
              if (response.data.contents === null || !response.data.contents.includes('<rss')) {
                setRssFeedback('rssInvalidContent');
                return;
              }
              const parsedFeed = parseFeed(response.data.contents, value);
              state.feeds.push(parsedFeed);
              state.newFeed = null;
              if (state.feeds.length === 1) {
                renderFeedsMarkup();
              }
              renderFeed(parsedFeed);
              setRssFeedback('rssSuccess');
            })
            .catch(() => setRssFeedback('rssNetworkError'));

          return;
        }
        setRssFeedback('rssInvalidFormat');
      });
      break;
    default:
      break;
  }
});
