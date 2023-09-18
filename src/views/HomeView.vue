<template>
  <div>
    <div class="container" id="homeViewContainer">
      <div id="welcomeText" style="
          display: flex;
          align-content: center;
          flex-direction: column;
          align-items: center;
          flex-wrap: wrap;
        ">
        <p>Hoş geldiniz</p>
        <p v-if="currentCompanyName != 'ADMIN'"><strong>{{ currentCompanyName.companyName }}</strong></p>
      </div>
      <TfSplitButtonView v-if="!isSearchMode" label="Fiş Ekle" icon="pi pi-plus" :model="splitMenu" @click="addReceipt" />
      <div v-else style="
          display: flex;
          flex-wrap: wrap;
          align-content: center;
          justify-content: center;
          gap: 5px;
        ">
        <TfButtonView label="Geri" icon="pi pi-arrow-left" @click="cancelSearch" v-model="searchText"
          style="min-width: 100px" id="returnButton" />
        <TfAutoComplete v-model="selectedCompany" dropdown optionLabel="name" :suggestions="items"
          @complete="autoCompSearch" @item-select="filterCompany" />
        <!-- complete: yazma işlemi tamamlandığında, change: yazıldığında tıklandığında vs. -->
      </div>
      <div v-if="isLoading">
        <TfSpinner />
      </div>
      <list-component :slipsList="slipsList" @itemClick="handleClick">
        <!-- Slipslist ismi değişebilir-->
      </list-component>
      <h3 v-show="errorState">{{ errorMessage }}</h3>

      <br>
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
    const items = vueRef([]);
    const allUserData = vueRef([]);
    const companyList = vueRef([]);
    const searchText = vueRef("");
    const currentCompanyName = vueRef("");
    const selectedCompany = vueRef("");
    const isSearchMode = vueRef(false);
    const isLoading = vueRef(true);
    const errorMessage = vueRef(null)
    const errorState = vueRef(false)

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
      slipsList.value = [];
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
        //ADMINI BUL
      });

      onAuthStateChanged(auth, async (user) => {
        isLoading.value = false;
        if (user) {
          myId.value = user.uid;
          adminId.value.forEach((admins) => {
            if (myId.value === admins) {
              isUser.value = false;
              console.log("Admin Girişi");
              currentCompanyName.value = "ADMIN";
              fetchData();
              return;
            }
          });
          if (isUser.value == true) {
            console.log("Kullanıcım Girişi");
            await fetchData();
            currentCompanyName.value = allUserData.value.find((datas) => {
              return datas.companyId == myId.value
            });
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
        const compQuerrySnapshot = await getDocs(companyQuery);

        if (compQuerrySnapshot.size === 0)
          throw new Error("No companies found");
        compQuerrySnapshot.forEach((value) => {
          allUserData.value.push({
            companyName: value.data().companyName,
            companyId: value.data().id,
          });

        });

        if (!isUser.value) {
          companyList.value = allUserData.value;
        } else {
          fetchUserData();
        }
      };

      const fetchUserData = () => {

        if (slipsList.value.length <= 0) {
          console.log("Hata")
        } else {
          slipsList.value = slipsList.value.filter((data) =>
            data.id == myId.value
          )
        }
      };
    });

    const addReceipt = () => {
      router.push({ name: "AddReceiptView" });
    };

    const filterCompany = async () => {
      console.log("şu şirket filtrelendi: ", selectedCompany.value);
      const q = query(
        collection(db, "infos"),
      );
      slipsList.value = [];

      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          slipsList.value.push(doc.data());
        });
      });
      slipsList.value = slipsList.value.filter((slip) =>
        slip.id == selectedCompany.value.cId)
      //console.log('slipslist:', slipsList);
      console.log("L:",slipsList.value.length)
      if (slipsList.value.length <= 0) {
        errorState.value = true
        errorMessage.value = "Veri bulunamadı..."
      } else {
        errorState.value = false

      }
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
      console.log("ERROR STATE:",errorState.value)
      if(errorState.value == true){
        errorMessage.value = null
        sortByTime()
      }
    
   

    };

    const autoCompSearch = (event) => {
      items.value = [];
      const _companys = companyList.value.filter((company) =>
        company.companyName.toLowerCase().includes(event.query.toLowerCase())
      );
      _companys.forEach((item) => {
        items.value.push({
          name: item.companyName,
          cId: item.companyId,
        });
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
      currentCompanyName,
      companyList,
      selectedCompany,
      items,
      isSearchMode,
      isUser,
      isLoading,
      errorMessage,
      errorState
    };
  },
};
</script>

<style scoped>
#homeViewContainer {
  background-color: #64ccc5;
  display: flex;
  gap: 15px;
  width: auto;
  min-height: 70vh;
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
