<template>
  <TfDataView :value="detailList">
  <template v-for="item in detailList" :key="item.id">
    <div class="col-12">
      <div
        class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
      >
        <img
          class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
          :src="`https://primefaces.org/cdn/primevue/images/product/${item.bilUrl}`"
        />
        <divF
          class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
        >
          <div
            class="flex flex-column align-items-center sm:align-items-start gap-3"
          >
<!-- rating -->
            <div class="flex align-items-center gap-3">
              <span class="flex align-items-center gap-2">
                <i class="pi pi-tag"></i>
                <span class="font-semibold">{{ item.receiptDate }}</span>
              </span>
            </div>
          </div>
          <div
            class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
          >
            <span class="text-2xl font-semibold">
              ${{ item.price }}</span
            >
          </div>
        </divF>
      </div>
    </div>
  </template>
</TfDataView>

  <div>
    <!--<div v-for="detail in detailList" :key="detail.id">
      <div>
        <label>Fatura</label>
        <img :src="detail.bilUrl" alt="" />
      </div>

      <div>
        <label>Slip</label>
        <img :src="detail.slipUrl" alt="" />
      </div>

      <div>
        <TfInputView type="text" :value="detail.price + ' TL'" disabled />
      </div>
      <div>
        <TfInputView type="text" :value="detail.receiptDate" disabled />
      </div>

      <div>
        <p>Ödeme Yönteminiz</p>
      </div>

      <TfButtonView @click="updateReceipt">Güncelle</TfButtonView>
    </div>-->
  </div>
</template>

<script>
export default {
  props: ["detailList"],
};
</script>

<style></style>
