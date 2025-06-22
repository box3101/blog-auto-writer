<template>
  <div>
    <input
      v-model="inputValue"
      @keypress="handleKeyPress"
      placeholder="키워드 입력 후 Enter (최대 10개)"
    />

    <div class="keywords">
      <span v-for="(keyword, index) in keywords" :key="index" class="tag">
        {{ keyword }}
        <button @click="removeKeyword(index)">×</button>
      </span>
    </div>

    <div>키워드: {{ keywords.length }}/10</div>
    <button @click="clearAllKeywords">전체 삭제</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useBlogStore } from "@/stores/blog";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const blogStore = useBlogStore();
    const { keywords } = storeToRefs(blogStore);
    const { addKeyword, removeKeyword, clearKeywords } = blogStore;

    const inputValue = ref("");

    const addKeywordFromInput = () => {
      const success = addKeyword(inputValue.value);
      if (success) {
        inputValue.value = ""; // 성공시에만 입력창 비우기
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        addKeywordFromInput();
      }
    };

    return {
      keywords,
      inputValue,
      addKeywordFromInput,
      handleKeyPress,
      removeKeyword,
      clearKeywords,
    };
  },
};
</script>

<style scoped>
.keywords {
  margin: 10px 0;
}

.tag {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 5px 10px;
  margin: 3px;
  border-radius: 20px;
  font-size: 14px;
}

.tag button {
  background: none;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
}

.tag button:hover {
  color: #ff6b6b;
}
</style>
