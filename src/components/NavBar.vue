<template>
  <div class="container">
    <div class="navbar">
    <nav>
      <img
        src="@/assets/maviLogo.jpeg"
        @click="homeTo('/')"
        alt="Turkuvaz Logo"
        class="logo"
      />
      <TfButtonView
        v-if="user"
        label="Çıkış"
        class="button"
        @click="handleLogout"
      />
      <div class="noUser" v-else>
        <TfButtonView
          label="Üye ol"
          @click="homeTo('register')"
        />
        <TfButtonView
          label="Giriş yap"
          @click="homeTo('login')"
        />
      </div>
    </nav>
  </div>
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


nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 16px 10px;
  background: linear-gradient(to bottom, #a1f3ee, #61bdf3);
}
nav > .noUser {
  gap: 15px;
  display: flex;
  justify-content: center;
}
.logo {
  max-width: 160px;
  height: auto;
  margin-right: 20px;
  margin-left: 20px;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
