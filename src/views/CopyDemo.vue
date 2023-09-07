<template>
  <div>
    <h3 style="display: flex; justify-content: center">HomeView</h3>
    <div class="container" id="homeViewContainer">
      <p>Hoş geldin</p>
      <TfSplitButtonView
        v-if="!isSearchMode"
        label="Fiş Ekle"
        icon="pi pi-plus"
        :model="splitMenu"
        @click="addReceipt"
      />

      <div v-else>
        <TfButtonView
          label="Geri"
          icon="pi pi-arrow-left"
          @click="cancelSearch"
          style="min-width: 100px"
        />
        <!-- <TfInputView v-model="searchText" placeholder="ID girin" @keydown.enter="searchReceipt" /> -->
        <TfAutoComplete
          v-model="selectedCompany"
          dropdown
          :suggestions="newArrayList"
          @complete="autoCompSearch"
        />
      </div>
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
  orderBy,
  collection,
  getFirestore,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import { onMounted, ref as vueRef } from "vue";
import ListComponent from "@/components/ListComponent.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  components: {
    ListComponent,
  },
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    const myId = vueRef(null);
    const isUser = vueRef(null);
    const adminId = vueRef(null);
    const slipsList = vueRef([]);
    const splitMenu = vueRef([]);
    const isSearchMode = vueRef(false);
    const searchText = vueRef("");
    const selectedCompany = vueRef([]);
    const newArrayList = vueRef([]);

    const sortByTime = async (type) => {
      const q = query(collection(db, "infos"), orderBy("uploadDate", type));
      /// listeyi boşalttık
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(() => {
          slipsList.value = [];
        });
      });
      // listeyi doldur
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
      });
    };

    const paymentFilter = async (type) => {
      const q = query(
        collection(db, "infos"),
        where("paymentMethod", "==", type)
      );
      /// listeyi boşalttık
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(() => {
          slipsList.value = [];
        });
      });
      // listeyi doldur
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
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
            fetchData();
          } else {
            console.log("Kullanıcı Girişi");
            isUser.value = true;
            console.log("isUser: ", typeof isUser.value, isUser.value);
            fetchUserData();
          }
        }
      });

      splitMenu.value = [
        {
          label: "Azalan Sırala",
          icon: "pi pi-sort-numeric-up-alt",
          command: () => {
            console.log("Sıralandı");
            sortByTime("desc");
          },
        },
        {
          label: "Artan Sırala",
          icon: "pi pi-sort-numeric-down-alt",
          command: () => {
            sortByTime("asc");
          },
        },
        {
          label: `Kartla ödemeleri filtrele`,
          icon: "pi pi-credit-card",
          command: () => {
            paymentFilter("kart");
          },
        },
        {
          label: `Nakitle ödemeleri filtrele`,
          icon: "pi pi-money-bill",
          command: () => {
            paymentFilter("nakit");
          },
        },
        {
          label: `Kullanıcıya göre filtrele /admin`,
          icon: "pi pi-cog",
          command: () => {
            isSearchMode.value = true;
          },
          visible: () => !isUser.value,
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

    const cancelSearch = () => {
      isSearchMode.value = false;
      searchText.value = "";
    };

    const autoCompSearch = async (currentType) => {
      
      console.log("newarraylist", newArrayList);
      let _company = [...Array(10).keys()];
      newArrayList.value = currentType.query
        ? [...Array(10).keys()].map((item) => currentType + item)
        : _company;
    };

    const searchReceipt = async () => {
      const q1 = query(collection(db, "companyInfo"));
      const querySnapshot1 = await getDocs(q1);
      querySnapshot1.forEach((doc) => {
        newArrayList.value.push(doc.data());
      });

      const handleName = searchText.value;

      const dataFilter = newArrayList.value.filter((data) => {
        return data.companyName.toLowerCase().startsWith(handleName.toLowerCase());
      });
      console.log(dataFilter);

      // console.log("Arama yapılıyor:", searchText.value);
      // const handleName = searchText.value;
      // const newData = vueRef([]);
      // const q = query(collection(db,"companyInfo"), where("companyName", "in", [handleName]));

      // const querySnapshot = await getDocs(q);
      //   querySnapshot.forEach((doc) => {
      //     newData.value.push(doc.data());
      //     console.log(doc.data());
      //   });
    };

    return {
      handleClick,
      addReceipt,
      searchReceipt,
      cancelSearch,
      autoCompSearch,
      slipsList,
      splitMenu,
      searchText,
      newArrayList,
      selectedCompany,
      isSearchMode,
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
