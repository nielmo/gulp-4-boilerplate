'use strict';

(function() {
  'use strict';

  var fadeOut = function fadeOut(el) {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  };

  var fadeIn = function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || 'flex';

    (function fade() {
      var val = parseFloat(el.style.opacity);

      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  };
  /**
   * Toggle modal
   * ===========
   * Add `id` in modal
   * ===========
   * Add `data-modal` attr to button/link.
   * The `data-modal` value should be
   * same as id of the modal to be called.
   */

  var hideModal = function hideModal(modal, offset) {
    modal.addEventListener('click', function(event) {
      var target = event.target;

      if (target.className.includes('js-close-modal')) {
        document.body.classList.remove('body--fixed');
        document.body.style.top = 'initial';
        window.scrollTo(0, offset);
        fadeOut(modal);
      }
    });
  };

  var toggleModal = function toggleModal() {
    var buttons = document.querySelectorAll('.js-open-modal');

    if (buttons) {
      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          var modal = button.dataset.modal;
          var element = document.getElementById(modal);
          var scrollPosition = window.pageYOffset;
          document.body.classList.add('body--fixed');
          document.body.style.top = '-'.concat(scrollPosition, 'px');
          fadeIn(element);
          hideModal(element, scrollPosition);
        });
      });
    }
  };
  /* global toggleModal */

  toggleModal();
})();
