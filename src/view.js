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
  newPosts: [],
  feeds: [],
  posts: [],
};

const addPosts = () => {
  const currentPostIndex = state.posts.length + 1;
  const postsData = state.newPosts
    .map((item, i) => ({ ...item, id: currentPostIndex + i }));
  state.posts = [...state.posts, ...postsData];
};

const watchedState = onChange(state, (path, value) => {
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
              state.feeds.push(feedData);
              state.newFeed = null;
              if (state.feeds.length === 1) {
                renderFeedsMarkup();
              }
              renderFeed(feedData);
              setRssFeedback('rssSuccess');
              watchedState.newPosts = parsedFeed.items;
            })
            .catch(() => setRssFeedback('rssNetworkError'));

          return;
        }
        setRssFeedback('rssInvalidFormat');
      });
      break;
    case 'newPosts':
      addPosts();
      renderPosts(state.posts);
      break;
    default:
      break;
  }
});

export default watchedState;
