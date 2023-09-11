<template>
  <div class="container">
    <h3 style="display: flex; justify-content: center">Giriş Yap</h3>
    <form @submit.prevent="handleLogin">
      <label>E-Mail Adres</label>
      <TfInputView required v-model="enteredMail" placeholder="Email gir" @focus="clearError" />

      <label>Parola</label>
      <TfPasswordView required :feedback="false" type="password" class="passwordDiv" @focus="clearError" v-model="enteredPassword"
        placeholder="Parola gir" toggleMask />

      <TfButtonView type="submit" label="Giriş Yap" />
      <TfInlineMessage v-if="e">{{ error }}</TfInlineMessage>

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
    const enteredPassword = ref(null);
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const clearError = () => {

      e.value = false
    }


    const handleLogin = async () => {
      if (emailRegex.test(enteredMail.value)) {
        e.value = false
        signInWithEmailAndPassword(auth, enteredMail.value, enteredPassword.value)
          .then(() => {
            enteredMail.value = "";
            enteredPassword.value = "";
            e.value = false;
            router.push({ name: "HomeView" });
          })
          .catch((err) => {
            if (err.message) {
              e.value = true;
              const passError = "Firebase: Error (auth/wrong-password).";
              if (passError == err.message) {
                error.value = "Parola hatalı";
              } else
                error.value = "Kullanıcı bulunamadı";
            }
          });
      } else {
        e.value = true;
        error.value = "Geçerli bir email adresi girin."
      }






    };
    return { enteredMail, enteredPassword, handleLogin, e, clearError, error };
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

form>label {
  display: flex;
  justify-content: center;
}

.container {
  background-color: #64ccc5;
  min-height: 500px;
}

h3 {
  display: flex;
  justify-content: center;
}

.p-password {
  display: flex;
  justify-content: center;
}

.p-password>input {
  min-width: 300px;
}
</style>
