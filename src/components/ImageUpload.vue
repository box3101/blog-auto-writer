<template>
    <div>
      <input type="file" @change="handleFileUpload" multiple />
      <div>업로드된 이미지: {{ uploadedImages.length }}개</div>
      <div v-for="(image, index) in uploadedImages" :key="index">
        <img :src="createImageUrl(image)" alt="업로드 이미지" style="width: 200px; height: 150px; object-fit: cover; margin: 10px;" />
        <button @click="removeImage(index)">삭제</button>
      </div>
      <button @click="clearAllImages">모든 이미지 삭제</button>
    </div>
  </template>
  
  <script>
  import { useBlogStore } from "@/stores/blog";
  import { storeToRefs } from "pinia";
  
  export default {
    setup() {
      const blogStore = useBlogStore();
      const { uploadedImages } = storeToRefs(blogStore);
      const { addImage, removeImage } = blogStore;
  
      const handleFileUpload = (event) => {
        const files = event.target.files;
        for (let file of files) {
          addImage(file);
        }
      };
  
      const clearAllImages = () => {
        uploadedImages.value = [];
      };
  
      // ✅ 이 함수 추가!
      const createImageUrl = (file) => {
        return URL.createObjectURL(file);
      };
  
      return { 
        uploadedImages, 
        addImage, 
        removeImage, 
        handleFileUpload, 
        clearAllImages,
        createImageUrl  // ✅ 이것도 추가!
      };
    },
  };
  </script>