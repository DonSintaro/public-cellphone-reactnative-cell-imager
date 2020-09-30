import firebase from 'firebase/app';
import 'firebase/storage';

export function db() {
  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
    if (!firebase.apps.length){
      console.log("initializing app");
      firebase.initializeApp(firebaseConfig);
    }
  
  return firebase;
}