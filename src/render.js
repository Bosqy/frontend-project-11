import i18nInstance from './i18n.js';

export const rssForm = document.querySelector('.rss-form');

const urlInput = document.getElementById('url-input');

export const clearRssForm = () => {
  urlInput.classList.remove('is-invalid');
  urlInput.focus();
  document.querySelectorAll('.rss-form ~ .feedback').forEach((el) => el.remove());
};

const rssFormContainer = rssForm.parentElement;

const rssFormFeedback = document.createElement('p');
rssFormFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');

export const setRssErrorFeedback = () => {
  rssFormFeedback.classList.add('text-danger');
  rssFormFeedback.innerText = i18nInstance.t('errorRss');
  urlInput.classList.add('is-invalid');
  rssFormContainer.append(rssFormFeedback);
};

export const setRssSuccessFeedback = () => {
  urlInput.value = '';
  rssFormFeedback.innerText = i18nInstance.t('successRss');
  rssFormContainer.append(rssFormFeedback);
};
