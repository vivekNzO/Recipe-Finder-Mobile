import { View, Text, Alert, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useEffect } from 'react'
import {API_URL} from '../../constants/api.js'
import {MealAPI} from '../../services/mealAPI.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import {recipeDetailStyles} from '../../assets/styles/recipe-detail.styles.js'
import { Image } from 'expo-image'
import {LinearGradient} from 'expo-linear-gradient'

const RecipeDetailScreen = () => {

    const {id:recipeId} = useLocalSearchParams()
    const [recipe,setRecipe] = useState(null)
    const [loading,setLoading] = useState(true)
    const [isSaved, setIsSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const {user} = useUser()
    const userId = user?.id

    useEffect(()=>{
        const checkIfSaved = async()=>{
            try {
                const response = await fetch(`${API_URL}/favourites/${userId}`)
                const favourites = await response.json()
                const isRecipeSaved = favourites.some((fav)=>fav.recipeId===parseInt(recipeId))
                setIsSaved(isRecipeSaved)
            } catch (error) {
                console.error("Error checking if recipe is saved: ",error)
            }
        }

        const loadRecipeDetail = async()=>{
            setLoading(true)
            try {
                const mealData = await MealAPI.getMealById(recipeId)
                if(mealData){
                    const transformedRecipe = MealAPI.transformMealData(mealData)
                    const recipeWithVideo = {
                        ...transformedRecipe,
                        youtubeUrl : mealData.strYoutube || null
                    }
                    setRecipe(recipeWithVideo)
                }
            } catch (error) {
                console.error("Error loading recipe detail",error)
            }finally{
                setLoading(false)
            }
        }
        checkIfSaved()
        loadRecipeDetail()
    },[recipeId,userId])

    const getYoutubeEmbedUrl = (url)=>{
        const videoId = url.split("v=")[1]
        return `https://youtube.com/embed/${videoId}`
    }

    const handleToggleSave = async()=>{
        setIsSaving(true)
        try {
            if(isSaved){
                const response = await fetch(`${API_URL}/favourites/${userId}/${recipeId}`,{
                    method:"DELETE"
                })
                if(!response.ok) throw new Error("Failed to remove recipe")
                setIsSaved(false)
            }else{
                const response = await fetch(`${API_URL}/favourites`,{
                    method:'POST',
                    headers:{
                        "Content-type":"application/json",
                    },
                    body:JSON.stringify({
                        userId,
                        recipeId:parseInt(recipeId),
                        title:recipe.title,
                        image:recipe.image,
                        cookTime:recipe.cookTime,
                        servings:recipe.servings,
                    })
                })

                if(!response.ok) throw new Error("Failed to save recipe")
                setIsSaved(true)
            }
        } catch (error) {
            console.error("Error toggling recipe save:",error)
            Alert.alert("Error","Something went wrong. Please try again.")
        }finally{
            setIsSaving(false)
        }
    }


    if(loading)return <LoadingSpinner message="Loading recipe details..."/>


  return (
    <View style={recipeDetailStyles.container}>
    <ScrollView
        showsVerticalScrollIndicator={false}
    >
        {/* header */}
        <View style={recipeDetailStyles.headerContainer}>
            <View style={recipeDetailStyles.imageContainer}>
                <Image
                    source={{uri:recipe.image}}
                    style={recipeDetailStyles.headerImage}
                    contentFit='cover'
                />
            </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />
        </View>
    </ScrollView>
    </View>
  )
}

export default RecipeDetailScreen