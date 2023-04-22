// @ts-check

import i18n from 'i18next';
import { object, string } from 'yup';
import watchState from './watchers.js';
import resources from './locales/index.js';
import {
  getRss, getModalData, parseFeed, isValidContent, addPosts, markVisited,
} from './utils.js';

const validateUrl = (feed, state) => {
  const urlList = state.feeds.map(({ url }) => url);
  const schema = object({ feed: string().url('rssInvalidFormat').notOneOf(urlList, 'rssExists') });
  return schema.validate({ feed });
};

const refresh = (watchedState, refreshInterval) => {
  setTimeout(() => {
    const getAllRss = watchedState.feeds
      .map((feed) => feed.url)
      .map((feed) => getRss(feed));
    Promise.all(getAllRss)
      .then((responses) => {
        const posts = responses
          .flatMap((response) => parseFeed(response.data.contents, response.data.status.url).items);
        const newPosts = addPosts(watchedState.posts, posts);
        watchedState.posts.push(...newPosts);
        refresh(watchedState, refreshInterval);
      })
      .catch(() => {
        refresh(watchedState, refreshInterval);
      });
  }, refreshInterval);
};

export default () => {
  const initialState = {
    form: 'ready',
    feeds: [],
    posts: [],
    modal: {},
  };

  const domElements = {
    form: {
      container: document.querySelector('.rss-form').parentElement,
      feedback: document.querySelector('.feedback'),
      input: document.querySelector('#url-input'),
      self: document.querySelector('.rss-form'),
      submit: document.querySelector('[type="submit"]'),
    },
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      href: document.querySelector('.modal-footer a'),
    },
  };

  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    const watchedState = watchState(
      i18nInstance,
      initialState,
      domElements,
    );
    domElements.form.self.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form = 'rssLoading';
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();
      validateUrl(url, watchedState)
        .then((validated) => getRss(validated.feed))
        .then((response) => {
          if (isValidContent(response)) {
            watchedState.form = 'rssSuccess';
            const parsedFeed = parseFeed(response.data.contents, url);
            const feedData = {
              url,
              title: parsedFeed.title,
              description: parsedFeed.description,
            };
            const newPosts = addPosts(watchedState.posts, parsedFeed.items);
            watchedState.posts.push(...newPosts);
            watchedState.feeds.push(feedData);
            return;
          }
          watchedState.form = 'rssInvalidContent';
        })
        .catch((error) => {
          if (error.message === 'Network Error') {
            watchedState.form = 'rssNetworkError';
            return;
          }
          watchedState.form = error.message;
        });
    });
    domElements.postsContainer.addEventListener('click', (e) => {
      if (e.target.dataset.id) {
        watchedState.posts = markVisited(e.target.dataset.id, watchedState.posts);
      }
      if (e.target.dataset.bsToggle === 'modal') {
        watchedState.modal = getModalData(e.target.dataset.id, watchedState.posts);
      }
    });
    const refreshInterval = 5000;
    refresh(watchedState, refreshInterval);
  });
};
