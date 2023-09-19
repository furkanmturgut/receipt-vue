<template>
  <div class="flex justify-content-center " style="background-color:#64ccc5;">
    <template v-for="item in detailList" :key="item.id">
      <div>
        <div id="images">
          <h3 style="text-align: center;">FATURA</h3>
          <img id="billURL" class="w:9 sm:w-25rem shadow-2 block xl:block mx-auto my-3 border-round" :src="item.bilUrl"
            :alt="item.id" max-width="500px" width="auto">
          <h3 style="text-align: center;" v-show="item.slipsUrl != ''">SLIP</h3>
          <img v-if="item.slipsUrl != ''" id="slipsURL"
            class="w:9 sm:w-25rem shadow-2 block xl:block mx-auto my-3 border-round" :src="item.slipsUrl" :alt="item.id"
            max-width="500px">
        </div>
        <!-- images end -->
        <div id="bottomList" style="display: grid; grid-template-columns: 1fr 2rem 3rem">
          <div id="dataInputs" class="flex flex-column align-items-center justify-content-center gap-2">
            <div id="priceData">
              <span class="material-symbols-outlined">currency_lira</span>
              <span class="font-semibold" style="max-width: auto;">
                <TfInputView class="inputWidth"
                  :value="!isUpdate ? item.price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + '.') : itemPrices"
                  v-model="itemPrices" type="number" @input="emitPrice" :disabled="!isUpdate" />
              </span>
            </div>
            <div id="methodData" style="display: -webkit-inline-box">
              <i class="pi pi-wallet" style="margin-right: 0.5rem"></i>
              <span class="font-semibold" style="max-width: auto; ">
                <TfDropdownView class="inputWidth" v-model="payMethods" :options="paymentList" optionLabel="name"
                  placeholder="Seçiniz" :disabled="!isUpdate" @change="emitPayMetod">
                </TfDropdownView>
              </span>
            </div>
            <div id="dateData" style="display: -webkit-inline-box">
              <i class="pi pi-calendar" style="margin-right: 0.3rem;"></i>
              <span class="font-semibold" style="max-width: auto;">
                <TfInputView class="inputWidth" :value="!isUpdate ? item.receiptDate : dates" v-model="dates"
                  @input="emitDate" min="2000-01-01" :max="todayDate" type="date" :disabled="!isUpdate" />
              </span>

              <TfToast />
              <TfConfirmDialog />
            </div>

          </div>
          <!-- dataInput end -->
          <!-- choose method end -->
          <div id="editButtons" class="flex flex-column align-items-center justify-content-center gap-2">
            <TfButtonView icon="pi pi-file-edit" severity="warning" rounded @click="updateClick(item)" />
            <TfButtonView icon="pi pi-times" severity="danger" rounded @click="deleteClick(item.slipsId)" />
            <TfButtonView icon="pi pi-check" severity="success" rounded @click="saveItem(item.slipsId)"
              :disabled="!e ? !isUpdate : e" />
          </div>
          <!-- Edit buttons end-->
        </div>
        <!-- bottomList end -->
        <div>
          <TfInlineMessage class="messageStyle" v-if="e">{{ error }}</TfInlineMessage>

        </div>
      </div>
      <!-- class: row end -->

    </template>
  </div>

  <!-- TRY ICON-->
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
    const year = ref('')

    const paymentList = [
      { name: "Nakit", value: "Nakit" },
      { name: "Kredi Kartı", value: "Kredi Kartı" }
    ];

    //Date Validation
    const date = new Date();
    year.value = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthStr = month.toString();
    const zeroMonth = monthStr.padStart(2, "0");
    const todayDate = `${year.value}-${zeroMonth}-${day}`;

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
      payMethods.value = item.paymentMethod[0];
      itemPrices.value = item.price;

      emitPayMetod(payMethods.value);
      emitDate();
      emitPrice();
    };

    const emitPayMetod = () => {
      emit("paymentEmit", payMethods);
    };

    const emitDate = () => {
      const selectDate = dates.value;
      console.log("Selected Date: ", selectDate);
      const enteredYear = parseInt(selectDate.substring(0, 4), 10);

      console.log("SDate Typeof : ", typeof selectDate)
      if (selectDate != "" && selectDate != null && year.value >= enteredYear && enteredYear >= 2000) {
        e.value = false;
        emit("dateEmit", dates);
      } else {
        e.value = true;
        error.value = "Lütfen en geç bugünü içeren bir tarih giriniz"
      }
    };

    const emitPrice = () => {
      const payment = itemPrices.value;
      if (payment > 0 && payment <= 9000) {
        console.log("Gelen veri :", payment)
        console.log("Tipi: ", typeof payment)
        e.value = false
        emit("priceEmit", itemPrices);
      } else {
        e.value = true;
        error.value =
          "En fazla 9.000 (Dokuz Bin) TL tutar girilebilir";
      }
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
      //
      e,
      error,
      todayDate,
      paymentList
    };
  },
};
</script>

<style scoped>
img {
  width: 21rem !important;
}

.inputWidth {
  width: 12.5rem;

}

#bottomList {
  margin-bottom: 15px;
}

.messageStyle {
  max-width: 12.5rem;
  text-align: center;
  margin-left: 2.3rem;
  margin-bottom: 15px;
}
</style>
