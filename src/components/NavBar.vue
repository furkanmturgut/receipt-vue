<template>
  <div class="navbar">
    <nav>
      <button @click="handleLogout" class="button" v-if="user">Çıkış</button>

      <div class="sign" v-else-if="!user">

        <router-link :to="{ name: 'RegisterView' }" class="links"
          >Üye Ol</router-link
        >

        <router-link :to="{ name: 'LoginView' }" class="links"
          >Giriş Yap</router-link
        >
      </div>
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
    return { handleLogout, user };
  },
};
</script>

<style scoped>
.navbar {
  padding: 16px 10px;
  background: #a1f3ee;
}

/* nav,
.sign {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

nav .links,
nav a {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  margin: 1.5rem;
  letter-spacing: 2px;
  border-radius: 15px;
  line-height: 1.2rem;
  text-decoration: dashed;

  padding: 10px;
  color: #053b50;
  font-size: 1.4rem;
  font-weight: 600;
  transition: all 0.3s ease;

  outline: 2px solid #053b50;
}
nav .links:hover {
  color: #eeeeee;
  background-color: #053b50;
} */

.button {
  display: flex;
  justify-content: center;
  outline: none;
  margin: 1.5rem;
  color: #053b50;
  background-color: transparent;
  letter-spacing: 2px;
  border-radius: 15px;
  text-align: center;
  line-height: 1.2rem;
  font-size: 1.4rem;
  margin-bottom: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}
.button:hover {
  color: #ffffff;
}
</style>
