import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import * as Location from 'expo-location';
import getWeatherData from '../apiHooks/weather';

const weatherImages = {
    Sunny: require('../assets/images/weather/sunny.png'),
    Cloudy: require('../assets/images/weather/cloudy.png'),
    Overcast: require('../assets/images/weather/overcast.png'),
    PartiallyCloudy: require('../assets/images/weather/partiallycloudy.png'),
    Snow: require('../assets/images/weather/snow.png'),
    ThunderStorm: require('../assets/images/weather/thunderstorm.png'),
    Rainy: require('../assets/images/weather/rainy.png'),
};

const getWeatherColourAndIcon = (description) => {
    if (description.includes('rain')){
        return{icon: weatherImages.Rainy, color: "#21618c"};
    }
    else if(description.includes('partially')){
        return{icon: weatherImages.PartiallyCloudy, color: "#34495e"};
    }
    else if(description.includes('sunny') || description.includes('clear')){
        return{icon: weatherImages.Sunny, color: "#d4ac0d"};
    }
    else if(description.includes('overcast')){
        return{icon: weatherImages.Overcast, color: "#7f8c8d"};
    }
    else if(description.includes('snow')){
        return{icon: weatherImages.Snow, color: "#2c3e50"};
    }
    else if(description.includes('thunder')){
        return{icon: weatherImages.ThunderStorm, color: "#5d6d7e"};
    }
    else{
        return{icon: weatherImages.Cloudy, color: "#7f8c8d"};
    }
};

export default function HomeScreen(){
    const [showSearch, toggleSearch] = useState(false);
    const[query, setQuery] = useState('');
    const[weatherData, setWeatherData] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const locationQuery = `${latitude},${longitude}`;
            setQuery(locationQuery);
            console.log(query)
            fetchWeather(`${latitude},${longitude}`);
        })();
    }, []);

    const fetchWeather = async() => {
        if(query != '' || query != null){
            setLoading(true);
            setError(null);
            try{
                const data = await getWeatherData(query);
                setWeatherData(data);
            }
            catch (err){
                setError('Error fetching data')
                alert('Error retrieving!')
            }
            finally{
                setLoading(false);
            }
        }
    };

    let backgroundColor = '#87CEEB'; 
    let WeatherIcon = null;

    if(weatherData){
        const {icon, color} = getWeatherColourAndIcon(weatherData.current.condition.text.toLowerCase());
        WeatherIcon = icon;
        backgroundColor = color;
    }
    return (
        <View className="flex-1 relative" style={{ backgroundColor }}>
            <StatusBar style="light" />
            {/* <Image blurRadius={10} source={require('../assets/images/bg.jpg')} className="absolute h-full w-full" /> */}

                <SafeAreaView className="flex flex-1">
                    <View style={{height: '7%'}} className="mx-4 relative z-50">
                        <View className="flex-row justify-end items-center rounded full" style={{backgroundColor: showSearch? 'rgba(225,225,225, 0.2)': 'transparent'}}>
                        {
                            showSearch?(
                                <TextInput 
                                    placeholder='Search for a city...'
                                    placeholderTextColor={'lightgrey'}
                                    className="pl-6 h-10 flex-1 text-base text-white"
                                    onChangeText={setQuery}>
                                </TextInput>
                            ):null
                        }

                        <TouchableOpacity 
                            style={{backgroundColor: 'rgba(225,225,225, 0.5)'}}
                            className="rounded-full p-3 m-1"
                            onPress={() => {
                                if (showSearch) {
                                    fetchWeather();
                                }
                                toggleSearch(!showSearch);
                            }}>
                            <MagnifyingGlassIcon size="25" color="white" />
                        
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 justify-center items-center">
                        {loading && <ActivityIndicator size="large" color="#3498db" />}
                        {weatherData ? (
                            <View>
                                <View className="flex justify-center items-center">
                                    {WeatherIcon && (
                                        <Image source={WeatherIcon} style={{ width: 100, height: 100, marginTop: 20, marginBottom: 20 }} />
                                    )}
                                </View>
                                <Text className="text-3xl text-white bold align-middle bold">{weatherData.location.name}, {weatherData.location.country}</Text>
                                <Text className="text-3xl text-white align-middle">{weatherData.current.temp_c}°C</Text>
                                <Text className="text-2xl text-white align-middle">{weatherData.current.condition.text}</Text>
                            </View>
                        ) : (
                            !loading && <Text className="text-3xl text-white bold align-middle">Enter a city to get weather information</Text>
                        )}
                    </View>
                    
                </SafeAreaView>
        </View>
    );
}