// @ts-check

import onChange from 'on-change';

const renderForm = (state, form, i18nInstance) => {
  const formFeedbackText = document.createTextNode(i18nInstance.t(state.formStatus.message));
  form.feedback.replaceChildren(formFeedbackText);

  form.input.classList.remove('is-invalid');
  form.input.removeAttribute('readonly');
  form.input.focus();
  form.submit.removeAttribute('disabled');
  form.feedback.classList.replace('text-success', 'text-danger');

  switch (state.formStatus.status) {
    case 'loading':
      form.input.setAttribute('readonly', 'true');
      form.submit.setAttribute('disabled', '');
      break;
    case 'error':
      form.input.classList.add('is-invalid');
      break;
    case 'success':
      form.self.reset();
      form.feedback.classList.replace('text-danger', 'text-success');
      break;
    default:
      throw new Error(`Unknown form state ${state.formStatus}`);
  }
};

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
      case 'formStatus':
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
