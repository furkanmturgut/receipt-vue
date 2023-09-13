import App from "./App.vue";
import { createApp } from "vue";
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
import RadioButton from 'primevue/radiobutton';
import AutoComplete from 'primevue/autocomplete';
import Dropdown from 'primevue/dropdown';
import "primevue/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import InlineMessage from 'primevue/inlinemessage';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Camera from "simple-vue-camera";

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
app.use(ToastService);
app.use(ConfirmationService);

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
app.component("TfRadioView",RadioButton);
app.component("TfAutoComplete",AutoComplete);
app.component("TfInlineMessage",InlineMessage);
app.component("TfInputNumber",InputNumber);
app.component("TfDropdownView",Dropdown);
app.component("TfSpinner",ProgressSpinner);
app.component("TfToast",Toast);
app.component("TfConfirmDialog",ConfirmDialog);
app.component("CameraDiv",Camera);

app.mount("#app");
