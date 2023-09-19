<template>
  <div class="container" style="background-color: #63ccc5;">
    <form @submit.prevent="handleLogin">
      <h3>Giriş Yap</h3>
      <label>E-Mail Adres</label>
      <span class="p-input-icon-right">
        <i class="pi pi-at"></i>
        <TfInputView v-model="enteredMail" placeholder="Email gir" @focus="clearError" @input="formValidations()" />
      </span>
      <label>Parola</label>
      <TfPasswordView :feedback="false" type="password" class="passwordDiv" @focus="clearError" v-model="enteredPassword"
        placeholder="Parola gir" toggleMask />

        <router-link :to="{name:'ResetPassword'}">Parolamı unuttum?</router-link>

      <TfButtonView style="margin-bottom: 20px;" type="submit" label="Giriş Yap" />
      <div>
      <TfInlineMessage severity="info" v-if="e">{{ error }}</TfInlineMessage>
    </div>
    </form>
 
  </div>
</template>
<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const auth = getAuth();
    const error = ref(null);
    const e = ref(false)
    const router = useRouter();
    const enteredMail = ref(null);
    const enteredPassword = ref('');
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const clearError = () => {
      e.value = false
    }

    const formValidations = () => {
      if (emailRegex.test(enteredMail.value)) {
        e.value = false
          if(enteredPassword.value.length > 7){
              handleLogin()
          }

      } else {
        e.value = true;
        error.value = "Geçerli bir email adresi girin."
      }
    }

    const handleLogin = async () => {
      signInWithEmailAndPassword(auth, enteredMail.value, enteredPassword.value)
        .then(() => {
          enteredMail.value = "";
          enteredPassword.value = "";
          router.push({ name: "HomeView" });
        }).catch((err) => {
          if (err.message) {
            e.value = true;
            error.value = "Email veya parola hatalı"
            const passError = "Firebase: Error (auth/wrong-password).";
            if (passError == err.message) {
              error.value = "Parola hatalı";
            } 
          }
        });

    };
    return { enteredMail, enteredPassword, handleLogin, e, clearError, error, formValidations };
  },
};
</script>

<style scoped>
a{
  text-decoration: none;
  display: flex;
  justify-content: right;
  color: #000;
  margin-top:5px ;
  margin-bottom: 5px;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 10px;
  flex-wrap: wrap;
  min-height: inherit;
}

form>label {
  display: flex;
  justify-content: center;
}

.container {
  background-color: #64ccc5;
  min-height: 70vh;
}

h3 {
  display: flex;
  justify-content: center;
}

</style>
