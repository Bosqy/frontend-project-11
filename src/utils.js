import axios from 'axios';

export const addPosts = (currentPosts, newPosts) => {
  const currentLinks = currentPosts.map(({ link }) => link);
  const currentIndex = currentLinks.length + 1;
  return newPosts
    .filter(({ link }) => !currentLinks.includes(link))
    .map((post, i) => ({ ...post, id: currentIndex + i, visited: false }));
};

export const getModalData = (datasetId, posts) => posts
  .reduce((acc, post) => ((Number(datasetId) === post.id) ? { ...acc, ...post } : acc), {});

const addProxy = (url) => {
  const proxy = {
    server: 'https://allorigins.hexlet.app',
    pathname: '/get',
    disableCache: true,
    url,
  };
  const proxyUrl = new URL(proxy.pathname, proxy.server);
  proxyUrl.searchParams.set('disableCache', proxy.disableCache);
  proxyUrl.searchParams.set('url', proxy.url);
  return proxyUrl;
};

export const getRss = (url) => {
  const proxyUrl = addProxy(url);
  return axios.get(proxyUrl.toString());
};

export const markVisited = (datasetId, posts) => posts
  .map((post) => ((Number(datasetId) === post.id) ? { ...post, visited: true } : post));

export const parse = (rssString) => {
  const feed = new DOMParser();
  const parsedFeed = feed.parseFromString(rssString, 'text/xml');
  if (parsedFeed.querySelector('parsererror')) {
    throw new Error('rssInvalidContent');
  }
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

  return { title, description, items };
};
