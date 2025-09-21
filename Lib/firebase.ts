import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD63ghthHRxYwTvnhuoJbyoNmtx1B5iSVs",
  authDomain: "nutritakes-ccd71.firebaseapp.com",
  projectId: "nutritakes-ccd71",
  appId: "1:52216623493:web:2b16051c570dc09a0714ec",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);


let auth: Auth | undefined;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  
  auth = undefined;
}

export { app, auth };

