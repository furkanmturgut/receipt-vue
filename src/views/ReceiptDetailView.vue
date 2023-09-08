<template>
  <div>
    <detail-component :detailList="detailList" @deleteClick="deleteItem" @updateClick="updateItem"
      @paymentEmit="handleChildPrice" @dateEmit="handleChildDate"></detail-component>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import {
  doc,
  query,
  where,
  updateDoc,
  getDocs,
  deleteDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { onMounted, ref } from "vue";
import DetailComponent from "@/components/DetailComponent.vue";
export default {
  components: {
    DetailComponent,
  },
  setup() {
    const route = useRoute();
    const params = route.params;
    const router = useRouter();
    const upDate = ref(null);
    const upPayment = ref(null);
    const db = getFirestore();
    const detailList = ref([]);
    console.log("paramsid: ", params.id);

    onMounted(async () => {
      try {
        const q = query(
          collection(db, "infos"),
          where("slipsId", "==", Number(params.id))
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          detailList.value.push(doc.data());
        });
      } catch (error) {
        console.log(error);
      }
    });

    const updateItem = async (myID) => {
      const dB = getFirestore()
      //console.log("Update")
      const q = query(collection(dB, "infos"), where("slipsId", "==", myID));

      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const docum = querySnapshot.docs[0];
        const firstUpdate = {
          paymentMethod: upPayment.value,
          receiptDate: upDate.value
        }
        await updateDoc(docum.ref, firstUpdate)
      }
    }

    const handleChildPrice = (newPrice) => {
      upPayment.value = newPrice.value
      console.log("Yeni Price:", newPrice.value);
    };

    const handleChildDate = (newDate) => {
      upDate.value = newDate.value;
      console.log("Yeni Tarih:", newDate.value);
    }

    const deleteItem = (myID) => {
      const q = query(collection(db, "infos"), where("slipsId", "==", myID));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((docs) => {
          const docRef = doc(db, "infos", docs.id);
          deleteDoc(docRef).then(() => {
            router.push({ name: "HomeView" });
          });
        });
      });
    };

    return { detailList, deleteItem, updateItem, handleChildPrice,handleChildDate };
  },
};
</script>

<styles scoped></styles>
