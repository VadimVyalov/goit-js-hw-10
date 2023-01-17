import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const fetchCountriesInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

fetchCountriesInput.addEventListener(
  'input',
  debounce(checkInput, DEBOUNCE_DELAY)
);

async function checkInput(event) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  countryList.classList.remove('oneCountry');
  const name = event.target.value.trim();
  if (!name) {
    return;
  }

  try {
    const countries = await fetchCountries(name);

    if (countries.status === 404) {
      throw new Error(countries.status);
    }

    if (countries.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }

    countryList.innerHTML = renderCoutries(countries);

    if (countries.length === 1) {
      countryInfo.innerHTML = renderCoutryInfo(countries[0]);
      countryList.classList.add('oneCountry');
    }
  } catch (error) {
    Notify.failure(`Oops, there is no country with that name`);
  }
}

function renderCoutries(countries) {
  return countries.map(renderCoutry).join('');
}

function renderCoutry(country) {
  const {
    name: { official },
    flags: { svg },
  } = country;

  return `
        <li>
            <img src="${svg}" alt="${official}" width='100' />
            <p>${official}</p>
        </li>
      `;
}

function renderCoutryInfo(country) {
  const { capital, population, languages } = country;

  return `
            <p> <a>Capital: </a> ${capital}</p>
            <p> <a>Population: </a> ${population}</p>
            <p> <a>Languages: </a> ${Object.values(languages)}</p>
       
      `;
}
