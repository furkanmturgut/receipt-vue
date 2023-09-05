<template>
  <div class="container">
    <h3>Üye Ol</h3>
    <form @submit.prevent="handleRegister">
      <label>E-Mail Adres</label>
      <TfInputView type="email" required v-model="enteredMail" placeholder="E-mail Adresi Giriniz" />

      <label>Parola</label>
      <TfPasswordView type="password" required v-model="enteredPass" placeholder="Parola Belirleyin" />

      <label>Firma Adı</label>
      <TfInputView type="text" required v-model="enteredCompanyName" placeholder="Turkuvaz İnovasyon A.Ş." />

      <label>Firma İletişim (+90)</label>
      <TfInputView type="number" required v-model="enteredCompanyPhone" placeholder="5XX XXX XXXX" />

      <label>Firma Adres</label>
      <TfTextAreaView type="text" required rows="4" v-model="enteredCompanyAddress" placeholder="Adres Giriniz" />
      <TfButtonView type="submit" label="Kayıt Ol" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import { getFirestore, addDoc, collection } from "firebase/firestore";
export default {
  setup() {
    const enteredMail = ref(null);
    const enteredPass = ref(null);
    console.log(enteredPass);
    const enteredCompanyName = ref(null);
    const enteredCompanyAddress = ref(null);
    const enteredCompanyPhone = ref(null);
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();
    const error = ref(null);

    const handleRegister = () => {
      console.log("okoko")
      createUserWithEmailAndPassword(auth, enteredMail.value, enteredPass.value)
        .then(() => {
          // create user is sucessfull
          try {
            const docRef = addDoc(collection(db, "companyInfo"), {
              companyName: enteredCompanyName.value,
              companyAddress: enteredCompanyAddress.value,
              companyPhone: enteredCompanyPhone.value,
              companyMail: enteredMail.value,
              id: auth.currentUser.uid,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            if (e.message) {
              error.value = "Verileri kontrol ediniz";
            }
          }
          // register user's
          // enteredMail.value = "";
          // enteredPass.value = "";
          router.push({ name: "LoginView" });
        })
        .catch((err) => {
          if (err.message) {
            error.value = "Bir hatayla karşılaştı";
          }
        });
    };
    return {
      handleRegister,
      enteredMail,
      enteredPass,
      enteredCompanyAddress,
      enteredCompanyName,
      enteredCompanyPhone,
    };
  },
};
</script>

<style>
.container {
  background-color: #64ccc5;
  min-height: 500px;
}

h3 {
  display: flex;
  justify-content: center;
}

form {
  gap: 5px;
  padding: 0;
  margin: 0;

  display: grid;
  grid-column: 1fr;
  justify-content: center;
}

/* form > input {
  width: 250px;
  justify-content: center;
  outline: none;
  margin: 1.2rem;
  font-size: 1.05rem;
  color: black;
  background-color: transparent;
  border-radius: 5px;
  line-height: 1.2rem;
  margin-bottom: 10px;
} */

form>label {
  display: flex;
  justify-content: center;
}

/* form > textarea {
  width: 250px;
  margin: 1.2rem;
  line-height: 1.2rem;
  margin-bottom: 10px;

  opacity: 0.5;
  font-size: 1.05rem;
  color: black;
  outline: none;
  border: 3px solid black;
  border-radius: 5px;
} */

/* form > button {
  padding: 0.5rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #1d4ed8;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #1e40af;
} */

/* @media (width < 900px) {
    .nav-links {
        display: none;
    }

    header {
        grid-template-columns: repeat(1, 1fr);
    }

    header .image {
        grid-area: 1/1/2/2;
    }

    .features {
        grid-template-columns: repeat(2, 1fr);
    }

    .pricing {
        grid-template-columns: repeat(2, 1fr);
    }

    footer {
        grid-template-columns: 1fr 200px;
    }
}

@media (width < 600px) {
    header .image::before {
        display: none;
    }

    .features {
        grid-template-columns: repeat(1, 1fr);
    }

    .pricing {
        grid-template-columns: repeat(1, 1fr);
    }

    footer {
        grid-template-columns: 1fr 150px;
    }
} */
</style>
