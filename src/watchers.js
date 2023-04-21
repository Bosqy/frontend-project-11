// @ts-check

import onChange from 'on-change';

const renderForm = (state, form, i18nInstance) => {
  const formContainer = form.parentElement;
  const formFeedback = document.createElement('p');

  formFeedback.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  const formFeedbackText = document.createTextNode(i18nInstance.t(state.form));
  formFeedback.replaceChildren(formFeedbackText);

  const urlInput = document.getElementById('url-input');
  urlInput.classList.remove('is-invalid');
  urlInput.removeAttribute('readonly');
  urlInput.focus();
  document.querySelectorAll('.rss-form ~ .feedback').forEach((el) => el.remove());

  const submit = document.querySelector('[type="submit"]');
  submit.removeAttribute('disabled');

  switch (state.form) {
    case 'rssLoading':
      urlInput.setAttribute('readonly', 'true');
      submit.setAttribute('disabled', 'disabled');
      break;
    case 'rssExists':
    case 'rssInvalidFormat':
    case 'rssInvalidContent':
    case 'rssNetworkError':
      formFeedback.classList.add('text-danger');
      urlInput.classList.add('is-invalid');
      break;
    case 'rssSuccess':
      urlInput.value = '';
      formFeedback.classList.add('text-success');
      break;
    default:
      throw new Error(`Unknown form state ${state.form}`);
  }
  formContainer.append(formFeedback);
};
/*
const renderCard = (container, title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardBodyTitle = document.createElement('h2');
  cardBodyTitle.classList.add('card-title', 'h4');
  cardBodyTitle.innerText = title;
  cardBody.append(cardBodyTitle);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(cardBody, ul);
  container.replaceChildren(card);
};
*/
const createCard = (title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardBodyTitle = document.createElement('h2');
  cardBodyTitle.classList.add('card-title', 'h4');
  const cardBodyTitleText = document.createTextNode(title);
  cardBodyTitle.replaceChildren(cardBodyTitleText);
  cardBody.append(cardBodyTitle);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(cardBody, ul);
  return card;
};

const renderFeeds = (state, feedsContainer, i18nInstance) => {
  const card = createCard(i18nInstance.t('feedsHeader'));
  const feedsUl = card.querySelector('ul');
  state.feeds.forEach((feed) => {
    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    const feedHeaderText = document.createTextNode(feed.title);
    feedHeader.replaceChildren(feedHeaderText);
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    const feedDescriptionText = document.createTextNode(feed.description);
    feedDescription.replaceChildren(feedDescriptionText);
    feedsUl.append(feedHeader, feedDescription);
  });
  feedsContainer.replaceChildren(card);
};
/*
const renderFeeds = (state, feedsContainer, i18nInstance) => {
  renderCard(feedsContainer, i18nInstance.t('feedsHeader'));
  const feedsUl = document.querySelector('.feeds ul');
  state.feeds.forEach((feed) => {
    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    feedHeader.innerText = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.innerText = feed.description;
    feedsUl.append(feedHeader, feedDescription);
  });
};
*/
/*
const renderPosts = (state, postsContainer, i18nInstance) => {
  if (state.posts.length > 0) {
    renderCard(postsContainer, i18nInstance.t('postsHeader'));
    const postsUl = document.querySelector('.posts ul');
    state.posts.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex',
      'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const href = document.createElement('a');
      if (item.visited) {
        href.classList.add('fw-normal', 'link-secondary');
      } else {
        href.classList.add('fw-bold');
      }
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
      li.append(href);
      li.append(btn);
      postsUl.prepend(li);
    });
  }
};
*/

const renderPosts = (state, postsContainer, i18nInstance) => {
  if (state.posts.length > 0) {
    const card = createCard(i18nInstance.t('postsHeader'));
    const postsUl = card.querySelector('ul');
    state.posts.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const href = document.createElement('a');
      if (item.visited) {
        href.classList.add('fw-normal', 'link-secondary');
      } else {
        href.classList.add('fw-bold');
      }
      href.setAttribute('href', item.link);
      href.setAttribute('target', '_blank');
      href.setAttribute('rel', 'noopener noreferrer');
      href.setAttribute('data-id', item.id);
      const hrefText = document.createTextNode(item.title);
      href.replaceChildren(hrefText);
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.setAttribute('data-id', item.id);
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#modal');
      const btnText = document.createTextNode(i18nInstance.t('readMore'));
      btn.replaceChildren(btnText);
      li.append(href);
      li.append(btn);
      postsUl.prepend(li);
    });
    postsContainer.replaceChildren(card);
  }
};

const renderModal = (state, modal) => {
  const title = document.createTextNode(state.modal.title);
  const body = document.createTextNode(state.modal.description);
  modal.title.replaceChildren(title);
  modal.body.replaceChildren(body);
  modal.href.setAttribute('href', state.modal.link);
};

export default (i18nInstance, state, domElements) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form':
        renderForm(state, domElements.form, i18nInstance);
        break;
      case 'feeds':
        renderFeeds(state, domElements.feedsContainer, i18nInstance);
        break;
      case 'posts':
        renderPosts(state, domElements.postsContainer, i18nInstance);
        break;
      case 'modal':
        renderModal(state, domElements.modal);
        break;
      default:
        throw new Error(`Unknown state paremeter ${path}`);
    }
  });
  return watchedState;
};
