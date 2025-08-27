import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import WeatherCard from "../components/WeatherCard";

const API_KEY = "90577f15333c82b1c935735591fe3a7f";
const CARD_WIDTH = Dimensions.get("window").width * 0.65 + 12; // width + spacing

export default function SearchScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      Alert.alert("Please enter a city name");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (res.ok) {
        setWeather({
          city: data.name,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          icon: {
            uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
          },
        });

        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await resForecast.json();
        if (resForecast.ok) {
          const daily = forecastData.list.filter((_, index) => index % 8 === 0);
          setForecast(daily);
        }
      } else {
        Alert.alert("Error", data.message || "City not found");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch weather");
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient colors={["#E0F7FA", "#B2EBF2"]} style={styles.container}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter city..."
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchWeather}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#6C63FF"
            style={{ marginTop: 20 }}
          />
        )}

        {weather && <WeatherCard weather={weather} />}

        {forecast.length > 0 && (
          <>
            <Text style={styles.forecastTitle}>🌤 5-Day Forecast</Text>
            <FlatList
              data={forecast}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              initialNumToRender={3}
              windowSize={5}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
              })}
              snapToInterval={CARD_WIDTH} // 🔹 Snap like carousel
              decelerationRate="fast" // smooth snapping
              renderItem={({ item }) => (
                <WeatherCard
                  isForecast
                  weather={{
                    city: new Date(item.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "long",
                    }),
                    temp: item.main.temp,
                    humidity: item.main.humidity,
                    wind: item.wind.speed,
                    icon: {
                      uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    },
                  }}
                />
              )}
            />
          </>
        )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchRow: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 25,
  },
  searchText: { color: "#fff", fontWeight: "bold" },
  forecastTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    alignSelf: "center",
  },
});
