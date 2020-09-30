import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Alert  } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

import { db } from './components/db';
import "firebase/storage";
import axios from "axios";
import { YellowBox } from 'react-native';
import _ from 'lodash';


export default function App() {


  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [fileName, setFileName] = useState("Image");
  const [imagePrev, setImagePrev] = useState(require('./assets/300.png'));
  const [fileCatch, setFileCatch] = useState(null)
  const [awake, setAwake] = useState(false);

  YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


  useEffect(() => {
    const checkPerm = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === 'granted');
    };

    checkPerm();
  }, [setHasPermission]);


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={{justifyContent: 'center', height:500, width:1000, marginTop:300}} >No access to camera</Text>;
  }

  snap = async () => {
    console.log("Got here")
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({quality:.5, base64:false, exif:false, skipProcessing:true});


      fileNameBuffer = await (photo.uri).split('/');
      let response = await fetch(photo.uri);

      await setFileName(fileNameBuffer[fileNameBuffer.length - 1]);

      await setFileCatch(await response.blob());

      await setImagePrev({uri: photo.uri });

      await awakenServerDB().then(function(data){
        console.log(data.data);

        if (data.data === "awake"){
          setAwake(true);
        }

      })

    }
  };

  const fileUploadHandle = () => {
    console.log(db);
    const firebase = db();
    const storage = firebase.storage();

    var file = fileCatch;
    console.log(file);
    var storageRef = storage.ref();

    var imagesRef = storageRef.child("Cells/Neutrophils/" + fileName);

    
    imagesRef.put(file).then(function (snapshot) {
        console.log('Uploaded a blob or file!');
    }).catch(function (err) {
        console.log(err);
    });


}

async function awakenServerDB(){
  console.log("Got to ajax for awaken db");

  return axios.get("https://cell-detection-database.herokuapp.com/api/awaken");

}

async function saveLink(){
  console.log("Got to ajax for create " + fileName);

  return axios.post("https://cell-detection-database.herokuapp.com/api/create/" + fileName);

}




  uploadFile = async () => {
    if (fileCatch === null){
      Alert.alert(
        'Need File in Catch',
        'Take A Picture First',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
    }
    else {
      if (awake === false){
        Alert.alert(
          'Database is not awake yet',
          'please wait or try to take another picture',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      }
      else{
        fileUploadHandle();
        saveLink();
      }
      
    }



  }


  return (
  <>

  
  
    <View style={{ height: 30, backgroundColor: '#cfb1d1',justifyContent: 'center'} } />

    
    <View style={styles.container}>
      <TouchableOpacity onPress={uploadFile}><Text style={[(awake) ? styles.bgtrue : styles.bgfalse]}>{'Upload\n' + fileName}</Text></TouchableOpacity>
      {/* <Button title={'Upload ' + fileName} onPress={uploadFile} style={readyInd} /> */}
      <View style={{marginTop:20, width:250, height: 250, backgroundColor: 'skyblue',justifyContent: 'center'}}>
        <Camera style={{ flex: 1 }} type={type} ratio="1:1" zoom={.5} ref={ref => {this.camera = ref;}}>
          <View style={{marginLeft:125, width:2, height: 124, backgroundColor: 'white',justifyContent: 'center'}}/>
          <View style={{width:250, height: 2, backgroundColor: 'white',justifyContent: 'center'}}/>
          <View style={{marginLeft:125,width:2, height: 124, backgroundColor: 'white',justifyContent: 'center'}}/>
        </Camera>

        

      </View>
      
      <Image
      style={{marginTop:30, width:150, height: 150, resizeMode: "cover"}}
      source={imagePrev}
      />

      <TouchableOpacity
      onPress={snap}
      style={styles.captureBtn} 
      />

    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "#FFFFFF",
    marginTop:30
},
bgfalse: {
  padding:5,
  textAlign: 'center',
  backgroundColor: '#e69393'

},
bgtrue: {
  padding:5,
  textAlign: 'center',
  backgroundColor: '#93e6c1'
}
});
