<template>
  <div class="navbar">
    <nav>
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
  background: #a1f3ee;
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
</style>
