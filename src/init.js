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

const i18nInstance = i18n.createInstance();

const initialState = {
  form: null,
  feeds: [],
  posts: [],
  modal: {},
};

const domElements = {
  form: document.querySelector('.rss-form'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
  modal: {
    title: document.querySelector('.modal-title'),
    body: document.querySelector('.modal-body'),
    href: document.querySelector('.modal-footer a'),
  },
};

const refresh = (watchedState) => {
  const refreshInterval = 5000;
  setTimeout(() => {
    //    const oldPosts = watchedState.posts
    //      .map((post) => post.title);
    const getAllRss = watchedState.feeds
      .map((feed) => feed.url)
      .map((feed) => getRss(feed));
    Promise.all(getAllRss)
      .then((responses) => {
        const posts = responses
          .flatMap((response) => parseFeed(response.data.contents, response.data.status.url).items);
        const newPosts = addPosts(watchedState.posts, posts);
        watchedState.posts.push(...newPosts);
        //          .filter((item) => !oldPosts.includes(item.title));
        //        if (newPosts.length > 0) {
        //          watchedState.newPosts = newPosts;
        //        }
        refresh(watchedState);
      });
  }, refreshInterval);
};

export default () => {
  i18nInstance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    const watchedState = watchState(
      i18nInstance,
      initialState,
      domElements,
    );
    domElements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();
      validateUrl(url, watchedState)
        .then((validated) => getRss(validated.feed))
        .then((response) => {
          if (isValidContent(response)) {
            const parsedFeed = parseFeed(response.data.contents, response.data.status.url);
            const feedData = {
              url: parsedFeed.url,
              title: parsedFeed.title,
              description: parsedFeed.description,
            };
            const newPosts = addPosts(watchedState.posts, parsedFeed.items);
            watchedState.posts.push(...newPosts);
            watchedState.feeds.push(feedData);
            watchedState.form = 'rssSuccess';
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
    refresh(watchedState);
  });
};
