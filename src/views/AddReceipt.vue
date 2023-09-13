<template>
  <div class="container">
    <form @submit.prevent="submitData">
      <div id="fatura">
        <h1  style="text-align: center">Fatura</h1>
        <video ref="videoElement1" class="videoCam" style="display: none" id="video1" autoplay></video>
        <TfButtonView v-if="!isCameraOn1 || isPhotoTaken1" class="openCamera1" @click="requestCameraAccess(0)">Kamerayı aç
        </TfButtonView>
        <TfButtonView id="takePhotoBtn1" v-else @click="takePhoto(0)" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">📸</TfButtonView>
        <!-- Kamera seç  -->
        <TfDropdownView id="chooseCamera1" v-if="!(!isCameraOn1 || isPhotoTaken1)" v-model="currentCamera"
          :options="availableCameras" optionValue="deviceId" optionLabel="label" @change="changeCamera(0)">
        </TfDropdownView>
        <canvas ref="canvasElement1" style="display: none"></canvas>
        <img v-if="isPhotoTaken1" :src="photoScreen1" id="video" alt="Çekilen Fotoğraf" class="videoCam" />
      </div>
      <!-- FATURA/SLİP -->
      <!-- FATURA/SLİP -->
      <!-- FATURA/SLİP -->
      <div class="slip">
        <h1 style="text-align: center">Slip</h1>
        <video class="videoCam" id="video2" ref="videoElement2" style="display: none" autoplay />
        <TfButtonView v-if="!isCameraOn2 || isPhotoTaken2" class="openCamera2" @click="requestCameraAccess(1)" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">Kamerayı aç</TfButtonView>
        <TfButtonView id="takePhotoBtn2" v-else @click="takePhoto(1)" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">📸</TfButtonView>
        <TfDropdownView v-if="!(!isCameraOn2 || isPhotoTaken2)" v-model="currentCamera" :options="availableCameras"
          optionValue="deviceId" optionLabel="label" @change="changeCamera(1)" id="chooseCamera2"></TfDropdownView>
        <canvas ref="canvasElement2" style="display: none"></canvas>
        <img v-if="isPhotoTaken2" :src="photoScreen2" class="videoCam" id="video" alt="Çekilen Fotoğraf" />
      </div>
      <!-- SLİP/TARİH -->
      <!-- SLİP/TARİH -->
      <!-- SLİP/TARİH -->
      <h1 style="text-align: center">Fatura Tarihi</h1>

      <TfInputView type="date" v-model="dateInput" :max="todayDate" min="2000-01-01" style="width: auto; height: 2rem"
        @focus="clearInput" onkeydown="return false" />
      <!-- TARİH/TUTAR -->
      <!-- TARİH/TUTAR -->
      <!-- TARİH/TUTAR -->
      <h1 style="text-align: center">Tutar</h1>

      <TfInputView v-model="paymentPrice" type="number" placeholder="Ödeme Tutarı (TL)" @focus="clearInput" />

      <!-- TUTAR/ÖDEME ŞEKLİ -->
      <!-- TUTAR/ÖDEME ŞEKLİ -->
      <h1 style="text-align: center">Ödeme Şekli</h1>
      <div style="flex-wrap: wrap; justify-content: center; column-gap: 25px" class="flex">
        <div class="flex align-items-center">
          <TfRadioView v-model="paymentMethod" name="kart" value="kart" />
          <label for="kart" style="font-size: 1.5rem; font-weight: bold" class="ml-2">Kart</label>
        </div>
        <div class="flex align-items-center">
          <TfRadioView v-model="paymentMethod" name="nakit" value="nakit" />
          <label for="nakit" style="font-size: 1.5rem; font-weight: bold" class="ml-2">Nakit</label>
        </div>
      </div>
      <!-- OdemeSekli//Kaydet Buton -->
      <TfButtonView style="text-transform: uppercase; font-size: large " type="submit" label="Kaydet"  />
      <TfInlineMessage v-if="hasError">{{ error }}</TfInlineMessage>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    const storage = getStorage();
    const videoElement1 = ref(null);
    const videoElement2 = ref(null);
    const canvasElement1 = ref(null);
    const canvasElement2 = ref(null);
    const photoPng1 = ref(null);
    const photoPng2 = ref(null);
    const photoScreen1 = ref(null);
    const photoScreen2 = ref(null);

    const availableCameras = ref([]);
    const currentCamera = ref(null);
    const cameraStream1 = ref(null);
    const cameraStream2 = ref(null);
    const isCameraOn1 = ref(false);
    const isCameraOn2 = ref(false);
    const isPhotoTaken1 = ref(false);
    const isPhotoTaken2 = ref(false);
    const dateInput = ref(null);
    const paymentPrice = ref(null);
    const paymentMethod = ref(null);
    const dateRegex = /^\d{4}\-\d{2}\-\d{2}$/;
    const hasError = ref(false);
    const error = ref(null);

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
      availableCameras.value = await getAvailableCameras();
      currentCamera.value = availableCameras.value[0].deviceId;
    });

    const getAvailableCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameraList = devices.filter((d) => d.kind == "videoinput");
      console.log("cameraList", cameraList);
     
  
      return cameraList;
    };

    const requestCameraAccess = async (type) => {
      try {
        if (type == 0) {
          getAvailableCameras();
          cameraStream1.value = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: currentCamera.value }, //Buraya selectedDevice gelecek
          });
          videoElement1.value.srcObject = cameraStream1.value;
          videoElement1.value.style.display = "block";
          if (isPhotoTaken1.value) {
            videoElement1.value.play();
          }
          isPhotoTaken1.value = false;
          isCameraOn1.value = true;
          const targetElement = document.querySelector("#video1");
          if (targetElement)
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        } else if (type == 1) {
          cameraStream2.value = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: currentCamera.value },
          });
          videoElement2.value.srcObject = cameraStream2.value;
          videoElement2.value.style.display = "block";
          isPhotoTaken2.value = false;
          if (isPhotoTaken2.value) {
            videoElement2.value.play();
          }
          isCameraOn2.value = true;
          const targetElement = document.querySelector("#video2");
          if (targetElement)
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }
      } catch (error) {
        console.error("Kamera hatası:", error);
      }
    };

    const takePhoto = (type) => {
      if (!cameraStream1.value && !cameraStream2.value) return;
      if (type == 0) {
        isPhotoTaken1.value = false;

        const context = canvasElement1.value.getContext("2d");
        canvasElement1.value.width = videoElement1.value.videoWidth;
        canvasElement1.value.height = videoElement1.value.videoHeight;
        context.drawImage(
          videoElement1.value,
          0,
          0,
          canvasElement1.value.width,
          canvasElement1.value.height
        );
        const imageData = canvasElement1.value.toDataURL("image/jpeg");
        photoScreen1.value = imageData;

        canvasElement1.value.toBlob((blob) => {
          if (blob) photoPng1.value = blob;
        }, "image/jpeg");
        isPhotoTaken1.value = true;

        stopCamera(0);
        isCameraOn1.value = false;
      } else if (type == 1) {
        isPhotoTaken2.value = false;

        const context = canvasElement2.value.getContext("2d");
        canvasElement2.value.width = videoElement2.value.videoWidth;
        canvasElement2.value.height = videoElement2.value.videoHeight;
        context.drawImage(
          videoElement2.value,
          0,
          0,
          canvasElement2.value.width,
          canvasElement2.value.height
        );
        const imageData = canvasElement2.value.toDataURL("image/png");
        photoScreen2.value = imageData;

        canvasElement2.value.toBlob((blob) => {
          if (blob) photoPng2.value = blob;
        }, "image/png");
        isPhotoTaken2.value = true;
        stopCamera(1);
        isCameraOn2.value = false;
      }
    };

    const stopCamera = (type) => {
      if (cameraStream1.value || cameraStream2.value) {
        if (type == 0) {
          cameraStream1.value.getTracks().forEach((track) => {
            track.stop();
          });
          videoElement1.value.srcObject = null;
          videoElement1.value.style.display = "none";
        } else if (type == 1) {
          cameraStream2.value.getTracks().forEach((track) => {
            track.stop();
          });
          videoElement2.value.srcObject = null;
          videoElement2.value.style.display = "none";
        }
      }
    };

    const changeCamera = async (type) => {
      if (type == 0) {
        stopCamera(0);
        await requestCameraAccess(0);
        console.log("New deviceId", currentCamera);
      } else if (type == 1) {
        stopCamera(1);
        await requestCameraAccess(1);
        console.log("New deviceId", currentCamera);
      }
    };

    const submitData = async () => {
      if (photoPng1.value && photoPng2.value) {
        if (dateRegex.test(dateInput.value)) {
          const payment = paymentPrice.value;
          if (!Math.floor(payment / 10 ** 9)) {
            if (paymentMethod.value != null) {
              try {
                const id = Date.now();
                const storageRef1 = FBref(storage, `infos/${id}`);
                const storageRef2 = FBref(storage, `receipt/${id}`);
                const fileSnapshot1 = await uploadBytes(
                  storageRef1,
                  photoPng1.value
                );
                const fileSnapshot2 = await uploadBytes(
                  storageRef2,
                  photoPng2.value
                );
                const downloadURL1 = await getDownloadURL(fileSnapshot1.ref);
                const downloadURL2 = await getDownloadURL(fileSnapshot2.ref);
                const random = Math.floor(Math.random() * 100000);
                stopCamera(0);
                stopCamera(1);

                addDoc(collection(db, "infos"), {
                  id: auth.currentUser.uid,
                  slipsId: random,
                  bilUrl: downloadURL1,
                  slipsUrl: downloadURL2,
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
      } else {
        hasError.value = true;
        error.value = "Kamera ile gerekli görselleri ekleyin.";
      }
    };

    return {
      requestCameraAccess,
      getAvailableCameras,
      changeCamera,
      stopCamera,
      takePhoto,
      submitData,
      //
      videoElement1,
      videoElement2,
      canvasElement1,
      canvasElement2,
      photoScreen1,
      photoScreen2,
      photoPng1,
      photoPng2,
      //
      currentCamera,
      availableCameras,
      dateInput,
      paymentMethod,
      paymentPrice,
      //
      isCameraOn1,
      isCameraOn2,
      isPhotoTaken1,
      isPhotoTaken2,
      //
      hasError,
      error,
      clearInput,
      //
      todayDate,
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
