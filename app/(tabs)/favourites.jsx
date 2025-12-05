import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { useState } from 'react';
import { useEffect } from 'react';
import {API_URL} from '../../constants/api.js'
import {favoritesStyles} from '../../assets/styles/favourites.styles.js'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors.js';
import RecipeCard from '../../components/RecipeCard.jsx';
import NoFavouritesFound from '../../components/NoFavouritesFound.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const FavouritesScreen = () => {

  const {signOut} = useClerk();
  const {user} = useUser()

  const [favouriteRecipes,setFavouriteRecipes] = useState([]);
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const loadFavourites = async()=>{
      try {
        const response = await fetch(`${API_URL}/favourites/${user.id}`)
        if(!response.ok)throw new Error("Failed to fetch favourites")
        const favourites = await response.json()
        const transformFavourites = favourites.map((favourite)=>({
          ...favourite,
          id:favourite.recipeId
        }))
      setFavouriteRecipes(transformFavourites)
      } catch (error) {
        Alert.alert("Error","Failed to load favourites")
      }
      finally{
        setLoading(false)
      }
    }
    loadFavourites()
  },[user.id])

  const handleSignOut = ()=>{
    Alert.alert("Logout","Are you sure you want to logout?",[
      {text:"Cancel",style:"cancel"},
      {text:"Logout",style:"destructive",onPress:signOut}
    ])
  }

  if(loading)return <LoadingSpinner message='Loading your favorites...'/>
  return (
    <View style={favoritesStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>Favourites</Text>
        <TouchableOpacity
          style={favoritesStyles.logoutButton}
          onPress={handleSignOut}
        >
          <Ionicons
             name = "log-out-outline"
             size={22}
             color={COLORS.text}
          />
        </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favouriteRecipes}
            renderItem={({item})=><RecipeCard recipe={item}/>}
            keyExtractor={(item)=>item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavouritesFound/>}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default FavouritesScreen