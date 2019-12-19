import React from 'react';
import { FlatList, ActivityIndicator, Text, View,StyleSheet,Image,TextInput,Button } from 'react-native';
import ActionButton from 'react-native-action-button';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/Ionicons';

const db = SQLite.openDatabase("foodorder.db");

export default class ListMenu extends React.Component {
    static navigationOptions = {
        title: 'Menu List',
    };
    state = {
        title : '',
        ingredients: ''
    } 
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
    }

    buy = (item,index) => {
        //alert(item.title);
        //ambil qty dari state
        var qty = parseInt(this.state.qty);
        db.transaction(tx => {
            tx.executeSql(
                "insert into cart (title,ingredients,qty) values (?,?,?);",
                [item.title,item.ingredients,qty]
            )},
            error => {
                alert(error);  
            },
            () => {  
                alert('Food succesfully added into the cart');
            }
        );
    }

    componentDidMount(){
        return fetch('http://www.recipepuppy.com/api?i=onions,garlic&q=omelet&p=3')
        .then((response) => response.json())
        .then((responseJson) => {

            this.setState({
                isLoading: false,
                dataSource: responseJson.results,
            }, function(){

            });

        })
        .catch((error) =>{
            console.error(error);
        });
    }

    flatListItemSeparator = () => {
        return (
            <View
            style={{
                height: .5,
                width: "100%",
                backgroundColor: "#000",
            }}
            />
        );
    }

    render(){
        if(this.state.isLoading){
            return(
            <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator/>
            </View>
            )
        }
        return (
            <View style={{ flex: 1, paddingTop: 20 }}>
                <FlatList
                    ItemSeparatorComponent = {this.flatListItemSeparator}
                    data={this.state.dataSource}
                    renderItem={({item, index}) =>{
                    return (
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <Image source = {{ uri: item.thumbnail }} style={styles.imageView} />
                            <View style={{flex:1,marginRight:20}}>
                                <Text style={{fontWeight:'bold'}}>{item.title}</Text>
                                <Text>{item.subtitle}</Text>
                                <View style={styles.containerButtonGroup}>
                                    <View style={styles.buttonContainer}>
                                        <TextInput 
                                            onChangeText={(qty) => this.setState({ qty })}
                                            keyboardType='number-pad' 
                                            placeholder='qty' style={styles.inputStyle}
                                        />
                                    </View>
                                    <View style={styles.buttonContainer}>
                                    {/* () => means callback */}
                                        <Button  
                                        onPress={() => this.buy(item,index)}
                                        title="buy"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                    }} 
                    keyExtractor={({ title }, index) => title}
                />
                <ActionButton 
                    renderIcon={active => active ? (<Icon name="ios-basket" style={styles.actionButtonIcon} /> ) : (<Icon name="ios-basket" style={styles.actionButtonIcon} />)}
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => this.props.navigation.navigate('CartScreen')
                }/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer :{
        justifyContent: 'center',
        flex:1,
        margin: 5,
        marginTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    imageView: {  
        width: '50%',
        height: 100 ,
        margin: 7,
        borderRadius : 7
    },
    textView: {
        width:'50%', 
        textAlignVertical:'center',
        padding:10,
        color: '#000'  
    },
    containerButtonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
    },
    inputStyle : {
        height:30,
        borderColor:'blue',
        borderWidth:1,
        marginRight:6,
        textAlign:'center'
    } 
});