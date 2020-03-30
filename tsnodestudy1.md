# 이것저것 매모장

- 노드는 자바스크립트 런타임(자바스크립트 실행기)
- 노드는 타입스크립트를 실행할 수 없음
- 타입스크립트를 자바스크립트로 변환해서 노드로 실행해야함
- 디노는 타입스크립트 런타임
- pm2, forever 도구를 사용해서 서버가 죽었을 때 되살림
- 하지만 코드가 잘못되었을 땐 해결책이 아님
- 타입스크립트를 적용해서 서버를 만들면 코드 부분에서 간단한 에러들 또는 자주 발생하는 에러를 미리 검사할 수 있기 때문에 서버가 매우 안정적임
  - 제로초/ts-nodebird
- @types/... 모듈들은 타입이 지정되어 있는 애들
- 타입스크립트로 짠 코드를 실행할 때 자바스크립트로 변경하고 실행해야하는데 그럴 필요없이 ts-node 를 사용해서 바로 실행 가능하게 할 수 있음(내부적으로 js로 컴파일 후 실행하는 것)
- npx란 글로벌 패키지를 사용하지 않고 디펜던시로 설치한 다음에 npx 명령을 사용하면 마치 글로벌 명령어처럼 사용이 가능함
- 개발용 환경이라면 ts-node 를 사용하고 배포용 환경이면 npx tsc 를 이용해서 자바스크립트 파일로 변경 후 배포
- babel 로 최신 문법을 노드에서 사용하게 해주지만 배포용 때는 컴파일 후 자바스크립트 파일로 함
- tsc --traceResolution 명령어를 사용해서 컴파일하면 타이핑을 어떻게 찾는지 로그를 통해 알 수 있음
- @types/... 와 일반 모듈의 버전을 맞추는 것도 중요, 메이저 버전을 맞춰야함
- package.json script start 를 보통 tsc, node index.js 로 함

## 서버 만들기

- npm init -y
- tsc --init
- package.json, tsconfig.json
- touch index.ts
- npm i express, @types/express
- "\* as" => export default 가 없으면 써줘야함, export default가 있다면 없어도 됨
-

## tsconfig

- moduleResolution: node
- strict: true
- lib: [2015,2016, ... 2020]
- esModuleInterop: true or false => true 라면 \* as 사용할 필요가 없음

## sequelize

- npm i sequelize
- npm i sequelize-cli
- sequelize init
- 맨 처음 만들어진 config 폴더에 config.json을 config.js 로 변경 후 작업 sequelize-cli 가 ts 를 인식 못함
- sequelize db:create
- 초기 작업이 끝나면 ts 로 변경

process.env 에 대해서 알아보기
index.d.ts 알아보기
