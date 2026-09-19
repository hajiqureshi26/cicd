const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const suggestionForm = document.querySelector('#suggestion-form');
const suggestionList = document.querySelector('#suggestion-list');
const suggestionStatus = document.querySelector('#suggestion-status');
const suggestionsStorageKey = 'abdulrahman-portfolio-suggestions';

const getSuggestions = () => {
  try {
    return JSON.parse(localStorage.getItem(suggestionsStorageKey) || '[]');
  } catch {
    return [];
  }
};

const renderSuggestions = () => {
  const suggestions = getSuggestions();
  suggestionList.replaceChildren();

  if (!suggestions.length) {
    return;
  }

  const heading = document.createElement('p');
  heading.className = 'suggestion-count';
  heading.textContent = `${suggestions.length} saved suggestion${suggestions.length === 1 ? '' : 's'}`;
  suggestionList.append(heading);

  suggestions.slice().reverse().forEach((suggestion) => {
    const item = document.createElement('article');
    item.className = 'suggestion-item';
    const author = document.createElement('strong');
    author.textContent = suggestion.name || 'Anonymous';
    const message = document.createElement('p');
    message.textContent = suggestion.message;
    item.append(author, message);
    suggestionList.append(item);
  });
};

suggestionForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(suggestionForm);
  const message = String(formData.get('message') || '').trim();

  if (!message) {
    suggestionStatus.textContent = 'Please add a suggestion first.';
    return;
  }

  const suggestions = getSuggestions();
  suggestions.push({
    name: String(formData.get('name') || '').trim(),
    message,
    createdAt: new Date().toISOString(),
  });

  try {
    localStorage.setItem(suggestionsStorageKey, JSON.stringify(suggestions));
    suggestionForm.reset();
    suggestionStatus.textContent = 'Suggestion saved on this device.';
    renderSuggestions();
  } catch {
    suggestionStatus.textContent = 'Storage is unavailable in this browser.';
  }
});

renderSuggestions();
