<template>
  <h3 style="display: flex; justify-content: center">Fiş Ekleme</h3>
  <div class="container">
    <form @submit.prevent="submitData">
      <div id="fatura">
        <h1 style="text-align: center">Fatura</h1>
        <video ref="videoElement1" class="videoCam" style="display: none" id="video1" autoplay></video>
        <TfButtonView v-if="!isCameraOn1 || isPhotoTaken1" class="openCamera1" @click="requestCameraAccess1" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">Kamerayı aç</TfButtonView>
        <TfButtonView v-else @click="takePhoto1" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">📸</TfButtonView>
        <canvas ref="canvasElement1" style="display: none"></canvas>
        <img v-if="isPhotoTaken1" :src="photoScreen1" id="video" alt="Çekilen Fotoğraf" class="videoCam" />
      </div>
      <!-- FATURA/SLİP -->
      <!-- FATURA/SLİP -->
      <!-- FATURA/SLİP -->
      <div class="slip">
        <h1 style="text-align: center">Slip</h1>
        <video class="videoCam" id="video2" ref="videoElement2" style="display: none" autoplay />
        <TfButtonView v-if="!isCameraOn2 || isPhotoTaken2" class="openCamera2" @click="requestCameraAccess2" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">Kamerayı aç</TfButtonView>
        <TfButtonView v-else @click="takePhoto2" style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          ">📸</TfButtonView>
        <canvas ref="canvasElement2" style="display: none"></canvas>
        <img v-if="isPhotoTaken2" :src="photoScreen2" class="videoCam" id="video" alt="Çekilen Fotoğraf" />
      </div>
      <!-- SLİP/TARİH -->
      <!-- SLİP/TARİH -->
      <!-- SLİP/TARİH -->
      <h1 style="text-align: center">Fatura Tarihi</h1>
      <TfInputView :class="{ 'p-invalid': !dateInput }" type="date" v-model="dateInput"
        style="width: auto; height: 2rem" />
      <!-- TARİH/TUTAR -->
      <!-- TARİH/TUTAR -->
      <!-- TARİH/TUTAR -->
      <h1 style="text-align: center">Tutar</h1>

      <TfInputView :class="{ 'p-invalid': !paymentPrice }" type="number" style="width: auto; height: 2rem"
        v-model="paymentPrice" placeholder="Ödeme Tutarı (TL)" />

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
      <TfButtonView style="text-transform: uppercase; font-size: large" type="submit" label="Kaydet" />
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
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();
    const videoElement1 = ref(null);
    const videoElement2 = ref(null);
    const canvasElement1 = ref(null);
    const canvasElement2 = ref(null);
    const photoPng1 = ref(null);
    const photoPng2 = ref(null);
    const dateInput = ref(null);
    const paymentPrice = ref(null);
    const photoScreen1 = ref(null);
    const photoScreen2 = ref(null);
    const isCameraOn1 = ref(false);
    const isCameraOn2 = ref(false);
    const isPhotoTaken1 = ref(false);
    const isPhotoTaken2 = ref(false);
    const paymentMethod = ref(null);
    const router = useRouter();
    let cameraStream1 = null;
    let cameraStream2 = null;
    const newArrayList = ref([]);



    const requestCameraAccess1 = async () => {
      try {
        isPhotoTaken1.value = false;
        cameraStream1 = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoElement1.value.srcObject = cameraStream1;
        videoElement1.value.style.display = "block";
        videoElement1.value.play();
        isCameraOn1.value = true;
      } catch (error) {
        console.error("Kamera hatası:", error);
      }
    };

    const takePhoto1 = () => {
      if (!cameraStream1) return;
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

      videoElement1.value.pause();
      videoElement1.value.style.display = "none";
      isCameraOn1.value = false;
    };

    const stopCamera1 = () => {
      if (cameraStream1) {
        cameraStream1.getTracks().forEach((track) => {
          track.stop();
        });
        videoElement1.value.srcObject = null;
        videoElement1.value.style.display = "none";
      }
    };

    const requestCameraAccess2 = async () => {
      try {
        isPhotoTaken2.value = false;
        cameraStream2 = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoElement2.value.srcObject = cameraStream2;
        videoElement2.value.style.display = "block";
        videoElement2.value.play();
        isCameraOn2.value = true;
      } catch (error) {
        console.error("Kamera hatası:", error);
      }
    };

    const takePhoto2 = () => {
      if (!cameraStream2) return;
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

      videoElement2.value.pause();
      videoElement2.value.style.display = "none";
      isCameraOn2.value = false;
    };

    const stopCamera2 = () => {
      if (cameraStream2) {
        cameraStream2.getTracks().forEach((track) => {
          track.stop();
        });
        videoElement2.value.srcObject = null;
        videoElement2.value.style.display = "none";
      }
    };
    const submitData = async () => {
      if (
        photoPng1.value &&
        photoPng2.value &&
        dateInput.value &&
        paymentPrice.value &&
        paymentMethod.value

      ) {
        try {
          const id = Date.now();
          const storageRef = FBref(storage, `infos/${id}`);
          const storageRef2 = FBref(storage, `receipt/${id}`);
          const fileSnapshot1 = await uploadBytes(storageRef, photoPng1.value);
          const fileSnapshot2 = await uploadBytes(storageRef2, photoPng2.value);
          const downloadURL1 = await getDownloadURL(fileSnapshot1.ref);
          const downloadURL2 = await getDownloadURL(fileSnapshot2.ref);
          const random = Math.floor(Math.random() * 100000);
          stopCamera1();
          stopCamera2();

          const cN = query(collection(db, "companyInfo"), where("id", "==", auth.currentUser.uid));
          const querySnapshot1 = await getDocs(cN);
          querySnapshot1.forEach((doc) => {
            newArrayList.value.push(doc.data());
            //console.log(newArrayList)

          });




          addDoc(collection(db, "infos"), {
            id: auth.currentUser.uid,
            //companyName: newArrayList.companyName,
            slipsId: random,
            uploadDate: serverTimestamp(),
            receiptDate: dateInput.value,
            bilUrl: downloadURL1,
            slipsUrl: downloadURL2,
            price: paymentPrice.value,
            paymentMethod: paymentMethod.value,
          });

          router.push({ name: "HomeView" });
        } catch (e) {
          alert(e);

          console.log(e);
        }
      } else {
        alert("Verileriniz eksik, kayıt yapılmadı");
      }
    };

    return {
      submitData,
      requestCameraAccess1,
      requestCameraAccess2,
      takePhoto1,
      takePhoto2,
      stopCamera1,
      stopCamera2,
      //
      videoElement1,
      videoElement2,
      canvasElement1,
      canvasElement2,
      photoScreen1,
      photoScreen2,
      photoPng1,
      photoPng2,
      dateInput,
      paymentMethod,
      paymentPrice,
      //
      isCameraOn1,
      isCameraOn2,
      isPhotoTaken1,
      isPhotoTaken2,
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
  min-width: 400px;
}

.openCamera2 {
  min-width: 400px;
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
