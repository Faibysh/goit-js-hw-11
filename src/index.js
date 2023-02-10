import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import api from './getImages.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const goTopButton = document.getElementById('go-top-button');
let hits = {};
let perPage = 40;
let queryPage = 1;
let searchQuery = '';

async function onSearch(e) {
  e.preventDefault();
  queryPage = 1;
  const form = e.currentTarget;
  searchQuery = form.elements.searchQuery.value.trim();
  clearHtml();

  hits = await getQuery();

  if (hits.numberOfTotalHits) {
    Notiflix.Notify.success(
      `Hooray! We found ${hits.numberOfTotalHits} images!`
    );
  }

  form.reset();
}

async function onLoadMore() {
  if (perPage * queryPage >= hits.numberOfTotalHits) {
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  queryPage += 1;
  hits = await getQuery();
  lightbox.refresh();
}

async function getQuery() {
  try {
    hits = await api({ perPage, queryPage, searchQuery });
    if (hits.arrayOfHits === undefined || hits.arrayOfHits.length === 0) {
      throw new Error();
    }

    const markUp = hits.arrayOfHits.reduce(
      (markUp, hit) => createPhotoCard(hit) + markUp,
      ''
    );

    gallery.insertAdjacentHTML('beforeend', markUp);
    const lightbox = new SimpleLightbox('.photo-link', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 250,
    });
    return hits;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function clearHtml() {
  gallery.innerHTML = '';
}

function createPhotoCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
  <a href=${largeImageURL} class='photo-link'>
  <img src="${webformatURL}" alt="${tags}" loading="lazy" 
  width="300px" heigth="225px" />
  </a>
  <div class="info">
  <p class="info-item">
  <b> 
  Likes
  </b>
  <span class="value">${likes}</span>
  </p>
  <p class="info-item">
  <b>
  Views
  </b>
  <span class="value">${views}</span> 
  </p>
  <p class="info-item">
  <b> 
  Comments
  </b>
  <span class="value">${comments}</span>
  </p>
  <p class="info-item">
  <b> 
  Downloads
  </b>
  <span class="value">${downloads}</span>
  </p>
  </div>
  </div>
  `;
}

const onClickTopHandler = e => {
  e.preventDefault();
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

goTopButton.addEventListener('click', onClickTopHandler);
form.addEventListener('submit', onSearch);
window.addEventListener('scroll', e => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    onLoadMore();
  }

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goTopButton.classList.add('go-top-button-visible');
  } else {
    goTopButton.classList.remove('go-top-button-visible');
  }
});
