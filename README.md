# Next.js FSD Achitecture
이 프로젝트는 FSD 아키텍쳐가 포함된 로그인 회원가입 예제입니다.

Next.js와 서버간 통신을 **중앙화**하여 (**클라이언트** <-> **Next.js 서버** <-> **API 서버**)의 통신 구조를 가집니다.

API서버에서 받은 토큰을 httpOnly쿠키로 가공하여 로그인시 클라이언트에 보내줍니다.

만약 Next.js 서버와 API서버간 통신 중, 토큰이 만료된다면, axios 인터셉터를 이용해 토큰을 자동으로 재발급 합니다.