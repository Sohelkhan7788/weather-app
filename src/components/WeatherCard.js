import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

function WeatherCard({ weather, isForecast = false }) {
  if (!weather) return null;

  return (
    <LinearGradient
      colors={["#6C63FF", "#89CFF0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, isForecast && styles.forecastCard]}
    >
      <Image source={weather.icon} style={styles.icon} />
      <Text style={styles.temp}>{Math.round(weather.temp)}°C</Text>
      <Text style={styles.city}>{weather.city}</Text>
      <View style={styles.row}>
        <Text style={styles.detail}>💧 {weather.humidity}%</Text>
        <Text style={styles.detail}>🌬 {weather.wind} km/h</Text>
      </View>
    </LinearGradient>
  );
}

// 🔹 Memoize for performance (prevents re-render on scroll)
export default React.memo(WeatherCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginVertical: 10,
    width: width * 0.85, // Full width for main weather
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  forecastCard: {
    width: width * 0.65, // Smaller width for forecast
  },
  icon: { width: 80, height: 80, marginBottom: 10 },
  temp: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  city: { fontSize: 18, color: "#fff", marginBottom: 5, textAlign: "center" },
  row: { marginTop: 8, alignItems: "center" },
  detail: { color: "#fff", fontSize: 14 },
});
