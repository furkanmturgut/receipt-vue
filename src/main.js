import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import { initializeApp } from "firebase/app";
import PrimeVue from "primevue/config";
import Password from "primevue/password";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import SplitButton from "primevue/splitbutton";
import PanelMenu from "primevue/panelmenu";
import FileUpload from "primevue/fileupload";
import InputMask from "primevue/inputmask";
import Checkbox from "primevue/checkbox";
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import RadioButton from 'primevue/radiobutton';
import "primevue/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const firebaseConfig = {
  apiKey: "AIzaSyB-I2nFAzW2hAijf70StQ_YxD-uXvbbFBo",
  authDomain: "receipt-vue.firebaseapp.com",
  projectId: "receipt-vue",
  storageBucket: "receipt-vue.appspot.com",
  messagingSenderId: "234434814328",
  appId: "1:234434814328:web:88b5c36d3d5f18943fe88d",
};

initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.component("TfButtonView", Button);
app.component("TfPasswordView", Password);
app.component("TfInputView", InputText);
app.component("TfTextAreaView", Textarea);
app.component("TfSplitButtonView", SplitButton);
app.component("TfChechkbox", Checkbox);
app.component("TfPanelMenuView", PanelMenu);
app.component("TfUploadView", FileUpload);
app.component("TfInputMaskView", InputMask);
app.component("TfToggleButtonView",ToggleButton);
app.component("TfCardView",Card);
app.component("TfDataView",DataView);
app.component("TfDataViewLayout",DataViewLayoutOptions);
app.component("TfRadioView",RadioButton);


app.mount("#app");
