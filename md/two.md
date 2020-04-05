# 2020-04-05

- 기존 모델(클래스 또는 객체)를 확장할 때 인터페이스를 만들고 extends 한 후 원하는 속성을 확장할 수 있음
- 확장한 인터페이스를 어디다가 두냐? 한 번만 쓰이는 인터페이스는 사용되는 곳 코드 상위에 쓰고 만약 재사용 될 때 ./types 로 옮기고 export 를 붙여 수출한다.
- sequelize Model hasMany, belongsToMany 알아보기
- sequelize Model BelongsToManyGetAssociationsMixin
