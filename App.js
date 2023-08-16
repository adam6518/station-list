import { StyleSheet, View, FlatList, Image } from "react-native";
import { SafeAreaView, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Text, Card, Button, Icon } from "@rneui/themed";
import filter from "lodash.filter"

const API_ENDPOINT = "https://booking.kai.id/api/stations2";
var IMAGE = require('./assets/stations.png')

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchData(API_ENDPOINT);
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);

      // console.log(json);
      setFullData(json)
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSearch = (input) => {
    setSearchInput(input);
    const formattedInput = input.toLowerCase()
    const filteredData = filter(fullData, (name) => {
      return contains(name, formattedInput)
    })
    setData(filteredData)
  };

  const contains = ({name}, input) => {
    
    if(name.toString().includes(input)){
      console.log(name.toString());
      console.log(input);
      return true
    }
    return false
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Can't get the data. Please reconnect !</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.head}>Station List Application</Text>
      <TextInput
        placeholder="Search here..."
        clearButtonMode="always"
        style={styles.searchBox}
        autoCapitalize="none"
        autoCorrect={false}
        value={searchInput}
        onChangeText={(input) => handleSearch(input)}
      />

      <FlatList
        style={styles.cardList}
        data={data}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Image
              source={IMAGE} style={styles.stationImages}
            />
            <Text>Description :</Text>
            <Text>Station's name : {item.name}</Text>
            <Text>City : {item.city}</Text>
            <Text>City's name : {item.cityname}</Text>
          </Card>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: {
    marginTop: 100,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#4dc9ff",
    fontWeight: "bold"
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 50,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10
  },
  card: {
    // backgroundColor: '#ebd5f0'
  },
  cardList: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ebd5f0'
  },
  stationImages: {
    resizeMode: 'cover',
    height: 100,
    width: 'auto'
  }
});
