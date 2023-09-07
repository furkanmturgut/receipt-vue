<template>
  <div>
    <h3 style="display: flex; justify-content: center">HomeView</h3>
    <div class="container" id="homeViewContainer">
      <p>Hoş geldin</p>
      <TfSplitButtonView label="Fiş Ekle" icon="pi pi-plus" :model="splitMenu" @click="addReceipt" />
      <list-component :slipsList="slipsList" @itemClick="handleClick">
        <!-- Slipslist ismi değişebilir-->
      </list-component>
    </div>
  </div>
</template>

<script>
import {
  where,
  query,
  getDocs,
  collection,
  getFirestore,
  orderBy,
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
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    const myId = vueRef(null);
    const isUser = vueRef(true);
    const adminId = vueRef(null);
    const slipsList = vueRef([]);
    const splitMenu = vueRef([]);
    //SplitMenu aşağıda tanımlı

    const sorts = async (type) => {
      const q = query(
        collection(db, "infos"),
        orderBy("uploadDate", type),
      );
      /// listeyi boşalttık 
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(() => {
          slipsList.value = [];
        })
      });
      // listeyi doldur
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        })
      });
    };

    onMounted(async () => {
      const querySnapshot = await getDocs(collection(db, "admins"));

      querySnapshot.forEach((doc) => {
        adminId.value = doc.data().id;
        // console.log("Admin id:" + adminId.value);
      });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          myId.value = user.uid;
          if (user.uid === adminId.value) {
            console.log("Admin Girişi");
            isUser.value = false;
            console.log('isUser: ', typeof isUser.value, isUser.value);
            fetchData();
          } else {
            console.log("Kullanıcı Girişi");
            isUser.value = true;
            console.log('isUser: ', typeof isUser.value, isUser.value);
            fetchUserData();
          }
        }
      });

      splitMenu.value = [
        {
          label: "Sırala",
          icon: "pi pi-sort-numeric-down-alt", //pi-sort-amount-down
          command: () => {
            console.log("Sıralandı");
            sorts('asc' || 'desc');
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
          icon: "pi pi-cog",
          command: () => {
            console.log("Filtrelendi");
          },
          visible: (isUser.value == true),
        },
      ];

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
      router.push({
        name: "ReceiptDetailView",
        params: { id: myId },
      });
    };

    return {
      handleClick,
      addReceipt,
      slipsList,
      splitMenu,
      isUser,
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
