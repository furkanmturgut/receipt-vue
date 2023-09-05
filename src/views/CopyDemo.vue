<template>
  <div>
    <h1>Toggle Menu</h1>
    <TfToggleButtonView v-model="isMenuOpen">
      Aç/Kapat
    </TfToggleButtonView>
    <div v-if="isMenuOpen">
      <form @submit.prevent="submitData">
      <div id="fatura">
        <h1 style="text-align: center;">Fatura</h1>
        <video
          ref="videoElement"
          style="display: none"
          id="video"
          autoplay
        ></video>
        <TfButtonView
          v-if="!isCameraOn || isPhotoTaken"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          "
          @click="requestCameraAccess"
          >Kamerayı aç</TfButtonView
        >
        <TfButtonView
          v-else
          @click="takePhoto"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          "
          >📸</TfButtonView
        >
        <canvas ref="canvasElement" style="display: none"></canvas>
        <img
          v-if="isPhotoTaken"
          :src="photoScreen"
          id="video"
          alt="Çekilen Fotoğraf"
        />
      </div>
      <input style="width: auto; height: 2rem;" type="date" />
      <TfButtonView type="submit" label="Kaydet" />
    </form>
    </div>
  </div>
</template>

<script>
import {
  getStorage,
  ref as FBref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref } from "vue";
export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();
    const videoElement = ref(null);
    const canvasElement = ref(null);
    const photoPng = ref(null);
    const photoScreen = ref(null);
    const isCameraOn = ref(false);
    const isPhotoTaken = ref(false);
    const isMenuOpen = ref(false);
    let cameraStream = null;

    const requestCameraAccess = async () => {
      try {
        isPhotoTaken.value = false;
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoElement.value.srcObject = cameraStream;
        videoElement.value.style.display = "block";
        videoElement.value.play();
        isCameraOn.value = true;
      } catch (error) {
        console.error("Kamera hatası:", error);
      }
    };

    const takePhoto = () => {
      if (!cameraStream) return;
      isPhotoTaken.value = false;

      const context = canvasElement.value.getContext("2d");
      canvasElement.value.width = videoElement.value.videoWidth;
      canvasElement.value.height = videoElement.value.videoHeight;
      context.drawImage(
        videoElement.value,
        0,
        0,
        canvasElement.value.width,
        canvasElement.value.height
      );
      const imageData = canvasElement.value.toDataURL("image/png");
      photoScreen.value = imageData;

      canvasElement.value.toBlob((blob) => {
        if (blob) photoPng.value = blob;
      }, "image/png");
      isPhotoTaken.value = true;

      videoElement.value.pause();
      videoElement.value.style.display = "none";
      isCameraOn.value = false;
    };

    const submitData = async () => {
      if (photoPng.value) {
        const id = Date.now();
        const storageRef = FBref(storage, `slips/${id}`);
        const fileSnapshot = await uploadBytes(storageRef, photoPng.value);
        const downloadURL = await getDownloadURL(fileSnapshot.ref);

        try {
          const docRef = addDoc(collection(db, "slips"), {
            uploadDate: serverTimestamp(),
            receiptDate: "",
            slipUrl: downloadURL,
            fisUrl: "",
            id: auth.currentUser.uid,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.log(e);
        }
      } else {
        alert("Kayıt yapılmadı");
      }
    };

    return {
      submitData,
      requestCameraAccess,
      takePhoto,
      //
      videoElement,
      canvasElement,
      photoPng,
      photoScreen,
      //
      isCameraOn,
      isPhotoTaken,
      isMenuOpen,
    };
  },
};
</script>

<style>
#cameraDiv,
form,
#fatura {
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;
}
#video {
  max-height: 300px;
}
#card {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>

