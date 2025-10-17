// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAbXx3DQDhdqjy4A0RicrGXYpGQhwnIGDQ',
  authDomain: 'fit5032-assignment-27178.firebaseapp.com',
  projectId: 'fit5032-assignment-27178',
  storageBucket: 'fit5032-assignment-27178.firebasestorage.app',
  messagingSenderId: '946138055666',
  appId: '1:946138055666:web:66c59e79a10d432f31a16b',
}

// Initialize Firebase
initializeApp(firebaseConfig)
const db = getFirestore()
export default db
