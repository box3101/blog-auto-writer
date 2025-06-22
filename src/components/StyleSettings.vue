<template>
    <div class="style-settings">
      <div class="header">
        <h2>💬 말투 설정</h2>
        <p>앨리스님만의 특별한 블로그 말투를 설정해보세요</p>
      </div>
  
      <div class="toggle-section">
        <div class="toggle-card">
          <div class="toggle-info">
            <h3>✨ 앨리스 스타일 사용</h3>
            <p>친근하고 자연스러운 개인 블로거 말투</p>
          </div>
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="writingStyle.enabled"
              @change="updateStyle"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
  
      <div v-if="writingStyle.enabled" class="settings-grid">
        <div class="setting-card">
          <label class="setting-label">
            <span class="label-icon">👋</span>
            <span class="label-text">시작 인사말</span>
          </label>
          <textarea 
            v-model="writingStyle.greeting"
            @input="updateStyle"
            placeholder="안녕하세요 앨리스입니다 :) 오늘 소개해드릴 곳은"
            rows="2"
          ></textarea>
          <small class="hint">블로그 글 시작 부분에 사용될 인사말</small>
        </div>
  
        <div class="setting-card">
          <label class="setting-label">
            <span class="label-icon">👋</span>
            <span class="label-text">마무리 멘트</span>
          </label>
          <textarea 
            v-model="writingStyle.ending"
            @input="updateStyle"
            placeholder="다음에도 더 좋은 맛집으로 찾아뵐게요~"
            rows="2"
          ></textarea>
          <small class="hint">블로그 글 마지막에 사용될 마무리 인사</small>
        </div>
  
        <div class="setting-card">
          <label class="setting-label">
            <span class="label-icon">😊</span>
            <span class="label-text">자주 쓰는 표현</span>
          </label>
          <textarea 
            v-model="writingStyle.expressions"
            @input="updateStyle"
            placeholder="ㅎㅎ, ㅋㅋㅋ, 😊, 진짜, 너무, 정말, 와..., 레알"
            rows="2"
          ></textarea>
          <small class="hint">글에 자연스럽게 포함될 표현들 (쉼표로 구분)</small>
        </div>
  
        <div class="setting-card">
          <label class="setting-label">
            <span class="label-icon">❓</span>
            <span class="label-text">질문 스타일</span>
          </label>
          <textarea 
            v-model="writingStyle.questionStyle"
            @input="updateStyle"
            placeholder="~지 않나요? ~하는 생각이 들었어요~"
            rows="2"
          ></textarea>
          <small class="hint">독자와 소통하는 질문 형태 표현</small>
        </div>
  
        <div class="setting-card full-width">
          <label class="setting-label">
            <span class="label-icon">🎨</span>
            <span class="label-text">전체적인 톤</span>
          </label>
          <textarea 
            v-model="writingStyle.tone"
            @input="updateStyle"
            placeholder="친근하고 밝은 말투로 개인적인 경험처럼"
            rows="2"
          ></textarea>
          <small class="hint">AI가 참고할 전체적인 글쓰기 스타일 설명</small>
        </div>
      </div>
  
      <div v-if="writingStyle.enabled" class="preview-section">
        <h3>📝 미리보기</h3>
        <div class="preview-card">
          <div class="preview-greeting">{{ writingStyle.greeting }}</div>
          <div class="preview-content">
            [키워드 기반 본문 내용이 여기에 들어갑니다]<br>
            정말 좋은 곳이었어요 ㅎㅎ 다들 어떻게 생각하시나요?
          </div>
          <div class="preview-ending">{{ writingStyle.ending }}</div>
        </div>
      </div>
  
      <div class="action-buttons">
        <button class="btn-reset" @click="resetToDefault">
          🔄 기본값으로 초기화
        </button>
        <button class="btn-save" @click="saveSettings">
          💾 설정 저장
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useBlogStore } from '@/stores/blog'
  import { storeToRefs } from 'pinia'
  
  export default {
    setup() {
      const blogStore = useBlogStore()
      const { writingStyle } = storeToRefs(blogStore)
      const { updateWritingStyle } = blogStore
  
      const updateStyle = () => {
        updateWritingStyle(writingStyle.value)
      }
  
      const resetToDefault = () => {
        const defaultStyle = {
          enabled: true,
          greeting: "안녕하세요 앨리스입니다 :) 오늘 소개해드릴 곳은",
          ending: "다음에도 더 좋은 맛집으로 찾아뵐게요~",
          expressions: "ㅎㅎ, ㅋㅋㅋ, 😊, 진짜, 너무, 정말, 와..., 레알",
          questionStyle: "~지 않나요? ~하는 생각이 들었어요~",
          tone: "친근하고 밝은 말투로 개인적인 경험처럼"
        }
        updateWritingStyle(defaultStyle)
        alert('기본값으로 초기화되었습니다!')
      }
  
      const saveSettings = () => {
        // 나중에 localStorage 저장 기능 추가 가능
        alert('설정이 저장되었습니다! ✨')
      }
  
      return {
        writingStyle,
        updateStyle,
        resetToDefault,
        saveSettings
      }
    }
  }
  </script>
  
  <style scoped>
  .style-settings {
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
  }
  
  .toggle-section {
    margin-bottom: 30px;
  }
  
  .toggle-card {
    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  
  .toggle-info h3 {
    margin: 0 0 5px 0;
    color: #2d3748;
    font-size: 1.3em;
    font-weight: 600;
  }
  
  .toggle-info p {
    margin: 0;
    color: #718096;
    font-size: 0.95em;
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e0;
    transition: 0.3s;
    border-radius: 30px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  input:checked + .slider {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  input:checked + .slider:before {
    transform: translateX(30px);
  }
  
  .settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .setting-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
    transition: all 0.3s;
  }
  
  .setting-card:hover {
    border-color: #cbd5e0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  
  .setting-card.full-width {
    grid-column: 1 / -1;
  }
  
  .setting-label {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
    color: #2d3748;
  }
  
  .label-icon {
    font-size: 1.2em;
    margin-right: 8px;
  }
  
  .label-text {
    font-size: 1em;
  }
  
  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s;
    background: #f7fafc;
  }
  
  textarea:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .hint {
    display: block;
    margin-top: 8px;
    color: #718096;
    font-size: 0.85em;
    line-height: 1.4;
  }
  
  .preview-section {
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
    border: 2px solid #b3d9ff;
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 30px;
  }
  
  .preview-section h3 {
    margin: 0 0 15px 0;
    color: #2d3748;
    font-size: 1.2em;
    font-weight: 600;
  }
  
  .preview-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .preview-greeting {
    color: #667eea;
    font-weight: 600;
    margin-bottom: 15px;
    font-size: 1.05em;
  }
  
  .preview-content {
    color: #4a5568;
    line-height: 1.6;
    margin: 15px 0;
    padding: 10px 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .preview-ending {
    color: #667eea;
    font-weight: 600;
    margin-top: 15px;
    font-size: 1.05em;
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  .btn-reset, .btn-save {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 150px;
  }
  
  .btn-reset {
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
  }
  
  .btn-reset:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 101, 101, 0.4);
  }
  
  .btn-save {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  }
  
  .btn-save:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(72, 187, 120, 0.4);
  }
  
  /* 반응형 */
  @media (max-width: 768px) {
    .settings-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .toggle-card {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
    
    .action-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .btn-reset, .btn-save {
      width: 100%;
      max-width: 250px;
    }
  }
  </style>