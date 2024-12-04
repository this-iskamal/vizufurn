import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React,{FC} from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Category from '../components/Category'
import Carousel from '../components/Carousel'

const Home:FC = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Navbar />
         <Search />
         <Category />
         <Carousel />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#FFFFFF",
    flexDirection:"column"
  }
})

export default Home