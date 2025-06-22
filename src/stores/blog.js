// src/stores/blog.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBlogStore = defineStore("blog", () => {
  const uploadedImages = ref([]);
  const currentPost = ref({ title: "", content: "", images: [] });
  const savedPosts = ref([]);
  const imageLabels = ref([]); // ✅ 이미지 설명 배열 추가

  const keywords = ref([]);
  const maxKeywords = 10;

  const addImage = (file) => {
    uploadedImages.value.push(file);
    imageLabels.value.push(""); // ✅ 빈 라벨도 함께 추가
  };

  const removeImage = (index) => {
    uploadedImages.value.splice(index, 1);
    imageLabels.value.splice(index, 1); // ✅ 라벨도 함께 삭제
  };

  // ✅ 이미지 라벨 업데이트 함수 추가
  const updateImageLabel = (index, label) => {
    if (imageLabels.value[index] !== undefined) {
      imageLabels.value[index] = label;
    }
  };

  // ✅ 모든 이미지 삭제시 라벨도 초기화
  const clearAllImages = () => {
    uploadedImages.value = [];
    imageLabels.value = [];
  };

  const updatePostTitle = (title) => {
    currentPost.value.title = title;
  };

  const saveCurrentPost = () => {
    const postToSave = {
      ...currentPost.value,
      id: Date.now(),
      createdAt: new Date(),
    };
    savedPosts.value.push(postToSave);
  };

  const loadPost = (id) => {
    const post = savedPosts.value.find((p) => p.id === id);
    if (post) {
      currentPost.value = { ...post };
    }
  };

  // ✅ 키워드 관련 함수들 추가
  const addKeyword = (keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed) return false;

    if (keywords.value.includes(trimmed)) {
      alert("이미 추가된 키워드입니다");
      return false;
    }

    if (keywords.value.length >= maxKeywords) {
      alert(`최대 ${maxKeywords}개까지만 추가할 수 있습니다`);
      return false;
    }

    keywords.value.push(trimmed);
    return true;
  };

  const removeKeyword = (index) => {
    keywords.value.splice(index, 1);
  };

  const clearKeywords = () => {
    keywords.value = [];
  };

  // ✅ 앨리스 스타일 설정 추가
  const writingStyle = ref({
    enabled: true, // 앨리스 스타일 사용 여부
    greeting: "안녕하세요 앨리스입니다 :) 오늘 소개해드릴 곳은",
    ending: "다음에도 더 좋은 맛집으로 찾아뵐게요~",
    expressions: "ㅎㅎ, ㅋㅋㅋ, 😊, 진짜, 너무, 정말, 와..., 레알",
    questionStyle: "~지 않나요? ~하는 생각이 들었어요~",
    tone: "친근하고 밝은 말투로 개인적인 경험처럼",
  });

  const updateWritingStyle = (newStyle) => {
    writingStyle.value = { ...writingStyle.value, ...newStyle };
  };

  return {
    uploadedImages,
    imageLabels,
    currentPost,
    savedPosts,
    keywords,
    writingStyle,
    addImage,
    removeImage,
    updateImageLabel,
    clearAllImages,
    updatePostTitle,
    saveCurrentPost,
    loadPost,
    addKeyword,
    removeKeyword,
    clearKeywords,
    updateWritingStyle,
  };
});
