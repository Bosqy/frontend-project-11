import axios from 'axios';

export const addPosts = (currentPosts, newPosts) => {
  const currentLinks = currentPosts.map(({ link }) => link);
  const currentIndex = currentLinks.length + 1;
  return newPosts
    .filter(({ link }) => !currentLinks.includes(link))
    .map((post, i) => ({ ...post, id: currentIndex + i, visited: false }));
};

export const markVisited = (datasetId, posts) => posts
  .map((post) => ((Number(datasetId) === post.id) ? { ...post, visited: true } : post));

export const getModalData = (datasetId, posts) => posts
  .reduce((acc, post) => ((Number(datasetId) === post.id) ? { ...acc, ...post } : acc), {});

export const getRss = (url) => {
  const proxyServer = 'https://allorigins.hexlet.app';
  const pathname = 'get';
  const cacheParam = '?disableCache=true';
  const urlParam = `url=${url}`;
  const proxyUrl = new URL(`${proxyServer}/${pathname}${cacheParam}&${urlParam}`);
  return axios.get(proxyUrl.href);
};

export const isValidContent = (response) => {
  if (response.data.contents === null) {
    return false;
  }
  if (!response.data.contents.includes('<rss')) {
    return false;
  }
  return true;
};

export const hasFeed = (state, feed) => {
  const feeds = state.feeds.map((el) => el.url);
  return feeds.includes(feed);
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
