import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD63ghthHRxYwTvnhuoJbyoNmtx1B5iSVs",
  authDomain: "nutritakes-ccd71.firebaseapp.com",
  projectId: "nutritakes-ccd71",
  storageBucket: "nutritakes-ccd71.appspot.com", 
  messagingSenderId: "52216623493",
  appId: "1:52216623493:web:2b16051c570dc09a0714ec",
  measurementId: "G-RLL1D12DJ7",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


const db = getFirestore(app);


const storage = getStorage(app);

export { app, auth, db, storage };

