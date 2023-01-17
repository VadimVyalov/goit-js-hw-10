const START_URL = 'https://restcountries.com/v3.1/name';
const FILTER_OPTION = '?fields=name,capital,population,flags,languages';

export async function fetchCountries(name) {
  const response = await fetch(`${START_URL}/${name}${FILTER_OPTION}`);
  return await response.json();
}
