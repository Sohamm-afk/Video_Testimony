(function () {
  'use strict';

  var videoTestimonials = [
    {
      youtubeId: 'WR1ydijTx5E',
      name: 'Tim Kim',
      role: 'Self-taught software developer',
      quote: 'Tim Kim describes learning to code without a computer science degree or bootcamp and getting a software developer job in four months.',
      duration: '9:50'
    },
    {
      youtubeId: 'kQC_ssE9HaI',
      name: 'Anurag Singh ProCodrr',
      role: '',
      quote: 'Anurag Singh recounts learning to code for seven months after failing 12th grade, then getting a job without a degree.',
      duration: '28:00'
    },
    {
      youtubeId: '6nMfr-ZkBNk',
      name: 'Dylan Cole',
      role: 'Self-taught programmer',
      quote: 'Dylan Cole shares his self-taught programming story and describes building a career without a computer science degree.',
      duration: '9:27'
    },
    {
      youtubeId: 'PIpzlVjRoLQ',
      name: 'Shivanjali',
      role: 'Software developer at Microsoft',
      quote: 'Shivanjali describes moving from mechanical engineering to software development at Microsoft, including how coding, projects, and problem-solving fit into her journey.',
      duration: '6:16'
    },
    {
      youtubeId: 'BI8du4rC1Iw',
      name: 'Fraz',
      role: '',
      quote: 'Fraz describes learning to code from his first year of college and the path he took to a job at Google.',
      duration: '18:05'
    },
    {
      youtubeId: 'oJ6BjHU-Bec',
      name: 'Yash Raj Gupta',
      role: 'Remote software engineer',
      quote: 'Yash Raj Gupta describes moving from a BA degree and no technical background to a remote software engineering job in six months.',
      duration: '7:01'
    }
  ];

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function hasYouTubeId(id) {
    return /^[A-Za-z0-9_-]{11}$/.test(id);
  }

  function renderCards(grid) {
    videoTestimonials.forEach(function (story, index) {
      var card = createElement('article', 'story-card');
      var media = createElement('div', 'story-media');
      var thumbnail = createElement('img', 'story-thumbnail');
      var playButton = createElement('button', 'video-trigger');
      var playControl = createElement('span', 'play-control');
      var playIcon = createElement('i', 'fa-solid fa-play');
      var duration = createElement('span', 'duration-badge', story.duration);
      var body = createElement('div', 'story-body');
      var summary = createElement('p', 'story-quote', story.quote);
      var person = createElement('div', 'story-person');
      var name = createElement('span', 'story-name', story.name);
      var role = createElement('span', 'story-role', story.role);
      var triedStandardThumbnail = false;

      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      thumbnail.decoding = 'async';
      thumbnail.hidden = !hasYouTubeId(story.youtubeId);
      if (!thumbnail.hidden) {
        thumbnail.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(story.youtubeId) + '/maxresdefault.jpg';
      }
      function useStandardThumbnail() {
        if (triedStandardThumbnail) {
          thumbnail.hidden = true;
          return;
        }
        triedStandardThumbnail = true;
        thumbnail.src = 'https://i.ytimg.com/vi/' +
          encodeURIComponent(story.youtubeId) + '/hqdefault.jpg';
      }

      thumbnail.addEventListener('error', useStandardThumbnail);
      thumbnail.addEventListener('load', function () {
        if (thumbnail.naturalWidth > 0 && thumbnail.naturalWidth < 200) {
          useStandardThumbnail();
        }
      });

      playIcon.setAttribute('aria-hidden', 'true');
      playControl.setAttribute('aria-hidden', 'true');
      duration.setAttribute('aria-hidden', 'true');
      playButton.type = 'button';
      playButton.setAttribute('aria-label', 'Play developer story from ' + story.name);
      playButton.setAttribute('data-video-index', String(index));

      playControl.appendChild(playIcon);
      playButton.appendChild(playControl);
      playButton.appendChild(duration);
      media.appendChild(thumbnail);
      media.appendChild(playButton);

      person.appendChild(name);
      person.appendChild(role);
      body.appendChild(summary);
      body.appendChild(person);
      card.appendChild(media);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function initTestimonials() {
    var grid = document.querySelector('[data-testimonial-grid]');
    var dialog = document.querySelector('[data-video-modal]');
    if (!grid || !dialog || typeof dialog.showModal !== 'function') return;

    var playerFrame = dialog.querySelector('[data-video-frame]');
    var modalName = dialog.querySelector('[data-modal-name]');
    var modalRole = dialog.querySelector('[data-modal-role]');
    var modalSummary = dialog.querySelector('[data-modal-summary]');
    var modalCounter = dialog.querySelector('[data-modal-counter]');
    var closeButton = dialog.querySelector('[data-close-modal]');
    var previousButton = dialog.querySelector('[data-previous-video]');
    var nextButton = dialog.querySelector('[data-next-video]');
    var activeIndex = 0;
    var opener = null;

    function clearPlayer() {
      while (playerFrame.firstChild) {
        playerFrame.removeChild(playerFrame.firstChild);
      }
    }

    function showVideo(index) {
      var story = videoTestimonials[index];

      activeIndex = index;
      modalName.textContent = story.name;
      modalRole.textContent = story.role;
      modalSummary.textContent = story.quote;
      modalCounter.textContent = 'Video ' + (index + 1) + ' of ' + videoTestimonials.length;

      clearPlayer();
      if (!hasYouTubeId(story.youtubeId)) {
        var placeholder = createElement('div', 'player-placeholder');
        var icon = createElement('i', 'fa-solid fa-link');
        var message = createElement('p', '', 'Add this story\u2019s 11-character YouTube ID in script.js to enable playback.');
        icon.setAttribute('aria-hidden', 'true');
        placeholder.appendChild(icon);
        placeholder.appendChild(message);
        playerFrame.appendChild(placeholder);
        return;
      }

      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(story.youtubeId) + '?autoplay=1&rel=0';
      iframe.title = story.name + ' developer story video';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.addEventListener('load', function () {
        if (dialog.open && document.activeElement === iframe) closeButton.focus();
      });
      playerFrame.appendChild(iframe);
    }

    function openVideo(index, button) {
      opener = button;
      dialog.showModal();
      showVideo(index);
      closeButton.focus();
    }

    function closeVideo() {
      if (!dialog.open) return;
      clearPlayer();
      dialog.close();
    }

    grid.addEventListener('click', function (event) {
      var button = event.target.closest('[data-video-index]');
      if (!button || !grid.contains(button)) return;
      openVideo(Number(button.getAttribute('data-video-index')), button);
    });

    closeButton.addEventListener('click', closeVideo);
    previousButton.addEventListener('click', function () {
      showVideo((activeIndex + videoTestimonials.length - 1) % videoTestimonials.length);
      previousButton.focus();
    });
    nextButton.addEventListener('click', function () {
      showVideo((activeIndex + 1) % videoTestimonials.length);
      nextButton.focus();
    });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeVideo();
    });

    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeVideo();
    });

    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeVideo();
        return;
      }

      if (event.key !== 'Tab') return;

      var focusable = Array.prototype.slice.call(dialog.querySelectorAll(
        'button:not([disabled]), iframe, [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    dialog.addEventListener('close', function () {
      clearPlayer();
      if (opener) opener.focus();
    });

    renderCards(grid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonials);
  } else {
    initTestimonials();
  }
})();
