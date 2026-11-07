/*
  마음별 사이트 설정
  ------------------------------------------------------------------
  web3formsKey : 상담 신청과 ASK 질문을 메일로 받기 위한 Web3Forms Access Key
                 (https://web3forms.com 에서 hyebiu4@gmail.com 을 넣고 받은 키)
                 비워 두면 상담 신청 버튼이 꺼진 상태로 보여요.
  ownerName    : 첫 화면과 ASK 답변에 보일 내 이름(닉네임). 비우면 "마음별 운영자"
  ownerIntro   : 첫 화면에 보일 한 줄 소개
  sns          : 바닥글에 보일 SNS 주소. https:// 로 시작하는 주소를 넣으면 아이콘이 생겨요.
  firebase     : 질문함 새 질문 알림(메뉴 옆 숫자)용. Firebase 콘솔 › 프로젝트 설정 › 내 앱(웹)에서
                 보이는 firebaseConfig 값을 그대로 옮겨 넣어요. 비워 두면 질문은 메일로만 와요.
                 설정 방법: 질문함-알림-설정.md
*/
window.MAUMBYEOL_CONFIG = {
  web3formsKey: "e82dbcd2-e277-4184-9b34-e347631974ff",
  ownerName: "",
  ownerIntro: "",
  sns: {
    x: "",
    instagram: "",
    youtube: "",
    blog: ""
  },
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
  }
};
