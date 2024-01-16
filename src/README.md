// 바인딩 표현식 처리
// 표현식의 예시
// 기본형: ${name}
// 기본값: ${name || tom}
// 배열: ${items[0]}
// 배열의 속성: ${items[4].name}
// 포멧: ${date:yy-MM-dd}, day.js 사용
// 포멧과 기본값: ${date:yy-MM-dd || 2020-01-01}
// 숫자포멧: ${number:0,0.00}
// 숫자포멧과 기본값: ${number:0,0.00 || 0}
// 배열과 포멧: ${items[0]:yy-MM-dd}
