<template>
  <div class="container">
    <h3 style="display: flex; justify-content: center">Üye Ol</h3>
    <form @submit.prevent="handleRegister">
      <label>E-Mail Adres</label>
      <TfInputView v-model="enteredMail" placeholder="E-mail Adresi Giriniz" @focus="clearInput" />

      <label>Parola</label>
      <TfPasswordView type="password" v-model="enteredPass" placeholder="Parola Belirleyin" toggleMask @focus="clearInput" />

      <label>Firma Adı</label>
      <TfInputView type="text" v-model="enteredCompanyName" placeholder="Turkuvaz İnovasyon A.Ş." @focus="clearInput" />

      <label>Firma İletişim (+90)</label>
      <TfInputMaskView v-model="enteredCompanyPhone" date="phone" mask="(999) 999-9999" placeholder="5XX XXX XXXX"
        @focus="clearInput" />

      <label>Firma Adres</label>
      <TfTextAreaView rows="4" type="text" v-model="enteredCompanyAddress" placeholder="Adres Giriniz"
        @focus="clearInput" />
      <TfButtonView type="submit" label="Kayıt Ol" />

      <TfInlineMessage v-if="e">{{ error }}</TfInlineMessage>

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
    const e = ref(false)
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const clearInput = () => {
      e.value = false
    }

    const handleRegister = () => {
      if (emailRegex.test(enteredMail.value)) {
        if (enteredPass.value.length >= 6) {
          if (enteredCompanyName.value.length >= 4) {
            if (enteredCompanyPhone.value.length >= 10) {
              if (enteredCompanyAddress.value.length >= 20) {
                createUserWithEmailAndPassword(auth, enteredMail.value, enteredPass.value)
                  .then(() => {
                    try {
                      addDoc(collection(db, "companyInfo"), {
                        id: auth.currentUser.uid,
                        companyMail: enteredMail.value,
                        companyName: enteredCompanyName.value,
                        companyPhone: enteredCompanyPhone.value,
                        companyAddress: enteredCompanyAddress.value,
                      });
                    } catch (err) {
                      if (err.message) {
                        e.value = true
                        error.value = "Verileri kontrol ediniz";
                      }
                    }
                    router.push({ name: "LoginView" });
                  })
                  .catch((err) => {
                    if (err.message) {
                      e.value = true
                      const member = "Firebase: Error (auth/email-already-in-use).";
                     if(member != null){
                      error.value = "Bu email sisteme zaten kayıtlı";
                      console.log(err.message)
                     }else {
                      error.value = "Lütfen tüm alanları doldurunuz"
                     }
                    }
                  });

              } else {
                e.value = true;
                error.value = "Adresi açıklayıcı tanımlak için en az 20 karakter giriniz"
              }
            } else {
              e.value = true;
              error.value = "Geçerli bir telefon numarası giriniz"
            }
          } else {
            e.value = true;
            error.value = "Şirket adını en az 5 karakter olacak şekikde giriniz"
          }
        } else {
          e.value = true;
          error.value = "En az 6 karakter parola belirleyin"
        }
      } else {
        e.value = true;
        error.value = "Email adresi geçersiz"
      }
    };
    return {
      handleRegister,
      //
      enteredMail,
      enteredPass,
      enteredCompanyAddress,
      enteredCompanyName,
      enteredCompanyPhone,
      e,
      error,
      clearInput
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
form>* {
  display: flex;
  justify-content: center;
}
</style>
