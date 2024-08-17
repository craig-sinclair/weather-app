import axios from 'axios';

const rapidApiKey = '';


const getWeatherData = async (query) => {
    const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {
        q: query,
        days: '3'
    },
    headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
    }
    };

    try {
        const response = await axios.request(options);
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export default getWeatherData;
