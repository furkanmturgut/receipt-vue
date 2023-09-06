<template>
  <TfCardView v-for="receipt in slipsList" :key="receipt.id">
    <template #title>Fiş Tarihi: {{ receipt.receiptDate }}</template>
    <template #content> Ödeme Tutarı: {{ receipt.price }}TL </template>
    <template #footer>
      <div
        style="
          padding: 1.25rem 0 0 0;
          min-width: 250px;
          justify-content: space-evenly;
          display: flex;
        "
      >
        <TfButtonView
          icon="pi pi-search"
          label="Detay"
          @click="handleClick(receipt.slipsId)"
        />
        <TfButtonView icon="pi pi-times" severity="danger" label="Sil" />
      </div>
    </template>
  </TfCardView>
</template>

<script>
import {ref} from 'vue'
export default {
  props: ["slipsList"],
  emits: ["itemClick"],

  setup(props, { emit }) {
    const id = ref(null); 

    /* 
    
    receipt.slipsId'yi id adında bir değişkene atamadan önce receipt değişkenini tanımlamanız gerekiyor. 
    Ayrıca, receipt'ı v-for döngüsünün içinde tanımladığınız için, setup içinde bu değişkeni kullanabilmek için 
    önce ref veya reactive gibi reaktif bir değişken olarak tanımlamanız gerekebilir.
    */
    const handleClick = (slipsId) => {
      id.value = slipsId; 
      emit("itemClick", id.value); 
    };

    return { handleClick };
  },
};
</script>

<style scoped>
.receipts {
  border-radius: 7px;
  border: 3px solid red;
  padding: 20px;
  margin: 20px;
  align-items: flex-start;
  cursor: pointer;
}
</style>
