// @ts-check

import { object, string } from 'yup';
import onChange from 'on-change';

import { clearRssForm, setRssSuccessFeedback, setRssErrorFeedback } from './render.js';

const isValidUrl = (feed) => {
  const schema = object({ feed: string().url() });
  return schema.isValid({ feed });
};

const state = {
  newFeed: null,
  feeds: [],
};

export default onChange(state, () => {
  clearRssForm();

  isValidUrl(state.newFeed).then((isUrl) => {
    const hasUrl = state.feeds.includes(state.newFeed);

    const isValid = isUrl && !hasUrl;
    if (isValid) {
      setRssSuccessFeedback();
      return;
    }
    setRssErrorFeedback();
  });
});
