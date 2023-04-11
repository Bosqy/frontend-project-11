// @ts-check

import onChange from 'on-change';

import {
  setRssFeedback, renderFeedsMarkup, renderFeed, renderPosts,
} from './render.js';
import {
  isValidUrl, getRss, parseFeed, hasFeed,
} from './utils.js';

const state = {
  newFeed: null,
  feeds: [],
  posts: [],
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
              const feedData = {
                url: parsedFeed.url,
                title: parsedFeed.title,
                description: parsedFeed.description,
                id: state.feeds.length + 1,
              };
              const currentPostIndex = state.posts.length + 1;
              const postsData = parsedFeed.items
                .map((item, i) => ({ ...item, id: currentPostIndex + i }));
              state.feeds.push(feedData);
              state.posts = [...state.posts, ...postsData];
              console.log(state.posts);
              state.newFeed = null;
              if (state.feeds.length === 1) {
                renderFeedsMarkup();
              }
              renderFeed(feedData);
              renderPosts(state.posts);
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
