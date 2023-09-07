<template>
  <div class="container">
    <h3 style="display: flex; justify-content: center">Üye Ol</h3>
    <form @submit.prevent="handleRegister">
      <label>E-Mail Adres</label>
      <TfInputView
        required
        type="email"
        v-model="enteredMail"
        placeholder="E-mail Adresi Giriniz"
      />

      <label>Parola</label>
      <TfPasswordView
        required
        type="password"
        v-model="enteredPass"
        placeholder="Parola Belirleyin"
      />

      <label>Firma Adı</label>
      <TfInputView
        required
        type="text"
        v-model="enteredCompanyName"
        placeholder="Turkuvaz İnovasyon A.Ş."
      />

      <label>Firma İletişim (+90)</label>
      <TfInputView
        required
        type="number"
        v-model="enteredCompanyPhone"
        placeholder="5XX XXX XXXX"
      />

      <label>Firma Adres</label>
      <TfTextAreaView
        required
        rows="4"
        type="text"
        v-model="enteredCompanyAddress"
        placeholder="Adres Giriniz"
      />
      <TfButtonView type="submit" label="Kayıt Ol" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    const enteredMail = ref(null);
    const enteredPass = ref(null);
    const enteredCompanyName = ref(null);
    const enteredCompanyAddress = ref(null);
    const enteredCompanyPhone = ref(null);
    const error = ref(null);

    const handleRegister = () => {
      console.log("Kayıt başarılı");
      createUserWithEmailAndPassword(auth, enteredMail.value, enteredPass.value)
        .then(() => {
          try {
            const docRef = addDoc(collection(db, "companyInfo"), {
              id: auth.currentUser.uid,
              companyName: enteredCompanyName.value,
              companyMail: enteredMail.value,
              companyPhone: enteredCompanyPhone.value,
              companyAddress: enteredCompanyAddress.value,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            if (e.message) {
              error.value = "Verileri kontrol ediniz";
            }
          }
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
      //
      enteredMail,
      enteredPass,
      enteredCompanyAddress,
      enteredCompanyName,
      enteredCompanyPhone,
    };
  },
};
</script>

<style scoped>
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

form > label {
  display: flex;
  justify-content: center;
}

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
