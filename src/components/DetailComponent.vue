<template>
  <div class="flex justify-content-center">
    <template v-for="item in detailList" :key="item.id">
      <div>
        <div id="images">
          <img class="w:9 sm:w-25rem shadow-2 block xl:block mx-auto my-3 border-round" :src="`${item.bilUrl}`"
            :alt="item.id" max-width="500px" width="auto" />
          <img class="w:9 sm:w-25rem shadow-2 block xl:block mx-auto my-3 border-round" :src="`${item.slipsUrl}`"
            :alt="item.id" max-width="500px" />
        </div>
        <!-- images end -->
        <div id="bottomList" style="display: grid; grid-template-columns: 1fr 1rem 5rem">
          <div id="dataInputs" class="flex flex-column align-items-center justify-content-center gap-2">
            <div id="priceData">
              <span class="material-symbols-outlined">currency_lira</span>
              <span class="font-semibold" style="max-width: auto;">
                <TfInputView :value="!isUpdate ? item.price : itemPrices" v-model="itemPrices" type="number"
                  @input="emitPrice" :disabled="!isUpdate" @focus="clearInput" />
              </span>
            </div>
            <div id="methodData" style="display: -webkit-inline-box">
              <i class="pi pi-wallet" style="margin-right: 0.5rem"></i>
              <span class="font-semibold" style="max-width: auto;">
                <TfInputView :value="!isUpdate ? item.paymentMethod : payMethods" v-model="payMethods"
                  :disabled="!isUpdate" />
              </span>
            </div>
            <div id="dateData">
              <i class="pi pi-calendar" style="padding-right: 7px;"></i>
              <span class="font-semibold" style="max-width: auto;">
                <TfInputView id="dateInput" :value="!isUpdate ? item.receiptDate : dates" v-model="dates" @input="emitDate"
                  min="2000-01-01" :max="todayDate" type="date" :disabled="!isUpdate" onkeydown="return false" />
              </span>
              <TfInlineMessage v-if="e">{{ error }}</TfInlineMessage>
              <TfToast />
              <TfConfirmDialog />
            </div>
          </div>
          <!-- dataInput end -->
          <div id="methodChoose" class="p-field-radiobutton" style="
              display: flex;
              flex-direction: column;
              gap: 0.05rem;
              justify-content: center;
              -webkit-transform-origin-x: 10px;
            ">
            <TfRadioView name="paymentOption" value="nakit" label="Nakit" v-model="payMethods"
              @click="emitPayMetod('nakit')" :disabled="!isUpdate" />
            <TfRadioView name="paymentOption" value="kart" label="Kart" v-model="payMethods" @click="emitPayMetod('kart')"
              :disabled="!isUpdate" />
          </div>
          <!-- choose method end -->
          <div id="editButtons" class="flex flex-column align-items-center justify-content-center gap-2">
            <TfButtonView icon="pi pi-file-edit" severity="warning" rounded @click="updateClick(item)" />
            <TfButtonView icon="pi pi-times" severity="danger" rounded @click="deleteClick(item.slipsId)" />
            <TfButtonView icon="pi pi-check" severity="success" rounded @click="saveItem(item.slipsId)"
              :disabled="!isUpdate" />
          </div>
          <!-- Edit buttons end-->
        </div>
        <!-- bottomList end -->
      </div>
      <!-- class: row end -->
    </template>
  </div>

  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</template>

<script>
import { ref } from "vue";
import router from "@/router/router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

export default {
  props: ["detailList"],
  emits: ["deleteClick", "updateClick", "paymentEmit", "dateEmit", "priceEmit"],

  setup(props, { emit }) {
    const confirm = useConfirm();
    const toast = useToast();
    const id = ref(null);
    const userId = ref(null);
    const isUpdate = ref(false);
    const itemPrices = ref(null);
    const payMethods = ref("");
    const dates = ref("");
    const error = ref(null);
    const e = ref(false);

    //Date Validation
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthStr = month.toString();
    const zeroMonth = monthStr.padStart(2, "0");
    const todayDate = `${year}-${zeroMonth}-${day}`;

    const deleteClick = (slipsId) => {
      confirm.require({
        message: "Simek istediğine emin misin?",
        header: "Silme İşlemi",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        acceptLabel: "Evet",
        rejectLabel: "Hayır",
        accept: () => {
          toast.add({
            severity: "error",
            summary: "Silme İşlemi",
            detail: "Fiş silindi",
            life: 3000,
          });
          id.value = slipsId;
          emit("deleteClick", id.value);
        },
        reject: () => {
          toast.add({
            severity: "info",
            summary: "Sime İşlemi",
            detail: "Silme iptal edildi",
            life: 3000,
          });
        },
      });
    };

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
      const payment = itemPrices.value;
      if (!Math.floor(payment / 10 ** 9)) {
        emit("priceEmit", itemPrices);
      } else {
        e.value = true;
        error.value =
          "En fazla 1.000.000.000 (Bir Milyar) TL tutar girilebilir";
      }
    };

    const saveItem = (slipsId) => {
      console.log("Save");
      id.value = slipsId;
      emit("updateClick", slipsId);
      router.push("/");
    };

    const clearInput = () => {
      e.value = false;
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
      //
      e,
      error,
      clearInput,
      todayDate,
    };
  },
};
</script>

<style scoped>
img {
  width: 21rem !important;
}

#dateInput   {
  width: 200px;
}


</style>
