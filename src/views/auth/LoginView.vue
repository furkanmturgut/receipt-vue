<template>
  <div class="container">
    <h3 style="display: flex; justify-content: center">Giriş Yap</h3>
    <form @submit.prevent="handleLogin">
      <label>E-Mail Adres</label>
      <TfInputView
        required
        type="email"
        class="emailInput"
        v-model="enteredMail"
        placeholder="Email gir"
      />
      <label>Parola</label>
      <TfPasswordView
        required
        :feedback="false"
        type="password"
        class="passwordDiv"
        v-model="enteredPassword"
        placeholder="Parola gir"
      />
      <TfButtonView type="submit" label="Giriş Yap" />
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
    const router = useRouter();
    const enteredMail = ref(null);
    const enteredPassword = ref(null);

    const handleLogin = async () => {
      signInWithEmailAndPassword(auth, enteredMail.value, enteredPassword.value)
        .then(() => {
          enteredMail.value = "";
          enteredPassword.value = "";
          // console.log('OK')
          router.push({ name: "HomeView" });
        })
        .catch((err) => {
          if (err.message) {
            error.value = "Kullanıcı adı veya parola hatalı!";
          }
        });
    };
    return { enteredMail, enteredPassword, handleLogin };
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

form > label {
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
.p-password > input {
  min-width: 300px;
}
</style>
