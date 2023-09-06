<template>
  <div>
    
    <detail-component :detailList="detailList"></detail-component>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import {
  getDocs,
  where,
  query,
  collection,
  getFirestore,

} from "firebase/firestore";
import { onMounted, ref } from 'vue';
import DetailComponent from '@/components/DetailComponent.vue';
export default {
  components:{
    DetailComponent
  },
  setup() {
    const route = useRoute();
    const params = route.params
    // console.log(params.id)
    // console.log(typeof params.id)
    const db = getFirestore();
    const detailList = ref([]);

    onMounted(async () => {
      try {
        const q = query(collection(db, "slips"), where("slipsId", "==", Number(params.id)));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          detailList.value.push(doc.data());
          //console.log('Demo', detailList);
        });

      } catch (error) {
        console.log(error)
      }
    });

    const updateReceipt = () => {

    }


    return { detailList, updateReceipt }
  }

}
</script>

<styles scoped>


</styles>