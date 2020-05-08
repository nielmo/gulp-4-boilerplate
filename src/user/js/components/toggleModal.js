/**
 * Toggle modal
 * ===========
 * Add `id` in modal
 * ===========
 * Add `data-modal` attr to button/link.
 * The `data-modal` value should be
 * same as id of the modal to be called.
 */
import { fadeIn, fadeOut } from './fade';

const hideModal = (modal, offset) => {
  modal.addEventListener('click', event => {
    const { target } = event;

    if (target.className.includes('js-close-modal')) {
      document.body.classList.remove('body--fixed');
      document.body.style.top = 'initial';
      window.scrollTo(0, offset);
      fadeOut(modal);
    }
  });
};

const toggleModal = () => {
  const buttons = document.querySelectorAll('.js-open-modal');

  if (buttons) {
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const { modal } = button.dataset;
        const element = document.getElementById(modal);
        const scrollPosition = window.pageYOffset;

        document.body.classList.add('body--fixed');
        document.body.style.top = `-${scrollPosition}px`;
        fadeIn(element);
        hideModal(element, scrollPosition);
      });
    });
  }
};

export default toggleModal;
