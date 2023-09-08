<template>
  <div>
    <h3 style="display: flex; justify-content: center">HomeView</h3>
    <div class="container" id="homeViewContainer">
      <p>Hoş geldiniz</p>
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
          v-model="searchText"
          style="min-width: 100px"
        />
        <!-- <TfInputView v-model="searchText" placeholder="ID girin" @keydown.enter="searchReceipt" /> - -->
        <TfAutoComplete
          v-model="selectedCompany"
          dropdown
          optionLabel="name"
          :suggestions="items"
          @complete="autoCompSearch"
          @item-select="filterCompany"
        /><!--           
           complete: yazma işlemi tamamlandığında, change: yazıldığında tıklandığında vs. -->
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
    const isUser = vueRef(true);
    const adminId = vueRef([]);
    const slipsList = vueRef([]);
    const splitMenu = vueRef([]);
    const isSearchMode = vueRef(false);
    const searchText = vueRef("");
    const selectedCompany = vueRef("");
    const companyList = vueRef([]);
    const items = vueRef([]);

    const sortByTime = async (type) => {
      const q = query(collection(db, "infos"), orderBy("receiptDate", type));
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
        adminId.value.push(doc.data().id);
        //ADMINLERI TOPLA
      });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          myId.value = user.uid;
          adminId.value.forEach((admins) => {
            if (myId.value === admins) {
              // console.log("Admin girişi");
              isUser.value = false;
              fetchData();
              return;
            }
          });

          if (isUser.value == true) {
            console.log("Kullanıcım Girişi");
            fetchUserData();
          }
        }
      });

      splitMenu.value = [
        {
          label: "Önce en yeni",
          icon: "pi pi-sort-numeric-down-alt",
          command: () => {
            sortByTime("desc");
          },
        },
        {
          label: "Önce en eski",
          icon: "pi pi-sort-numeric-down",
          command: () => {
            sortByTime("asc");
          },
        },
        {
          label: `Kartla ödemeler`,
          icon: "pi pi-credit-card",
          command: () => {
            paymentFilter("kart");
          },
        },
        {
          label: `Nakitle ödemeler`,
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

        //Users/Company
        const companyQuery = query(collection(db, "companyInfo"));
        const companyQSnapshot = await getDocs(companyQuery);

        if (companyQSnapshot.size === 0) throw new Error("No companies found");
        companyQSnapshot.forEach((value) => {
          companyList.value.push({
            companyName: value.data().companyName,
            companyId: value.data().id,
          });
        });
      };

      const fetchUserData = async () => {
        const q = query(collection(db, "infos"), where("id", "==", myId.value));

        // Sorguyu kullanarak verileri alın
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
        //User/Company
        const companyQuery = query(collection(db, "companyInfo"));
        const companyQSnapshot = await getDocs(companyQuery);

        if (companyQSnapshot.size === 0) throw new Error("No companies found");
        companyQSnapshot.forEach((value) => {
          companyList.value.push({
            companyName: value.data().companyName,
            companyId: value.data().id,
          });
        });
      };
    });

    const addReceipt = () => {
      router.push({ name: "AddReceiptView" });
    };

    const filterCompany = async () => {
      console.log("filtrelenmiş: ", selectedCompany.value);
      const q = query(
        collection(db, "infos"),
        where("id", "==", selectedCompany.value.cId)
      );
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(() => {
          slipsList.value = [];
        });
      });
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
      });
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
      //FILTRELEMEYI SIFIRLA
    };

    const autoCompSearch = (event) => {
      let _companys = [];
      items.value = [];
      companyList.value.forEach((company) => {
        if (
          company.companyName.toLowerCase().includes(event.query.toLowerCase())
        ) {
          _companys.push(company);
        }
      });
      console.log(typeof _companys, "_companys: ", _companys);
      _companys.forEach((item) => {
        items.value.push({
          name: item.companyName,
          cId: item.companyId,
        })
        const combinedString = `${item.companyName} /*/ ${item.companyId}`;
        items.value.push(combinedString);
      });
    };

    return {
      handleClick,
      addReceipt,
      cancelSearch,
      autoCompSearch,
      filterCompany,
      slipsList,
      splitMenu,
      searchText,
      companyList,
      selectedCompany,
      items,
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
