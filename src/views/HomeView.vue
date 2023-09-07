<template>
  <div>
    <!--COMPINFO CALISMIYOR, COMPANY.COMPANYNAME ÇALIŞIYOR-->
    <h3 style="display: flex; justify-content: center">HomeView</h3>
    <div class="container" id="homeViewContainer">
      <p>Hoş geldin</p>
      <TfSplitButtonView @click="addReceipt" :model="splitMenu" label="Fiş Ekle" icon="pi pi-plus" />
      <list-component :slipsList="slipsList" @itemClick="handleClick"></list-component>
    </div>
  </div>
</template>

<script>
import {
  getDocs,
  getFirestore,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onMounted, ref as vueRef } from "vue";
import { useRouter } from "vue-router";
import ListComponent from "@/components/ListComponent.vue";
export default {
  components: {
    ListComponent,
  },
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    const router = useRouter();
    const isUser = vueRef(false);
    const myId = vueRef(null);
    const adminId = vueRef(null);
    const slipsList = vueRef([]);
    const splitMenu = [
      {
        label: "Sırala",
        icon: "pi pi-sort-numeric-down-alt", //pi-sort-amount-down
        command: () => {
          console.log("Sıralandı");
        },
      },
      {
        label: `Ödeme Şekline Göre Filtrele`,
        icon: "pi pi-credit-card",
        command: () => {
          console.log("Nakit" || "Kart");
        },
      },
      {
        label: `Kullanıcıya göre filtrele /admin`,
        command: () => {
          console.log("Filtrelendi");
        },
      },
    ];

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
            isUser.value = true;
            console.log(isUser.value);
            fetchUserData();
          }
        }
      });

      const fetchData = async () => {
        const q = query(collection(db, "infos"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
      };

      const fetchUserData = async () => {
        const q = query(collection(db, "infos"), where("id", "==", myId.value));
        // Sorguyu kullanarak verileri alın
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
      };
    });

    const addReceipt = () => {
      router.push({ name: "AddReceiptView" });
    };

    const handleClick = (myId) => {
      // const list = ref([]);
      // const a = slipsList.value.find((newVal) => {
      //    bu kod router için         query: { list: JSON.stringify(list.value) },
      //   return newVal.slipsId === myId;
      // });
      // console.log("A", a);
      // list.value.unshift(a.value);
      router.push({
        name: "ReceiptDetailView",
        params: { id: myId },
      });
      // console.log("Emit", myId);
    };

    return {
      slipsList,
      isUser,
      addReceipt,
      splitMenu,
      handleClick,
      
    };
  },
};
</script>

<style>
#homeViewContainer {
  background-color: #64ccc5;
  display: flex;
  gap: 15px;
  width: auto;
  min-height: 400px;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: column;
}

h3 {
  display: flex;
  justify-content: center;
}


</style>
