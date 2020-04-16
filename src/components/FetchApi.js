const API_KEY = "lQtrpRDYVbjAzpxqteWznJPbgk05p5P0";
const searchGiphy = async (term) => {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${term}&limit=50&offset=0&rating=PG-13&lang=en`);
    if (response.status === 200) {
      return response.json();
    }
    else {
      throw new Error(response);
    }
};

export default searchGiphy;