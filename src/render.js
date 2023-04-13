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
    case 'rssInvalidContent':
    case 'rssNetworkError':
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

const renderContainer = (selector, title) => {
  const container = document.querySelector(selector);
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardBodyTitle = document.createElement('h2');
  cardBodyTitle.classList.add('card-title', 'h4');
  cardBodyTitle.innerText = i18nInstance.t(title);
  cardBody.append(cardBodyTitle);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(cardBody, ul);
  container.append(card);
};

export const renderFeedsMarkup = () => {
  renderContainer('.feeds', i18nInstance.t('feedsHeader'));
  renderContainer('.posts', i18nInstance.t('postsHeader'));
};

export const renderFeed = (feed) => {
  const feedsUl = document.querySelector('.feeds ul');
  const feedHeader = document.createElement('h3');
  feedHeader.classList.add('h6', 'm-0');
  feedHeader.innerText = feed.title;
  const feedDescription = document.createElement('p');
  feedDescription.classList.add('m-0', 'small', 'text-black-50');
  feedDescription.innerText = feed.description;
  feedsUl.append(feedHeader, feedDescription);
};

export const renderPosts = (posts) => {
  const postsUl = document.querySelector('.posts ul');
  postsUl.innerHtml = '';

  posts.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const href = document.createElement('a');
    href.classList.add('fw-bold');
    href.setAttribute('href', item.link);
    href.setAttribute('target', '_blank');
    href.setAttribute('rel', 'noopener noreferrer');
    href.setAttribute('data-id', item.id);
    href.innerText = item.title;
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('data-id', item.id);
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.innerText = i18nInstance.t('readMore');
    btn.addEventListener('click', () => {
      href.classList.remove('fw-bold');
      href.classList.add('fw-normal', 'link-secondary');
      const modalHeader = document.querySelector('.modal-header');
      const modalTitle = document.createElement('h5');
      modalTitle.classList.add('modal-title');
      modalTitle.innerText = item.title;
      modalHeader.prepend(modalTitle);
      const modalBody = document.querySelector('.modal-body');
      modalBody.innerText = item.description;
      const hrefArticle = document.querySelector('.full-article');
      hrefArticle.setAttribute('href', item.link);
    });
    li.append(href);
    li.append(btn);
    postsUl.append(li);
  });
};
