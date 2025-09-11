import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
const app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.mount('#app')

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
