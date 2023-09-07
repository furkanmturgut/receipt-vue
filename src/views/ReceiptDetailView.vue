<template>
  <div>
    <detail-component
      :detailList="detailList"
      @deleteClick="deleteItem"
    ></detail-component>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import {
  doc,
  query,
  where,
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
    
    return { detailList, deleteItem };
  },
};
</script>

<styles scoped></styles>
