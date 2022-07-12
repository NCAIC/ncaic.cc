import { ref } from "vue";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const app = initializeApp({
    apiKey: "AIzaSyB40fadGTlzS4OSf0HD--gxtFWMgT9Q5Tg",
    authDomain: "ncaic-2022.firebaseapp.com",
    projectId: "ncaic-2022",
    storageBucket: "ncaic-2022.appspot.com",
    messagingSenderId: "214029057071",
    appId: "1:214029057071:web:0270bad1b71d63d2305ada",
    measurementId: "G-NKW34L606L",
});

getAnalytics(app);

export const auth = getAuth(app);
export const user = ref<User | null>(null);
onAuthStateChanged(auth, (usr) => {
    console.log("onAuthStateChanged", usr);
    user.value = usr;
});

export const db = getFirestore(app);
