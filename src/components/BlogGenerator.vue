<template>
  <div class="blog-generator">
    <div class="header">
      <h2>🤖 블로그 글 자동 생성</h2>
      <p>AI가 당신의 이미지와 키워드로 매력적인 블로그 포스팅을 작성해드립니다</p>
    </div>

    <div class="status-card">
      <div class="status-item">
        <div class="status-icon">📸</div>
        <div class="status-info">
          <span class="status-label">업로드된 이미지</span>
          <span class="status-value">{{ uploadedImages.length }}개</span>
        </div>
      </div>
      
      <div class="status-item">
        <div class="status-icon">🏷️</div>
        <div class="status-info">
          <span class="status-label">입력된 키워드</span>
          <span class="status-value">{{ keywords.length }}개</span>
        </div>
      </div>
      
      <div v-if="keywords.length > 0" class="keywords-preview">
        <div class="keyword-tags">
          <span v-for="keyword in keywords" :key="keyword" class="keyword-tag">
            {{ keyword }}
          </span>
        </div>
      </div>
    </div>

    <!-- ✅ 이미지 설명 섹션 추가 -->
    <div v-if="uploadedImages.length > 0" class="image-labels-section">
      <h3>📸 이미지 설명 추가 (선택사항)</h3>
      <p class="section-desc">각 이미지에 설명을 추가하면 더 자연스러운 블로그 글이 생성됩니다</p>
      
      <div class="image-labels-grid">
        <div v-for="(image, index) in uploadedImages" :key="index" class="image-label-item">
          <div class="image-preview">
            <img :src="createImageUrl(image)" alt="업로드 이미지">
            <div class="image-number">{{ index + 1 }}</div>
          </div>
          <div class="label-input-wrapper">
            <input 
              :value="imageLabels[index] || ''"
              @input="updateLabel(index, $event.target.value)"
              :placeholder="`사진${index + 1}: 예) 가게 외관, 메뉴판, 음식 사진`"
              class="label-input"
            >
            <div class="label-suggestions">
              <button 
                v-for="suggestion in getSuggestions(index)" 
                :key="suggestion"
                @click="updateLabel(index, suggestion)"
                class="suggestion-btn"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="generate-section">
      <button 
        @click="generateBlog" 
        :disabled="!canGenerate"
        class="generate-btn"
        :class="{ 'generating': isGenerating, 'disabled': !canGenerate }"
      >
        <div class="btn-content">
          <span class="btn-icon">{{ isGenerating ? '🔄' : '🚀' }}</span>
          <span class="btn-text">{{ isGenerating ? '생성 중...' : '블로그 글 생성하기' }}</span>
        </div>
        <div v-if="isGenerating" class="loading-bar"></div>
      </button>
      
      <div v-if="!canGenerate && !isGenerating" class="requirement-notice">
        <div class="notice-icon">💡</div>
        <div class="notice-text">
          <p>블로그 생성을 위해 필요한 항목:</p>
          <ul>
            <li :class="{ 'completed': uploadedImages.length > 0 }">
              이미지 최소 1개 업로드
            </li>
            <li :class="{ 'completed': keywords.length > 0 }">
              키워드 최소 1개 입력
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="generatedPost.title" class="preview-section">
      <div class="preview-header">
        <h3>✨ 생성된 블로그 포스팅</h3>
        <div class="preview-actions">
          <button class="action-btn copy-btn" @click="copyToClipboard">
            📋 복사
          </button>
          <button class="action-btn edit-btn">
            ✏️ 편집
          </button>
          <button class="action-btn save-btn">
            💾 저장
          </button>
        </div>
      </div>
      
      <div class="preview-content">
        <div class="post-title">{{ generatedPost.title }}</div>
        <div class="post-content" v-html="generatedPost.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useBlogStore } from "@/stores/blog";
import { storeToRefs } from "pinia";
import { generateBlogPost } from "@/services/ai";

export default {
  setup() {
    const blogStore = useBlogStore();
    const { uploadedImages, currentPost, keywords, imageLabels } = storeToRefs(blogStore);
    const { updateImageLabel } = blogStore;

    const generatedPost = ref({
      title: "",
      content: "",
    });

    const isGenerating = ref(false);

    const canGenerate = computed(() => {
      return uploadedImages.value.length > 0 && keywords.value.length > 0 && !isGenerating.value;
    });

    // ✅ 이미지 URL 생성
    const createImageUrl = (file) => {
      return URL.createObjectURL(file);
    };

    // ✅ 이미지 라벨 업데이트
    const updateLabel = (index, value) => {
      updateImageLabel(index, value);
    };

    // ✅ 자동 제안 기능
    const getSuggestions = (index) => {
      const suggestions = [
        ['가게 외관', '입구', '간판'],
        ['메뉴판', '가격표', '메뉴'],
        ['음식 사진', '요리', '메인 메뉴'],
        ['내부 인테리어', '분위기', '좌석'],
        ['서비스', '반찬', '부가 메뉴']
      ];
      return suggestions[index] || ['음식 사진', '분위기', '서비스'];
    };

    const generateBlog = async () => {
      isGenerating.value = true;
      
      try {
        console.log("AI 블로그 생성 시작!");
        console.log("이미지 개수:", uploadedImages.value.length);
        console.log("키워드:", keywords.value);
        console.log("이미지 라벨:", imageLabels.value);

        // ✅ 이미지 라벨 정보도 AI에 전달
        const result = await generateBlogPost(
          uploadedImages.value, 
          keywords.value,
          imageLabels.value // 이미지 설명 추가
        );
        
        generatedPost.value = {
          title: result.title,
          content: result.content
        };
        
        console.log("생성 완료!", result);
      } catch (error) {
        console.error("생성 에러:", error);
        alert("블로그 생성 중 오류가 발생했습니다.");
      } finally {
        isGenerating.value = false;
      }
    };

    const copyToClipboard = async () => {
      const text = `${generatedPost.value.title}\n\n${generatedPost.value.content}`;
      try {
        await navigator.clipboard.writeText(text);
        alert('클립보드에 복사되었습니다!');
      } catch (err) {
        console.error('복사 실패:', err);
      }
    };

    return {
      uploadedImages,
      currentPost,
      generatedPost,
      keywords,
      imageLabels,
      canGenerate,
      generateBlog,
      isGenerating,
      copyToClipboard,
      createImageUrl,
      updateLabel,
      getSuggestions
    };
  },
};
</script>

<style scoped>
.blog-generator {
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 2.2em;
  color: #2d3748;
  margin-bottom: 10px;
  font-weight: 700;
}

.header p {
  color: #718096;
  font-size: 1.1em;
  line-height: 1.5;
}

.status-card {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-icon {
  font-size: 2em;
  margin-right: 20px;
  width: 60px;
  text-align: center;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 0.9em;
  color: #718096;
  margin-bottom: 5px;
}

.status-value {
  font-size: 1.4em;
  font-weight: 700;
  color: #2d3748;
}

.keywords-preview {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 100%);
  border-radius: 12px;
  border: 2px solid #b3d9ff;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

.generate-section {
  text-align: center;
  margin-bottom: 40px;
}

.generate-btn {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 20px 50px;
  font-size: 1.2em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  overflow: hidden;
  min-width: 280px;
}

.generate-btn:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
}

.generate-btn.generating {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  cursor: not-allowed;
}

.generate-btn.disabled {
  background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
  cursor: not-allowed;
  box-shadow: 0 4px 12px rgba(203, 213, 224, 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-icon {
  font-size: 1.3em;
  animation: spin 1s linear infinite;
}

.btn-icon:not(.generating) {
  animation: none;
}

.generate-btn.generating .btn-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0%; }
  50% { width: 100%; }
  100% { width: 0%; }
}

.requirement-notice {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(135deg, #fef5e7 0%, #fefcbf 100%);
  border: 2px solid #f6e05e;
  border-radius: 15px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.notice-icon {
  font-size: 1.5em;
}

.notice-text p {
  margin: 0 0 10px 0;
  font-weight: 600;
  color: #744210;
}

.notice-text ul {
  margin: 0;
  padding-left: 20px;
  color: #744210;
}

.notice-text li {
  margin-bottom: 5px;
  transition: all 0.3s;
}

.notice-text li.completed {
  color: #38a169;
  text-decoration: line-through;
}

.preview-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
}

.preview-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  margin: 0;
  font-size: 1.4em;
  font-weight: 700;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.preview-content {
  padding: 30px;
}

.post-title {
  font-size: 1.8em;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #e2e8f0;
  line-height: 1.3;
}

.post-content {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1em;
}

.post-content p {
  margin-bottom: 15px;
}

.post-content h1, .post-content h2, .post-content h3 {
  color: #2d3748;
  margin: 25px 0 15px 0;
  font-weight: 600;
}

.post-content h1 { font-size: 1.6em; }
.post-content h2 { font-size: 1.4em; }
.post-content h3 { font-size: 1.2em; }

/* 이미지 라벨 섹션 스타일 */
.image-labels-section {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.image-labels-section h3 {
  margin: 0 0 10px 0;
  color: #2d3748;
  font-size: 1.3em;
  font-weight: 600;
}

.section-desc {
  color: #718096;
  margin-bottom: 25px;
  font-size: 0.95em;
  line-height: 1.5;
}

.image-labels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.image-label-item {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.image-label-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.image-preview {
  position: relative;
  margin-bottom: 15px;
}

.image-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-number {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9em;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.label-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.label-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.label-input::placeholder {
  color: #a0aec0;
}

.label-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-btn {
  background: linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 100%);
  border: 1px solid #b3d9ff;
  color: #2b6cb0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.3s;
}

.suggestion-btn:hover {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

/* 반응형 */
@media (max-width: 768px) {
  .image-labels-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .image-label-item {
    padding: 15px;
  }
  
  .image-preview img {
    height: 100px;
  }
  
  .label-suggestions {
    gap: 4px;
  }
  
  .suggestion-btn {
    font-size: 0.75em;
    padding: 3px 10px;
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .blog-generator {
    padding: 0 10px;
  }
  
  .header h2 {
    font-size: 1.8em;
  }
  
  .status-card {
    padding: 20px;
  }
  
  .status-item {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
  
  .status-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .generate-btn {
    padding: 18px 30px;
    font-size: 1.1em;
    min-width: 240px;
  }
  
  .preview-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .preview-actions {
    justify-content: center;
  }
  
  .preview-content {
    padding: 20px;
  }
  
  .post-title {
    font-size: 1.5em;
  }
}
</style>