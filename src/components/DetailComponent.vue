<template>
  <div :value="detailList">
    <template v-for="item in detailList" :key="item.id">
      <div class="row">
        <div class="col-6">
          <img
            class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            :src="`${item.bilUrl}`"
            :alt="item.id"
          />
          <img
            class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
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
                {{ item.receiptDate }}
              </div>
              <!-- rating -->
              <div class="flex align-items-center gap-3">
                <span class="flex align-items-center gap-2">
                  <i class="pi pi-wallet"></i>
                  <span class="font-semibold">{{ item.paymentMethod }}</span>
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
                @click="updateClick"
              ></TfButtonView>
              <TfButtonView
                icon="pi pi-times"
                severity="danger"
                rounded
                @click="deleteClick(item.slipsId)"
              >
              </TfButtonView>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  props: ["detailList"],
  emits: ["deleteClick"],
  setup(props, { emit }) {
    const id = ref(null);
    const router = useRouter();

    const deleteClick = (slipsId) => {
      id.value = slipsId;
      emit("deleteClick", id.value);
    };

    const updateClick = () => {
      router.push({ name: "HomeView" });
    };

    return { deleteClick, updateClick };
  },
};
</script>

<style></style>
