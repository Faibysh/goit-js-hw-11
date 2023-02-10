import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33451110-755b0e25228b8bf26b71483d6';

export default api = async ({ searchQuery, queryPage, perPage = 20 }) => {
  const data = await axios
    .get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${queryPage}`
    )
    .then(response => response.data);
  return { arrayOfHits: data.hits, numberOfTotalHits: data.totalHits };
};
