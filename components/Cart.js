import React from 'react';
import { StyleSheet, Text, View, Alert,TouchableHighlight,TouchableOpacity,TextInput, StatusBar,ActivityIndicator,SafeAreaView,FlatList } from 'react-native';
import Constants from "expo-constants";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("foodorder.db");

export default class Cart extends React.Component {
    static navigationOptions = {
        title: 'Cart List',
    };
    state = {
        orderedMenu : []
    }  
    
    constructor(){
        super();
        db.transaction(tx => {
            tx.executeSql(
                'select * from cart',
                null,
                (_, { rows: { _array } }) => {
                    //alert(JSON.stringify(_array));
                    this.setState({ orderedMenu: _array })
                }
            );
        });

        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };
    delete = (item,index) => {
        Alert.alert(
            'Confirmation',
            'Delete Order?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'Yes Please', onPress: () => {
                    db.transaction(tx => {
                        tx.executeSql(
                            "DELETE FROM cart WHERE id=?", [item.id]
                        )},
                        error => {
                            alert(error);  
                        },
                        () => {   
                        var dAr = this.state.orderedMenu;
                        //ambilindeks ke berapa si array teh
                        var pos = dAr.indexOf(item);
                        //kita hupus si array itu
                        dAr.splice(pos,1);
                        //kita set lagi state yang baru nya
                        this.setState({orderedMenu:dAr})
                        }
                    );
                }},
            ],
            {cancelable: true},
        );
        
    }
    render(){
        return (
            <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={this.state.orderedMenu}
                        renderItem={({item,index}) =>{
                            let subtotal = item.price * item.qty;
                            return (
                                <View>
                                <View style={styles.container}>
                                    <Text style={styles.theLeft}>{item.id} {item.title}</Text>
                                    <View style={styles.shinTheRight}>
                                        <Text style={styles.theRight}>{item.qty} Menu</Text>
                                        <TouchableHighlight style={styles.fullWidthButton} onPress={() => this.delete(item,index)}>
                                            <Text style={styles.fullWidthButtonText}>Delete</Text>
                                        </TouchableHighlight> 
                                    </View>
                                </View>
                                <Text style={{alignSelf:'center'}}>---------------------------------------------------------------------------</Text>
                                </View>
                            );
                        }} 
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    theLeft:{ 
        width: '50%',
        margin: 20,
        padding:10,

    },
    shinTheRight:{
        flex:1,marginRight:10,

        margin:10
    },
    theRight:{
        marginTop:10,
        alignSelf:'center'
    },
    buttonContainer: {
        flex: 1,
    },
    fullWidthButton: {
        backgroundColor: '#F24405',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:20
      },
      fullWidthButtonText: {
        margin:10,
        fontSize:10,
        color: 'white'
      },
});