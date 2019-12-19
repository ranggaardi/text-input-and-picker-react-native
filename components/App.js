import React from 'react';
import { View, Text,Button,StyleSheet,SafeAreaView,FlatList,TouchableOpacity } from 'react-native';
import Constants from "expo-constants";
import Cart from './components/Cart';
import ListMenu from './components/ListMenu';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import * as SQLite from 'expo-sqlite';

//2. Buat Navigator
const AppNavigator = createStackNavigator(
  {
    ListScreen:{
      screen: ListMenu,
    },
    CartScreen:{
      screen: Cart,
    },
  },
  {
    initialRouteName : 'ListScreen',
    mode: 'card',
    defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#4666A6',
          marginTop: Constants.statusBarHeight,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
  }
  );
//untuk bikin si navigator di renderan nya
const AppContainer = createAppContainer(AppNavigator);
//untuk masuk ke db nya di offline gengs
const db = SQLite.openDatabase("foodorder.db"); 

export default class App extends React.Component {
  
  //ini untuk masukin db, pasti harus di componentdid mount ya gengs
  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists cart (id INTEGER primary key not null, title TEXT, ingredients TEXT, qty INTEGER);"
      );
    });
  }

  render(){
    return (
      <AppContainer/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
