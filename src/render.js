import i18nInstance from './i18n.js';

export const rssForm = document.querySelector('.rss-form');

export const setRssFeedback = (content) => {
  const rssFormContainer = rssForm.parentElement;
  const rssFormFeedback = document.createElement('p');

  rssFormFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  rssFormFeedback.innerText = i18nInstance.t(content);

  const urlInput = document.getElementById('url-input');
  urlInput.classList.remove('is-invalid');
  urlInput.focus();
  document.querySelectorAll('.rss-form ~ .feedback').forEach((el) => el.remove());

  switch (content) {
    case 'rssExists':
    case 'rssInvalidFormat':
      rssFormFeedback.classList.add('text-danger');
      urlInput.classList.add('is-invalid');
      break;
    case 'rssSuccess':
      urlInput.value = '';
      rssFormFeedback.classList.add('text-success');
      break;
    default:
      break;
  }
  rssFormContainer.append(rssFormFeedback);
};
