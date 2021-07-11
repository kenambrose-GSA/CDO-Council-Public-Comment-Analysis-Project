import firebase from 'firebase';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBtwQeALgK4UwBMZi6wPhAcnKQEc4udnwU",
  authDomain: "usda-cdo.firebaseapp.com",
  projectId: "usda-cdo",
  storageBucket: "usda-cdo.appspot.com",
  messagingSenderId: "703349382708",
  appId: "1:703349382708:web:bfcb1a8edf3ce732cfb461",
  measurementId: "G-51CDNKPMCV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export default firebase