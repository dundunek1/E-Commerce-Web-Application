import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: '<YOUR_API_KEY>',
  authDomain: '<YOUR_AUTH_DOMAIN>',
  databaseURL: '<YOUR_DATABASE_URL>',
  projectId: '<YOUR_PROJECT_ID>',
  storageBucket: '<YOUR_STORAGE_BUCKET>',
  messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
  appId: '<YOUR_APP_ID>',
  measurementId: '<YOUR_MEASUREMENT_ID>',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
let userId
export const auth = getAuth(app)
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid
    console.log('User ID:', userId)
  } else {
    console.log('User is not signed in.')
  }
})
export { db, doc, getDoc, addDoc, collection, query, where, getDocs, setDoc }
