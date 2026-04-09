initContactToggle();
initSongRequestForm();

function initContactToggle() {
  const toggleButton = document.getElementById('contact-toggle');

  if (!toggleButton) {
    return;
  }

  const email = toggleButton.dataset.email || 'contactme.nbz@gmail.com';
  let isRevealed = false;
  let resetTimer;

  const setRevealedLabel = () => {
    toggleButton.innerHTML = `
      <span class="contact-action">Tap to Hide</span>
      <span class="contact-divider">·</span>
      <span class="contact-email">${email}</span>
    `;
  };

  const setHiddenLabel = () => {
    toggleButton.textContent = 'Tap to Unhide';
  };

  const showCopied = () => {
    toggleButton.classList.add('is-copied');
    toggleButton.textContent = 'Copied to clipboard!';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      toggleButton.classList.remove('is-copied');
      if (isRevealed) {
        setRevealedLabel();
      } else {
        setHiddenLabel();
      }
    }, 1400);
  };

  const copyEmail = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(email);
      return;
    }

    const tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    tempInput.remove();
  };

  toggleButton.addEventListener('click', async (event) => {
    if (!isRevealed) {
      isRevealed = true;
      toggleButton.classList.add('is-revealed');
      toggleButton.setAttribute('aria-pressed', 'true');
      setRevealedLabel();
      return;
    }

    const clickedEmail = event.target.closest('.contact-email');
    if (clickedEmail) {
      try {
        await copyEmail();
        showCopied();
      } catch (error) {
        console.error('Clipboard copy failed:', error);
      }
      return;
    }

    isRevealed = false;
    toggleButton.classList.remove('is-revealed');
    toggleButton.setAttribute('aria-pressed', 'false');
    setHiddenLabel();
  });
}

function initSongRequestForm() {
  const form = document.getElementById('song-request-form');

  if (!form) {
    return;
  }

  const statusNode = document.getElementById('song-request-status');
  const submitButton = document.getElementById('song-request-submit');
  const requestInput = document.getElementById('song-request');
  const genreInputs = Array.from(form.querySelectorAll('input[name="genre"]'));
  const configuredEndpoint = getSongRequestEndpoint();

  let isSubmitting = false;

  const setStatus = (type, message) => {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message || '';
    statusNode.className = 'form-status';

    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const setSubmitting = (nextSubmitting) => {
    isSubmitting = nextSubmitting;
    if (submitButton) {
      submitButton.disabled = nextSubmitting;
      submitButton.textContent = nextSubmitting ? 'Sending Request...' : 'Send Song Request';
    }
  };

  const getTrimmedSongRequest = () => (requestInput ? requestInput.value.trim() : '');

  const getSelectedGenre = () => {
    const selectedInput = genreInputs.find((input) => input.checked);
    return selectedInput ? selectedInput.value : '';
  };

  const validateForm = () => {
    const songRequest = getTrimmedSongRequest();
    const genre = getSelectedGenre();

    if (!songRequest) {
      setStatus('error', 'Add the song name and artist before you send the request.');
      if (requestInput) {
        requestInput.focus();
      }
      return false;
    }

    if (!genre) {
      setStatus('error', 'Pick a genre so I know where the request should land.');
      if (genreInputs[0]) {
        genreInputs[0].focus();
      }
      return false;
    }

    return true;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!configuredEndpoint) {
      setStatus('error', 'Song requests are not connected yet. Add the deployed Google Apps Script URL in site-config.js.');
      return;
    }

    if (requestInput) {
      requestInput.value = getTrimmedSongRequest();
    }

    form.action = configuredEndpoint;
    setSubmitting(true);
    setStatus('sending', 'Thanks! Sending your request...');
    HTMLFormElement.prototype.submit.call(form);
    form.reset();
    setSubmitting(false);
    setStatus('success', 'Thanks! Your request was sent.');
  });
}

function getSongRequestEndpoint() {
  const endpoint = window.NBZ_SITE_CONFIG && typeof window.NBZ_SITE_CONFIG.songRequestEndpoint === 'string'
    ? window.NBZ_SITE_CONFIG.songRequestEndpoint.trim()
    : '';

  if (!endpoint || endpoint.includes('REPLACE_WITH_YOUR_DEPLOYED_APP_ID')) {
    return '';
  }

  return endpoint;
}
