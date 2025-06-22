<template>
  <div id="app">
    <div class="header">
      <h1>🚀 블로그 자동 작성 도우미</h1>
      <p>AI가 도와주는 스마트한 블로그 포스팅 툴</p>
    </div>
    
    <div class="tabs">
      <button 
        @click="currentTab = 'image'" 
        :class="{ active: currentTab === 'image' }"
        class="tab"
      >
        📸 이미지 업로드
      </button>
      <button 
        @click="currentTab = 'keyword'" 
        :class="{ active: currentTab === 'keyword' }"
        class="tab"
      >
        🏷️ 키워드 입력
      </button>
      <button 
        @click="currentTab = 'style'" 
        :class="{ active: currentTab === 'style' }"
        class="tab"
      >
        💬 말투 설정
      </button>
      <button 
        @click="currentTab = 'generate'" 
        :class="{ active: currentTab === 'generate' }"
        class="tab"
      >
        🤖 글 생성
      </button>
    </div>
    
    <div class="tab-content">
      <ImageUpload v-if="currentTab === 'image'" />
      <KeywordInput v-if="currentTab === 'keyword'" />
      <StyleSettings v-if="currentTab === 'style'" />
      <BlogGenerator v-if="currentTab === 'generate'" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import ImageUpload from "./components/ImageUpload.vue";
import KeywordInput from "./components/KeywordInput.vue";
import StyleSettings from "./components/StyleSettings.vue";
import BlogGenerator from "./components/BlogGenerator.vue";

export default {
  name: "App",
  components: {
    ImageUpload,
    KeywordInput,
    StyleSettings,
    BlogGenerator,
  },
  setup() {
    const currentTab = ref("image");

    return {
      currentTab,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.12);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
}

.header h1 {
  font-size: 2.8em;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  font-weight: 700;
}

.header p {
  opacity: 0.9;
  font-size: 1.2em;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 3px solid #dee2e6;
}

.tab {
  padding: 20px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background: transparent;
  border-bottom: 4px solid transparent;
  font-weight: 600;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  color: #4a5568;
}

.tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.tab:hover::before {
  left: 100%;
}

.tab.active {
  background: white;
  border-bottom-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  font-weight: 700;
}

.tab:hover:not(.active) {
  background: #f8f9fa;
  transform: translateY(-1px);
  color: #2d3748;
}

.tab-content {
  padding: 40px;
  min-height: 500px;
  background: #f8f9fa;
}

/* 4개 탭을 위한 반응형 */
@media (max-width: 1024px) {
  .tabs {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tab {
    font-size: 13px;
    padding: 18px 12px;
  }
}

@media (max-width: 768px) {
  body {
    padding: 10px;
  }
  
  .header {
    padding: 30px 20px;
  }
  
  .header h1 {
    font-size: 2.2em;
  }
  
  .header p {
    font-size: 1em;
  }
  
  .tabs {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tab {
    padding: 15px 10px;
    font-size: 12px;
  }
  
  .tab-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .tabs {
    grid-template-columns: 1fr;
  }
  
  .tab {
    padding: 16px;
    font-size: 14px;
  }
}

/* 전역 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
</style>