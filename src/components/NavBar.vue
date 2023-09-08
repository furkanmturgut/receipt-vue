<template>
  <div class="navbar">
    <nav>
      <img src="@/assets/maviLogo.jpeg" @click="homeTo('/')" alt="Turkuvaz Logo" class="logo" />
      <TfButtonView @click="handleLogout" class="button" v-if="user" label="Çıkış" />
      <TfButtonView v-else-if="!user" @click="homeTo('register')" label="Üye ol" />
      <TfButtonView v-if="!user" @click="homeTo('login')" label="Giriş yap" />
    </nav>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

export default {
  setup() {
    const user = ref(null);
    const auth = getAuth();
    const router = useRouter();

    onAuthStateChanged(auth, (u) => {
      if (u) user.value = u.uid;
    });

    const handleLogout = () => {
      signOut(auth)
        .then(() => {
          console.log("Log out!");
          user.value = null;
          router.push({ name: "LoginView" });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    function homeTo(event) {
      router.push(`${event}`);
    }
    return { handleLogout, user, homeTo };
  },
};
</script>

<style scoped>
.navbar {
  padding: 16px 10px;
  background: linear-gradient(to bottom, #a1f3ee, #61bdf3);
}
button.p-button.p-component.p-splitbutton-defaultbutton 
{
  padding: 7px 60px;
}
nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
}
.logo {
  width: 160px; /* Genişlik ayarını değiştirebilirsiniz */
  height: auto; /* Yükseklik otomatik olarak ayarlanır */
  margin-right: 20px; /* Logo ile butonlar arasına bir boşluk ekler */
  cursor: pointer;
}

</style>
