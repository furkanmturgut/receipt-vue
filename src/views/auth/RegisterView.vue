<template>
  <div class="flex justify-content-center" style="background-color:#63ccc5">
    <form @submit.prevent="handleRegister">
      <h3>Üye Ol</h3>

      <label>E-Mail Adres</label>
      <TfInputView v-model="enteredMail" placeholder="E-mail Adresi Giriniz" @focus="clearInput"
        @input="formValidation(0)" />
      <TfInlineMessage class="inlineMsg" v-if="e.email">{{ error.email }}</TfInlineMessage>

      <label>Parola</label>
      <TfPasswordView :feedback="false" class="inputPassword" v-model="enteredPass" placeholder="Parola Belirleyin"
        toggleMask @focus="clearInput" @input="formValidation(1)" />
      <TfInlineMessage class="inlineMsg" v-if="e.password">{{ error.password }}</TfInlineMessage>

      <label>Firma Adı</label>
      <TfInputView type="text" v-model="enteredCompanyName" placeholder="Turkuvaz İnovasyon A.Ş." @focus="clearInput"
        @input="formValidation(2)" />
      <TfInlineMessage class="inlineMsg" v-if="e.name">{{ error.name }}</TfInlineMessage>

      <label>Firma İletişim (+90)</label>
      <TfInputMaskView v-model="enteredCompanyPhone" date="phone" mask="(999) 999-9999" placeholder="5XX XXX XXXX"
        @focus="clearInput" :filled="formValidation(3)" />
      <TfInlineMessage class="inlineMsg" v-if="e.phone">{{ error.phone }}</TfInlineMessage>

      <label>Firma Adres</label>
      <TfTextAreaView rows="4" type="text" v-model="enteredCompanyAddress" placeholder="Adres Giriniz" @focus="clearInput"
        @input="formValidation(4)" />
      <TfInlineMessage class="inlineMsg" v-if="e.address">{{ error.address }}</TfInlineMessage>

      <TfButtonView type="submit" style="margin-top: 30px; margin-bottom: 30px;" label="Kayıt Ol" />
      <TfToast />

    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useToast } from 'primevue/usetoast';

export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    const enteredMail = ref(null);
    const enteredPass = ref(null);
    const enteredCompanyName = ref(null);
    const enteredCompanyAddress = ref(null);
    const enteredCompanyPhone = ref('');
    const error = ref({ email: null, password: null, name: null, phone: null, address: null, area: null });
    const e = ref({ email: false, password: false, name: false, phone: false, address: false, area: false });
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const phoneRegex = /\(\d\d\d\)\s\d\d\d-\d\d\d\d/i;
    const passRegex = /^(?!\s)(.{6,})(?<!\s)$/;
    const companyRegex = /^(?!\s)(.{3,})(?<!\s)$/;
    const addressRegex = /^(?!\s)(.{20,})(?<!\s)$/;

    const toast = useToast();

    const clearInput = (field) => {
      e.value[field] = false;
      error.value[field] = null;
    };

    const handleRegister = () => {

      if (emailRegex.test(enteredMail.value) && passRegex.test(enteredPass.value) && companyRegex.test(enteredCompanyName.value) && phoneRegex.test(enteredCompanyPhone.value) && addressRegex.test(enteredCompanyAddress.value)) {
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
                e.value.email = true;
                error.value.email = "Verileri kontrol ediniz";
              }
            }
            router.push({ name: "HomeView" });
          })
          .catch((err) => {
            if (err.message) {
              e.value.email = true;
              const member = "Firebase: Error (auth/email-already-in-use).";
              if (member == null) {
                error.value.email = "Bu email sisteme zaten kayıtlı";
                console.log(err.message);
              } else {
                error.value.email = "Lütfen tüm alanları doldurunuz";
              }
            }
          });
      } else {
        e.value.area = true;
        error.value.area = "Tüm alanları doldurun"
        clickToast(error.value.area)
      }
    };

    const clickToast = (msg) => {
      toast.add({ severity: 'warning', summary: 'Uyarı', detail: msg, life: 3000 });
    }

    const formValidation = (type) => {

      switch (type) {
        case 0:
          if (emailRegex.test(enteredMail.value)) {
            e.value.email = false;
          } else {
            error.value.email = "Geçerli eposta girin";
            e.value.email = true
          }
          break;
        case 1:
          if (!enteredPass.value == '' && passRegex.test(enteredPass.value)) {
            e.value.password = false
          } else {
            e.value.password = true
            error.value.password = "En az 6 karakter ve boşluk içermeyecek şekilde parola belirleyin";
          }
          break
        case 2:
          if (!enteredCompanyName.value == '' && companyRegex.test(enteredCompanyName.value)) {
            e.value.name = false
          } else {
            e.value.name = true
            error.value.name = "En az 3 karakter olacak şekilde firma adı giriniz";

          }
          break;
        case 3:
          if (enteredCompanyPhone.value == '' || phoneRegex.test(enteredCompanyPhone.value)) {
            e.value.phone = false;
          } else {
            error.value.phone = "İletişim numarasını eksiksiz doldurun";
            e.value.phone = true
          }
          break;
        case 4:
          if (!enteredCompanyAddress.value == '' && addressRegex.test(enteredCompanyAddress.value)) {
            e.value.address = false
          } else {
            error.value.address = "Açıklayıcı olması için en az 20 karakter ile adresi belirtin";
            e.value.address = true
          }
          break;
      }

    }

    return {
      handleRegister,
      clearInput,
      formValidation,
      clickToast,
      //
      enteredMail,
      enteredPass,
      enteredCompanyAddress,
      enteredCompanyName,
      enteredCompanyPhone,
      e,
      error,
    };
  },
};
</script>

<style scoped>



h3 {
  display: flex;
  justify-content: center;
  
}

form {
  gap: 5px;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

form>* {
  min-width: 230px;
}


.inlineMsg {
  max-width: 230px;
  text-align: center;
}
</style>
