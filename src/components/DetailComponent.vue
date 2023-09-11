<template>
  <div class="flex justify-content-center">
    <template v-for="item in detailList" :key="item.id">
      <div class="row">
        <div class="col-6">
          <!-- w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto  -->
          <img class="w:9 sm:w-25rem shadow-2 block xl:block mx-auto my-3 border-round" :src="`${item.bilUrl}`"
            :alt="item.id" />
          <img class="w:9 sm:w-25rem shadow-2 block xl:block mx-auto my-3 border-round" :src="`${item.slipsUrl}`"
            :alt="item.id" />
        </div>
        <div class="col-6">
          <div
            class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
              <div class="flex align-items-center gap-3">
                <span class="flex align-items-center gap-2">
                  <i class="pi pi-money-bill"></i>
                  <span class="font-semibold" style="max-width: 140px">

                    <TfInputNumber :value="!isUpdate ? item.price : itemPrices" v-model="itemPrices" @input="emitPrice"
                      :disabled="!isUpdate" mode="currency" currency="TRY" locale="tr-TR"
                      style="width: auto; height: 2rem" />

                    <!-- <TfInputView :value="!isUpdate ? item.price : itemPrices" v-model="itemPrices" type="number" @input="emitPrice"
                      :disabled="!isUpdate" /> -->
                  </span>
                </span>
              </div>

              <div class="flex align-items-center gap-3">
                <span class="flex align-items-center gap-2">
                  <i class="pi pi-wallet"></i>
                  <span class="font-semibold" style="max-width: 140px">
                    <TfInputView :value="!isUpdate ? item.paymentMethod : payMethods" :disabled="1" />
                  </span>
                </span>
                <div class="p-field-radiobutton">
                  <TfRadioView name="paymentOption" value="nakit" label="Nakit" v-model="payMethods"
                    @click="emitPayMetod('nakit')" :disabled="!isUpdate" />
                  <TfRadioView name="paymentOption" value="kart" label="Kart" v-model="payMethods"
                    @click="emitPayMetod('kart')" :disabled="!isUpdate" />
                </div>
              </div>

              <div class="flex align-items-center gap-3">
                <span class="flex align-items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  <span class="font-semibold">
                    <TfInputView :value="!isUpdate ? item.receiptDate : dates" v-model="dates" @input="emitDate"
                      :disabled="!isUpdate" />
                  </span>
                </span>
              </div>
            </div>
            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <TfButtonView icon="pi pi-file-edit" severity="warning" rounded @click="updateClick(item)"></TfButtonView>
              <TfButtonView icon="pi pi-times" severity="danger" rounded @click="deleteClick(item.slipsId)">
              </TfButtonView>
              <TfButtonView icon="pi pi-check" severity="success" rounded @click="saveItem(item.slipsId)"
                :disabled="!isUpdate"></TfButtonView>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</template>

<script>
import { ref, onMounted } from "vue";
import router from "@/router/router";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export default {
  props: ["detailList"],
  emits: ["deleteClick", "updateClick", "paymentEmit", "dateEmit", "priceEmit"],

  setup(props, { emit }) {
    const db = getFirestore();
    const id = ref(null);
    const adminId = ref(null);
    const userId = ref(null);
    const isUpdate = ref(false);
    const payMethods = ref("");
    const itemPrices = ref(null);
    const dates = ref("");

    // data
    const deleteClick = (slipsId) => {
      id.value = slipsId;
      emit("deleteClick", id.value);
    };
    onMounted(async () => {
      const querySnapshot = await getDocs(collection(db, "admins"));
      querySnapshot.forEach((element) => {
        adminId.value = element.data().id;
      });
    });

    const updateClick = (item) => {
      userId.value = item.id;
      isUpdate.value = !isUpdate.value;
      dates.value = item.receiptDate;
      payMethods.value = item.paymentMethod;
      itemPrices.value = item.price;
      emitPayMetod(payMethods.value);
      emitDate();
      emitPrice();
    };

    const emitPayMetod = (selectedPayment) => {
      payMethods.value = selectedPayment;
      emit("paymentEmit", payMethods);
    };

    const emitDate = () => {
      emit("dateEmit", dates);
    };

    const emitPrice = () => {
      emit("priceEmit", itemPrices);
    };

    const saveItem = (slipsId) => {
      console.log("Save");
      id.value = slipsId;
      emit("updateClick", slipsId);
      router.push("/");
    };

    return {
      deleteClick,
      updateClick,
      //
      saveItem,
      payMethods,
      itemPrices,
      dates,
      isUpdate,
      //
      emitPayMetod,
      emitPrice,
      emitDate,
    };
  },
};
</script>

<style></style>
