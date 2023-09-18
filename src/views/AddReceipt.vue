<template>
  <div class="container">
    <form @submit.prevent="submitData">
      <TfToast />
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
      <!-- OdemeSekli/Fatura -->
      <div id="fatura">
        <h1 style="text-align: center">Fatura</h1>
        <TfButtonView
          class="openCamera"
          :disabled="isCameraOn2"
          @click="toggleCamera(0)"
        >
          {{ isCameraOn1 ? "Kamerayı Kapat" : "Kamerayı Aç" }}
        </TfButtonView>
        <TfDropdownView
          id="chooseCamera1"
          v-if="isCameraOn1"
          v-model="currentCamera"
          :options="cameras"
          optionValue="deviceId"
          optionLabel="label"
          placeholder="Kamera seçin"
          @change="changeCamera(0)"
        >
        </TfDropdownView>
        <video
          v-if="isCameraOn1"
          ref="videoElement1"
          muted
          autoplay
          controls
          class="videoCam"
        />
        <canvas ref="canvasElement1" style="display: none" />
        <img
          v-if="isPhotoTaken1 && !isCameraOn1"
          alt="billPhoto"
          :src="photoScreen1"
          class="videoCam"
        />
        <TfButtonView
          id="takePhotoBtn1"
          v-if="isCameraOn1"
          @click="takePhoto(0)"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          "
          >📸</TfButtonView
        >
      </div>
      <!-- FATURA/SLİP -->
      <div class="slip" v-if="paymentMethod == 'kart'">
        <h1 style="text-align: center">Slip</h1>
        <TfButtonView
          class="openCamera"
          :disabled="isCameraOn1"
          @click="toggleCamera(1)"
        >
          {{ isCameraOn2 ? "Kamerayı Kapat" : "Kamerayı Aç" }}
        </TfButtonView>
        <TfDropdownView
          id="chooseCamera2"
          v-if="isCameraOn2"
          v-model="currentCamera"
          :options="cameras"
          optionValue="deviceId"
          optionLabel="label"
          placeholder="Kamera seçin"
          @change="changeCamera(1)"
        >
        </TfDropdownView>
        <video
          v-if="isCameraOn2"
          ref="videoElement2"
          muted
          autoplay
          controls
          class="videoCam"
        />
        <canvas ref="canvasElement2" style="display: none" />
        <img
          v-if="isPhotoTaken2 && !isCameraOn2"
          alt="slipPhoto"
          :src="photoScreen2"
          class="videoCam"
        />
        <TfButtonView
          id="takePhotoBtn2"
          v-if="isCameraOn2"
          @click="takePhoto(1)"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          "
          >📸</TfButtonView
        >
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
      <!-- Tutar/Kaydet -->
      <TfButtonView
        style="text-transform: uppercase; font-size: large margin-top: 30px; margin-bottom: 30px;"
        type="submit"
        label="Kaydet"
      />
      <TfInlineMessage v-if="hasError">{{ error }}</TfInlineMessage>
      <br>
    </form>
  </div>
</template>

<script>
import {
  getStorage,
  uploadBytes,
  ref as FBref,
  getDownloadURL,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, watchEffect, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserMedia, useDevicesList } from "@vueuse/core";
import { useToast } from "primevue/usetoast";

export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    const storage = getStorage();
    const dateInput = ref(null);
    const paymentPrice = ref(null);
    const paymentMethod = ref(null);
    const dateRegex = /^\d{4}\-\d{2}\-\d{2}$/;
    const hasError = ref(false);
    const error = ref(null);
    const currentCamera = ref();
    const videoElement1 = ref(null);
    const videoElement2 = ref(null);
    const canvasElement1 = ref(null);
    const canvasElement2 = ref(null);
    const photoScreen1 = ref(null);
    const photoScreen2 = ref(null);
    const photoPng1 = ref(null);
    const photoPng2 = ref(null);
    const isPhotoTaken1 = ref(false);
    const isPhotoTaken2 = ref(false);
    const isCameraOn1 = ref(false);
    const isCameraOn2 = ref(false);
    const { videoInputs: cameras } = useDevicesList({
      requestPermissions: false,
    });
    const { stream, start, stop } = useUserMedia({
      constraints: {
        video: { deviceId: currentCamera },
      },
    });

    const toast = useToast();
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

    watch(
      () => cameras.value,
      () => {
        if (cameras.value.length > 1) {
          stop();
          currentCamera.value = cameras.value[1].deviceId;
          start();
        } else if (cameras.value.length > 0) {
          currentCamera.value = cameras.value[0].deviceId;
        }
      }
    );

    watchEffect(() => {
      if (videoElement1.value) {
        videoElement1.value.srcObject = stream.value;
      }
      if (videoElement2.value) {
        videoElement2.value.srcObject = stream.value;
      }
      console.log("Watcher", stream.value);
    });

    const toggleCamera = async (which) => {
      try {
        if (which == 0) {
          if (isCameraOn1.value == false) await start();
          else stop();
          isCameraOn1.value = !isCameraOn1.value;
        } else if (which == 1) {
          if (isCameraOn2.value == false) await start();
          else stop();
          isCameraOn2.value = !isCameraOn2.value;
        }
      } catch (error) {
        console.error(error);
        errorToast();
        //alert("Kamera izni vermeniz gerekiyor!");
      }
    };

    const changeCamera = async (which) => {
      try {
        if (which == 0) {
          if (stream.value) {
            const tracks = stream.value.getTracks();
            tracks.forEach((track) => track.stop());
          }
          isCameraOn1.value = false;
          stop();
          if (videoElement1.value)
            videoElement1.value.srcObject = await stream.value;
          isCameraOn1.value = true;
          await start();
        } else if (which == 1) {
          if (stream.value) {
            const tracks = stream.value.getTracks();
            tracks.forEach((track) => track.stop());
          }
          isCameraOn2.value = false;
          stop();
          if (videoElement2.value)
            videoElement2.value.srcObject = await stream.value;
          isCameraOn2.value = true;
          await start();
        }
      } catch (error) {
        errorToast();
      }
    };

    const errorToast = () => {
      toast.add({
        severity: "error",
        summary: "Kamera İzni Hatası",
        detail: "Lütfen kamera izni veriniz",
        life: 3000,
      });
    };

    const takePhoto = async (which) => {
      if (!stream.value) return;
      if (which == 0) {
        isPhotoTaken1.value = false;

        const context = canvasElement1.value.getContext("2d");
        canvasElement1.value.width = videoElement1.value.videoWidth;
        canvasElement1.value.height = videoElement1.value.videoHeight;
        context.drawImage(
          videoElement1.value,
          0,
          0,
          videoElement1.value.videoWidth,
          videoElement1.value.videoHeight
        );
        const imageData = canvasElement1.value.toDataURL("image/png");
        photoScreen1.value = imageData;
        canvasElement1.value.toBlob((blob) => {
          if (blob) photoPng1.value = blob;
        }, "image/jpeg");
        isPhotoTaken1.value = true;
        isCameraOn1.value = false;
        stop();
      } else if (which == 1) {
        isPhotoTaken1.value = false;

        const context = canvasElement2.value.getContext("2d");
        canvasElement2.value.width = videoElement2.value.videoWidth;
        canvasElement2.value.height = videoElement2.value.videoHeight;
        context.drawImage(
          videoElement2.value,
          0,
          0,
          videoElement2.value.videoWidth,
          videoElement2.value.videoHeight
        );
        const imageData = canvasElement2.value.toDataURL("image/jpeg");
        photoScreen2.value = imageData;
        canvasElement2.value.toBlob((blob) => {
          if (blob) photoPng2.value = blob;
        }, "image/jpeg");
        isPhotoTaken2.value = true;
        isCameraOn2.value = false;
        stop();
      }
    };

    const submitData = async () => {
      if (photoPng1.value) {
        if (dateRegex.test(dateInput.value)) {
          const payment = paymentPrice.value;
          if (payment >0 && payment <= 9000) {
            if (paymentMethod.value != null) {
              try {
                const id = Date.now();
                const storageRef1 = FBref(storage, `infos/${id}`);
                const storageRef2 = FBref(storage, `receipt/${id}`);
                const fileSnapshot1 = await uploadBytes(
                  storageRef1,
                  photoPng1.value
                );
                const downloadURL1 = await getDownloadURL(fileSnapshot1.ref);
                const random = Math.floor(Math.random() * 100000);
                let downloadURL2;
                if (photoPng2.value) {
                  const fileSnapshot2 = await uploadBytes(
                    storageRef2,
                    photoPng2.value
                  );
                  downloadURL2 = await getDownloadURL(fileSnapshot2.ref);
                }
                addDoc(collection(db, "infos"), {
                  id: auth.currentUser.uid,
                  slipsId: random,
                  bilUrl: downloadURL1,
                  slipsUrl: downloadURL2 || "",
                  price: Number(paymentPrice.value),
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
              "En fazla 9.000 (Dokuz Bin) TL tutar girilebilir.";
          }
        } else {
          hasError.value = true;
          error.value = "Lütfen geçerli bir tarih giriniz.";
        }
      } else {
        hasError.value = true;
        error.value = "Kamera ile gerekli görseli ekleyin.";
      }
    };

    return {
      submitData,
      changeCamera,
      takePhoto,
      toggleCamera,
      //

      //
      currentCamera,
      videoElement1,
      videoElement2,
      canvasElement1,
      canvasElement2,
      photoScreen1,
      photoScreen2,
      photoPng1,
      photoPng2,
      // availableCameras,
      cameras,
      dateInput,
      paymentMethod,
      paymentPrice,
      todayDate,
      //
      error,
      clearInput,
      hasError,
      isPhotoTaken1,
      isPhotoTaken2,
      isCameraOn1,
      isCameraOn2,
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

.openCamera {
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
