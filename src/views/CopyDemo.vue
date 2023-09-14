<template>
  <div class="container">
    <form @submit.prevent="submitData">
      <div id="fatura">
        <h1 style="text-align: center">Fatura</h1>
        <!--v-if="!isPhotoTaken1"-->
        <TfDropdownView
          id="chooseCamera1"
          v-model="chosenCamera"
          :options="cameras"
          optionValue="deviceId"
          optionLabel="label"
          placeholder="Kamera seçin"
          @change="changeCamera(0)"
        >
        </TfDropdownView>
        <video
          v-if="enabled"
          ref="videoElement1"
          muted
          autoplay
          controls
          class="videoCam"
        />
        <canvas ref="canvasElement1" style="display: none" />
        <!-- v-if="isPhotoTaken1" -->
        <!-- :src="photoScreen1" -->
        <img alt="faturaFoto" class="videoCam" />
        <!-- v-if="!isPhotoTaken1" -->
        <TfButtonView
          id="takePhotoBtn1"
          @click="takePhoto(0)"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          "
          >📸</TfButtonView
        >
        <TfButtonView class="openCamera1" @click="enabled = !enabled">
          {{ enabled ? "Kamerayı kapat" : "Kamerayı aç" }}
        </TfButtonView>
        <!--Bu buton yerine küçük bir çarpı butonu getirilebilir-->
        <!--<div id="kullanılmayan"> 
          <div id="cameraList">
          <div
            v-for="camera of cameras"
            :key="camera.deviceId"
            :class="{ 'text-primary': currentCamera === camera.deviceId }"
            @click="currentCamera.value = camera.deviceId">
            {{ camera.label }}
            </div>
          </div>
        </div> -->
      </div>
      <!-- FATURA/SLİP -->
      <div class="slip">
        <h1 style="text-align: center">Slip</h1>
      </div>
      <!-- SLİP/TARİH -->
      <h1 style="text-align: center">Fatura Tarihi</h1>

      <TfInputView
        type="date"
        v-model="dateInput"
        :max="todayDate"
        min="2000-01-01"
        style="width: auto; height: 2rem"
        @focus="clearInput"
        onkeydown="return false"
      />
      <!-- TARİH/TUTAR -->
      <h1 style="text-align: center">Tutar</h1>
      <TfInputView
        v-model="paymentPrice"
        type="number"
        placeholder="Ödeme Tutarı (TL)"
        @focus="clearInput"
      />
      <!-- TUTAR/ÖDEME ŞEKLİ -->
      <h1 style="text-align: center">Ödeme Şekli</h1>
      <div
        style="flex-wrap: wrap; justify-content: center; column-gap: 25px"
        class="flex"
      >
        <div class="flex align-items-center">
          <TfRadioView v-model="paymentMethod" name="kart" value="kart" />
          <label
            for="kart"
            style="font-size: 1.5rem; font-weight: bold"
            class="ml-2"
            >Kart</label
          >
        </div>
        <div class="flex align-items-center">
          <TfRadioView v-model="paymentMethod" name="nakit" value="nakit" />
          <label
            for="nakit"
            style="font-size: 1.5rem; font-weight: bold"
            class="ml-2"
            >Nakit</label
          >
        </div>
      </div>
      <!-- OdemeSekli//Kaydet Buton -->
      <TfButtonView
        style="text-transform: uppercase; font-size: large margin-top: 30px; margin-bottom: 30px;"
        type="submit"
        label="Kaydet"
      />
      <TfInlineMessage v-if="hasError">{{ error }}</TfInlineMessage>
    </form>
  </div>
</template>

<script>
import // getStorage,
// uploadBytes,
// ref as FBref,
// getDownloadURL,
"firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useUserMedia, useDevicesList } from "@vueuse/core";
export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    // const storage = getStorage();
    const dateInput = ref(null);
    const paymentPrice = ref(null);
    const paymentMethod = ref(null);
    const dateRegex = /^\d{4}\-\d{2}\-\d{2}$/;
    const hasError = ref(false);
    const error = ref(null);
    const currentCamera = ref();
    const chosenCamera = ref();
    const { videoInputs: cameras } = useDevicesList({
      requestPermissions: true,
      onUpdated() {
        if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
          currentCamera.value = cameras.value[0]?.deviceId;
      },
    });
    const videoElement1 = ref(null);
    const { stream, enabled } = useUserMedia({
      constraints: {
        video: { deviceId: currentCamera },
      },
    });
    //Date Validation
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = month.toString();
    const zeroMonth = monthStr.padStart(2, "0");
    const day = date.getDate();
    const todayDate = `${year}-${zeroMonth}-${day}`;
    const clearInput = () => {
      hasError.value = false;
    };

    onMounted(async () => {
      // availableCameras.value = await getAvailableCameras();
      // currentCamera.value = availableCameras.value[0].deviceId;
    });
    watchEffect(() => {
      if (videoElement1.value) {
        if (stream.value) {
          if (stream.value.id == chosenCamera.value) {
            videoElement1.value.srcObject = stream.value;
          } else {
            stream.value = useUserMedia({constraints: {video: {deviceId: currentCamera.value}}})
          }
        }
      }
      console.log("Watcher", stream.value);
    });

    const changeCamera = async (which) => {
      if (which == 0) {
        enabled.value = false;
        videoElement1.value = null;
        currentCamera.value = chosenCamera.value;
        enabled.value = true;
        //Telefon testi
        const cam = document.createElement("p");
        cam.textContent = chosenCamera.value;
        document.querySelector("#fatura").appendChild(cam);
        //test bitti

        if (videoElement1.value) videoElement1.value.srcObject = stream.value;
      } //else if (which == 1){
      //   enabled.value = false;
      //   videoElement2.value = null; //??
      //   currentCamera.value = chosenCamera.value;
      //   enabled.value = true;
      // }
    };

    const submitData = async () => {
      // if (photoPng1.value && photoPng2.value) {
      if (dateRegex.test(dateInput.value)) {
        const payment = paymentPrice.value;
        if (!Math.floor(payment / 10 ** 9)) {
          if (paymentMethod.value != null) {
            try {
              // const id = Date.now();
              // const storageRef1 = FBref(storage, `infos/${id}`);
              // const storageRef2 = FBref(storage, `receipt/${id}`);
              // const fileSnapshot1 = await uploadBytes(
              //   storageRef1,
              //   photoPng1.value
              // );
              // const fileSnapshot2 = await uploadBytes(
              //   storageRef2,
              //   photoPng2.value
              // );
              // const downloadURL1 = await getDownloadURL(fileSnapshot1.ref);
              // const downloadURL2 = await getDownloadURL(fileSnapshot2.ref);
              const random = Math.floor(Math.random() * 100000);

              addDoc(collection(db, "infos"), {
                id: auth.currentUser.uid,
                slipsId: random,
                // bilUrl: downloadURL1,
                // slipsUrl: downloadURL2,
                price: paymentPrice.value,
                receiptDate: dateInput.value,
                paymentMethod: paymentMethod.value,
                uploadDate: serverTimestamp(),
              });
              router.push({ name: "HomeView" });
            } catch (err) {
              alert("Firebase hatası!");
              console.error(err);
            }
          } else {
            hasError.value = true;
            error.value = "Ödeme yöntemi seçiniz.";
          }
        } else {
          hasError.value = true;
          error.value =
            "En fazla 1.000.000.000 (Bir Milyar) TL tutar girilebilir.";
        }
      } else {
        hasError.value = true;
        error.value = "Lütfen geçerli bir tarih giriniz.";
      }
      // } else {
      //   hasError.value = true;
      //   error.value = "Kamera ile gerekli görselleri ekleyin.";
      // }
    };

    return {
      submitData,
      changeCamera,
      //

      //
      currentCamera,
      videoElement1,
      // availableCameras,
      cameras,
      dateInput,
      paymentMethod,
      paymentPrice,
      todayDate,
      chosenCamera,
      //
      error,
      clearInput,
      hasError,
      enabled,
      //
    };
  },
};
</script>

<style scoped>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#fatura,
.slip,
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.p-radiobutton {
  scale: 1.3;
  margin-right: 10px;
}

.container {
  background-color: #64ccc5;
  min-height: 500px;
}

.openCamera1 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 100%;
  min-width: 0;
}

.openCamera2 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 100%;
  min-width: 0;
}

.videoCam {
  max-height: 300px;
}

#card {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
