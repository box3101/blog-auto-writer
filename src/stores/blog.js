import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog',()=>{
    // A) 업로드된 이미지 파일들
    const uploadedImages = ref([])
  
    // D) 생성된 블로그 글 내용  
    const currentPost = ref({
      title: '',
      content: '',
      images: []
    })
    
    // F) 저장된 포스팅 히스토리
    const savedPosts = ref([])
    
    return {
      uploadedImages,
      currentPost,
      savedPosts
    }
})