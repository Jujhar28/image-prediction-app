import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

export default class App extends React.Component{

  constructor() {
    super()
      state={
        image: null
      }    
  }

  componentDidMount(){
    this.getPermissions()
  }
  getPermissions=async()=>{
      if(Platform.OS!=="web"){
          const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
          if(status!=="granted"){
            alert("Camera permission is required to do image prediction")
          }
      }
  }

  _pickImage=async()=>{
    try{
      var result=await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEdting: true,
          aspect: [4,3],
          quality: 1
      })
      if(!result.cancelled) {
        this.setState({Image:result.data})
        this.uploadImage(result.uri)
      }
    }
    catch (e){
      console.log(e);
    }
  }

    uploadImage= async(uri)=> {
      const data = new FormData()
      var fileName=uri.split("/")[uri.split("/").length - 1]
      var type = `image/${uri.split('.')[uri.split('.').length - 1]}`
      const fileToUpload={
        uri:uri,
        name: fileName,
        type:type
      }
      data.append("digit",fileToUpload)

      fetch("https://5627dc783c62.ngrok.io/predict_digit", {
        method:"POST",
        body:data,
        headers: {
          "content-type" :"multipart/form-data"
        }
      }).then( (response)=> response.json())
      .then((result)=>{
        console.log("Success:", result)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }

  render(){
    var {image} = this.state;

  return (
    <View style={styles.container}>
      <Button
      title="Upload Image"
      onPress= {this._pickImage}
      />
        
     
    </View>
  )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
