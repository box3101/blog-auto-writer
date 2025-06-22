const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

export const generateBlogPost = async (images, keywords, imageLabels = []) => {
  // 앨리스 스타일 가져오기
  const writingStyle = {
    greeting: "안녕하세요 앨리스입니다 :) 오늘 소개해드릴 곳은",
    ending: "다음에도 더 좋은 맛집으로 찾아뵐게요~",
    expressions: [
      "ㅎㅎ",
      "ㅋㅋㅋ",
      "😊",
      "진짜",
      "너무",
      "정말",
      "와...",
    ],
    questionStyle: "~지 않나요? ~하는 생각이 들었어요~",
  };
  const imageInfo = images
    .map((img, index) => {
      const label = imageLabels[index] || `사진${index + 1}`;
      return `[${label}]`;
    })
    .join(", ");
  const prompt = `
네이버 블로그 포스팅을 앨리스 스타일로 작성해주세요.

**기본 정보:**
- 키워드: ${keywords.join(", ")}
- 업로드된 이미지: ${images.length}개
- 이미지 설명: ${imageInfo}

**앨리스 스타일 특징:**
- 시작: "안녕하세요 앨리스입니다 :) 오늘 소개해드릴 곳은"
- 표현: ${writingStyle.expressions.join(", ")}
- 질문형: ${writingStyle.questionStyle}
- 마무리: "다음에도 더 좋은 맛집으로 찾아뵐게요~"

**네이버 블로그 형식:**
1. 제목: [${keywords[0] || "키워드"}] 포함한 매력적인 제목
2. 볼드 처리: **중요한 내용**은 굵게
3. 이미지 위치 표시: ${imageInfo} 순서대로 본문에 자연스럽게 배치
4. 해시태그: 마지막에 #태그 5-7개

**구조:**
- 앨리스 인사말
- [${imageLabels[0] || "첫 번째 사진"}] 관련 내용
- 첫인상/분위기 묘사
- [${imageLabels[1] || "두 번째 사진"}] 관련 내용  
- 메뉴/가격/서비스 정보
- [${imageLabels[2] || "세 번째 사진"}] 관련 내용
- 맛/경험 후기
- 추천 포인트
- 마무리 + 해시태그

개인적이고 솔직한 경험담으로 자연스럽게 작성해주세요.
`;

  try {
    const response = await fetch("/api/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000, // ✅ 더 긴 글을 위해 증가
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.type === "error") {
      console.error("Claude API 에러:", data.error);
      return {
        title: "API 에러",
        content: `에러: ${data.error.message}`,
      };
    }

    const generatedText = data.content[0].text;

    // 제목 추출 (첫 줄이 제목)
    const lines = generatedText.split("\n");
    const title =
      lines[0].replace(/^제목:\s*/, "").replace(/^#\s*/, "") ||
      `${keywords[0]} 후기`;

    // 본문 (제목 제외한 나머지)
    const content = lines.slice(1).join("\n").trim();

    return {
      title: title,
      content: content,
    };
  } catch (error) {
    console.error("API 호출 에러:", error);
    return {
      title: "에러 발생",
      content: "블로그 생성 중 오류가 발생했습니다.",
    };
  }
};
