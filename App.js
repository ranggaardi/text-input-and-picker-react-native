import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Picker } from 'react-native';


//2. Create
class App extends React.Component {

  state ={
    text : '',
    done : 'OnProgress',
    todo : [] //menampung hasil input
  }

  tambahTodo = () => {
    //ambil dari nilai input text 
    var newTodo = {
      text:this.state.text,
      done:this.state.done
    };
    //menampung inputan baru
    var arr = this.state.todo;
    arr.push(newTodo);
    this.setState({todo:arr,text:'', done:'onProgress'});
  }

  //fungsi untuk menampilkan array todo 
  tampilTodos = () => {
   return this.state.todo.map(t => {
     return(
       <TouchableOpacity key={t.text}>
        <Text onPress={() => this.hapusTodo(t)}>{t.text} {t.done}</Text>
       </TouchableOpacity>
     );
   });

  }

  hapusTodo = (t) => {
    var arr = this.state.todo
    //mendapatkan index yang akan dihapus
    var pos = arr.indexOf(t);
    arr.splice(pos,1);
    //perbarui data todo
    this.setState({todo:arr});

  }
  //function
  halo =() =>{
    alert(this.state.text)
  }


  render(){
  return (
    <View style={styles.container}>
      <View style={styles.innerStyle}>
        <Text style={styles.textStyle} onPress={(this.halo)}>TodoApp</Text>
        <TextInput 
          value={this.state.text}
          onChangeText={(text) => this.setState({text})}
          style={styles.inputStyle}/>
        <Picker
          selectedValue={this.state.done}
          style={styles.inputStyle}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({done: itemValue})}>

          <Picker.Item label="onProgress" value="onProgress" />
          <Picker.Item label="Done" value="Done" />
        </Picker>
        <Button 
          onPress={this.tambahTodo}
          title='Simpan Todo'/>
          <View style={{marginTop:40, alignItems:'center', justifyContent:'center'}}>
            {this.tampilTodos()}
          </View>
      </View>

    </View>
  );}
}
//3.export
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  innerStyle :{
    margin : 40
  },
  textStyle : {
    fontSize:20
  },
  inputStyle : {
    height:40,
    borderColor:'blue',
    borderWidth:1,    
    marginBottom:20
  }
});
