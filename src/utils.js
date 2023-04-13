import axios from 'axios';
import { object, string } from 'yup';

export const isValidUrl = (feed) => {
  const schema = object({ feed: string().url() });
  return schema.isValid({ feed });
};

export const getRss = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
  return axios.get(proxyUrl);
};

export const parseFeed = (contents, url) => {
  const feed = new DOMParser();
  const parsedFeed = feed.parseFromString(contents, 'text/xml');
  const title = parsedFeed.querySelector('rss channel title').textContent;
  const description = parsedFeed.querySelector('rss channel description').textContent;

  const items = [...parsedFeed.querySelectorAll('rss channel item')]
    .map((item) => {
      const itemTitle = item.querySelector('title').textContent;
      const itemDescription = item.querySelector('description').textContent;
      const itemLink = item.querySelector('link').textContent;
      return {
        title: itemTitle, description: itemDescription, link: itemLink,
      };
    });

  return {
    url, title, description, items,
  };
};

export const hasFeed = (state, feed) => {
  const feeds = state.feeds.map((el) => el.url);
  return feeds.includes(feed);
};
