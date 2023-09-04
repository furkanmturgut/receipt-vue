<template>
  <div>
    <h3>HomeView</h3>
    <p v-if="isUser">Hoşgeldin {{ compInfo.companyName }}</p>
    <div v-for="company in compInfo" :key="company.id">
      <p>{{ company.companyName }}</p>
    </div>
    <TfButtonView>Fiş Ekle</TfButtonView>
    
  </div>
</template>

<script>
import { getDocs, getFirestore, collection, query, where, } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onMounted, ref } from "vue";
export default {
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    const adminId = ref(null);
    const myId = ref(null);
    const isUser = ref(null);
    const compInfo = ref([]);

    onMounted(async () => {
      const querySnapshot = await getDocs(collection(db, "admins"));
      querySnapshot.forEach((doc) => {
        adminId.value = doc.data().id;
        console.log("Home: " + adminId.value);
      });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          myId.value = user.uid;
          if (user.uid === adminId.value) {
            console.log("OK");
            isUser.value = false;
            fetchData();
          } else {
            console.log("Users");
            isUser.value = true
            console.log(isUser.value)
            fetchUserData();
          }

        }
      });

      const fetchData = async () => {
        const q = query(collection(db, 'companyInfo'));
        // Sorguyu kullanarak verileri alın
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, ' => ', doc.data());
          compInfo.value.push(doc.data())
        });
       
      }


      const fetchUserData = async () => {
        const q = query(collection(db, 'companyInfo'), where('id', '==', myId.value));
        // Sorguyu kullanarak verileri alın
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, ' => ', doc.data());
          compInfo.value.push(doc.data())
        });
       
      }

    });


    return { compInfo, isUser };
  },
};
</script>

<style></style>
