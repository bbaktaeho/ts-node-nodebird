# 2020-04-04

cannot read porperty of ...
타입스크립트를 도입했을 때 안정적
타입스크립트는 에디터의 도움을 받는게 좋음
노드가 ts 를 직접 실행 못해서 한 번 컴파일(트랜스파일)을 해줘야함(ts-node)
import \* as ... from 은 export default 가 없을 때 이렇게 해야함
esModuleInterop : true 라면 \* as 안해도 됨
익스프레스는 express-serve-static-core 의 코어를 임포트해와서 타이핑을 함
타입스크립트를 자바스크립트를 변경 후 노드가 실행을 시킴, ts-node 를 사용해서 바로 실행시키게 해보자
배포용에선 tsc 를 활용해서 미리 자바스크립트로 바꿔놓고 배포함
tsc 는 tsconfig.json 설정을 보고 동작함
tsc --traceresolution 은 타이핑을 찾는 순서를 로그로 찍어줌
@types/... 모듈들을 devdepend?
sequelize-cli 는 sequelize 명령어를 사용하기 위한 모듈
sequelize init 하면 모델, 씨더, 컨피그 폴더가 생성되고 기본적인 코드가 작성되있다
sequelize 는 내부적으로 타입을 지원하기 때문에 타입 설치를 안해줘도 된다
순환 참조시 두 모듈 중 하나가 빈 객체로 처리되어 문제가 발생
process.env는 타입 추론이 안됨
namespace와 interface 는 직접 확장할 수 있음 -> declaration merging!
tsc 는 모듈에 있는 모든 ts 파일을 모두 컴파일 해서 타이핑을 찾는다. 근데 강제적으로 tscconfig.json 에서 files 에 경로를 적으면 그 파일만 컴파일한다. 그 파일에 임포트 하는 애들까지 포함해서 컴파일한다.
tsconfig.json 에 typeRoot 가 없다면 노드 모듈에 있는 tpyes의 모든 타입들을 가져옴. typeRoot 를 지정했다해서 모듈에 있는 타입을 안가져오는 것은 아니고 임포트 되어있으면 가져옴. 여기서 compilerOptions.typeRoot 와 files의 차이는 모든 ts 파일에 대해서 컴파일을 하냐 마냐고 typeRoot는 타이핑을 가져오냐 마냐를 결정한다.
go to definition을 사용하자~
