<template>
  <div class="flex justify-content-center">
    <template v-for="item in detailList" :key="item.id">
      <div class="row">
        <div class="col-6">
          <!-- w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto  -->
          <img
            class="w:9 sm:w-20rem shadow-2 block xl:block mx-auto my-3 border-round"
            :src="`${item.bilUrl}`"
            :alt="item.id"
          />
          <img
            class="w:9 sm:w-20rem shadow-2 block xl:block mx-auto my-3 border-round"
            :src="`${item.slipsUrl}`"
            :alt="item.id"
          />
        </div>
        <div class="col-6">
          <div
            class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
          >
            <div
              class="flex flex-column align-items-center sm:align-items-start gap-3"
            >
              <div class="text-2xl font-bold text-900">
                <i class="pi pi-calendar"></i>
                <TfInputView
                  :value="!isUpdate ? item.receiptDate : dates"
                  v-model="dates"
                  @input="emitDate"
                  :disabled="!isUpdate"
                />
              </div>
              <div class="flex align-items-center gap-3">
                <span class="flex align-items-center gap-2">
                  <i class="pi pi-wallet"></i>
                  <span class="font-semibold">
                    <TfInputView
                      :value="!isUpdate ? item.paymentMethod : payments"
                      v-model="payments"
                      @input="emitPayment"
                      :disabled="!isUpdate"
                    />
                  </span>
                </span>
              </div>
            </div>
            <div
              class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
            >
              <span class="text-2xl font-semibold"> ${{ item.price }}</span>
              <TfButtonView
                icon="pi pi-file-edit"
                severity="warning"
                rounded
                @click="updateClick(item)"
              ></TfButtonView>
              <TfButtonView
                icon="pi pi-times"
                severity="danger"
                rounded
                @click="deleteClick(item.slipsId)"
              ></TfButtonView>
              <TfButtonView
                icon="pi pi-check"
                severity="success"
                rounded
                @click="saveItem(item.slipsId)"
                :disabled="!isUpdate"
              ></TfButtonView>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
</template>

<script>
import { ref, onMounted } from "vue";
import router from "@/router/router";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export default {
  props: ["detailList"],
  emits: ["deleteClick", "updateClick", "paymentEmit", "dateEmit"],

  setup(props, { emit }) {
    const id = ref(null);
    const db = getFirestore();
    const adminId = ref(null);
    const userId = ref(null);
    const isUpdate = ref(false);
    const payments = ref("");
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
      payments.value = item.paymentMethod;
      dates.value = item.receiptDate;
      userId.value = item.id;
      isUpdate.value = !isUpdate.value;
      emitPayment();
      emitDate();
    };

    const emitPayment = () => {
      // data = item.paymentMethod
      console.log("paymentEmit", payments);
      emit("paymentEmit", payments);
    };

    const emitDate = () => {
      console.log("datesPayment", dates);

      emit("dateEmit", dates);
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
      isUpdate,
      saveItem,
      emitPayment,
      payments,
      emitDate,
      dates,
    };
  },
};
</script>

<style></style>
