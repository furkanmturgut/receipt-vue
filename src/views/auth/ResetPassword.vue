<template>
    <div class="container">
        <h3 style="display: flex; justify-content: center">Parolayı Sıfırla</h3>
        <form @submit.prevent="resetHandle">
            <span class="p-input-icon-right">
                <i class="pi pi-at"></i>
                <TfInputView placeholder="Email gir" id="emailInput" v-model="enteredMail" @focus="clearInput" />
            </span>
            <TfButtonView type="submit" label="Parolayı Sıfırla" />
        </form>
        <div class="inlineMsg" style="display: flex; justify-content: center; padding: 10px;">
            <TfInlineMessage severity="info">{{ errorState ? errorMessage : 'Lütfen sisteme kayıt olduğunuz email hesabını giriniz.' }}</TfInlineMessage>

        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth'

export default {
    setup() {
        //Firebase
        const auth = getAuth();
        // FirebaseError: Firebase: Error (auth/too-many-requests).
        //FirebaseError: Firebase: Error(auth/user-not-found). 
        //Input 
        const errorMessage = ref(null);
        const errorState = ref(false);
        const enteredMail = ref(null);
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        const resetHandle = () => {
            if (emailRegex.test(enteredMail.value)) {
                errorState.value = false
                sendPasswordResetEmail(auth, enteredMail.value).then(() => {
                    errorState.value = true
                    errorMessage.value = "Sıfırlama maili gönderildi.";
                    

                }).catch((error)=> {
                    if(error.message == 'Firebase: Error (auth/too-many-requests).'){
                        errorState.value = true
                        errorMessage.value = "Üst üste sıfırlama talebi aldık. Hesabınız kilitlendi"
                    }else if(error.message == 'Firebase: Error (auth/user-not-found).'){
                        errorState.value = true
                        errorMessage.value = "Böyle bir kullanıcı bulunamadı!"
                    }else {
                        errorState.value = true
                        errorMessage.value = error.message
                    }
                })
            } else {
                console.log("Error reset")
                errorState.value = true;
                errorMessage.value = "Lütfen geçerli olan bir mail adresi giriniz."
            }
        }

        const clearInput = () => {
            errorState.value = false
        }

        return { enteredMail, resetHandle, errorMessage, errorState, clearInput }
    }
}
</script>

<style scoped>
.container {
    background-color: #64ccc5;
    min-height: 500px;
}

form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.inlineMsg {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
</style>