const toggleButton = document.getElementById('contact-toggle');

if (toggleButton) {
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
