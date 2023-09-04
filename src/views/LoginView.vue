<template>
  <div class="container">
    <h3>Giriş Yap</h3>
    <form @submit.prevent="handleLogin">
      <label>E-Mail Adres</label>
      <TfInputView
        type="email"
        required
        v-model="enteredMail"
        placeholder="Email gir"
      />
      <label>Parola</label>
      <TfPasswordView
        type="password"
        :feedback="false"
        required
        v-model="enteredPassword"
        placeholder="Parola gir"
      />
      <TfButtonView type="submit" label = "Giriş Yap"/>
    </form>
  </div>
</template>
<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const enteredMail = ref(null);
    const enteredPassword = ref(null);
    const auth = getAuth();
    const router = useRouter();
    const error = ref(null);

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

<style></style>
