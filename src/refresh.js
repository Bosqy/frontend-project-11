import { getRss, parseFeed } from './utils.js';
import watchedState from './watchers.js';

const refresh = () => {
  const refreshInterval = 5000;
  setTimeout(() => {
    const oldPosts = watchedState.posts
      .map((post) => post.title);
    const getAllRss = watchedState.feeds
      .map((feed) => feed.url)
      .map((feed) => getRss(feed));
    Promise.all(getAllRss)
      .then((responses) => {
        const newPosts = responses
          .flatMap((response) => parseFeed(response.data.contents, response.data.status.url).items)
          .filter((item) => !oldPosts.includes(item.title));
        if (newPosts.length > 0) {
          watchedState.newPosts = newPosts;
        }
        refresh();
      });
  }, refreshInterval);
};

export default refresh;
