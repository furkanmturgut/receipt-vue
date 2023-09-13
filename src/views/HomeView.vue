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
        <p v-else><strong>{{ currentCompanyName }}</strong></p>
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
          style="min-width: 100px" />
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
        //ADMINI BUL
      });

      onAuthStateChanged(auth,async (user)  =>  {
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
           await  fetchData();
            currentCompanyName.value = allUserData.value.find( (datas) => {
             return datas.companyId == myId.value
            }
            );

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
        //console.log("Slips List: ",slipsList.value)
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
        companyList.value = allUserData.value.filter((user) => {
          user.companyId == myId.value;
        });
        console.log("complist", companyList.value);
      };
    });

    const addReceipt = () => {
      router.push({ name: "AddReceiptView" });
    };

    const filterCompany = async () => {
      console.log("şu şirket filtrelendi: ", selectedCompany.value);
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
