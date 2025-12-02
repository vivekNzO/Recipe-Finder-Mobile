import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {Image} from 'expo-image'
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}
    >
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Image source={require("@/assets/images/react-logo.png")}
      style={{
        width:100,
        height:100
      }}
      />
      <TextInput placeholder="youremail" style={{padding:10,borderWidth:1}}/>

      <TouchableOpacity>
        <Text>Click me</Text>
      </TouchableOpacity>
      <Link href={"/about"}>
      Visit about
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  text:{
    color:"red",
  }

  
})