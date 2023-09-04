import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { initializeApp } from 'firebase/app';
import PrimeVue from 'primevue/config';
import Password from 'primevue/password';
import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import TabMenu from 'primevue/tabmenu';
import "primevue/resources/themes/lara-light-indigo/theme.css";
const firebaseConfig = {
    apiKey: "AIzaSyB-I2nFAzW2hAijf70StQ_YxD-uXvbbFBo",
    authDomain: "receipt-vue.firebaseapp.com",
    projectId: "receipt-vue",
    storageBucket: "receipt-vue.appspot.com",
    messagingSenderId: "234434814328",
    appId: "1:234434814328:web:88b5c36d3d5f18943fe88d"
  };

  initializeApp(firebaseConfig);

  const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.component('TfButtonView', Button);
app.component('TfPasswordView', Password);
app.component('TfInputView', InputText);
app.component('TfTextAreaView', Textarea);
app.component('TfTabMenuiew', TabMenu);

app.mount('#app');
