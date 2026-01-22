# Git Convention

커밋양식: `태그: 메시지`

- 태그는 소문자로 합니다.

| 태그     | 설명                                  |
| -------- | ------------------------------------- |
| fix      | (버그발생 확인후 ) 버그수정           |
| refactor | 코드 리팩터링                         |
| docs     | 리드미 작성                           |
| chore    | 패키지 설치<br />기능단위가 아닌 작업 |
| init     | 프로젝트 초기셋팅                     |
| hotfix   | 이슈, QA에서 급한 버그수정            |
| remove   | 불필요 코드/파일 삭제                 |
| rename   | 파일 이름 변경                        |
| test     | 테스트파일 관련 작업                  |


# PR Code Review Process

1. PR 생성
2. AI Agent에게 코드리뷰 요청 (e.g. github-copilot, Genmini ...)
3. (2단계) 피드백 반영
4. 휴먼리뷰
5. (4단계) 피드백 반영
6. 이상 없거나 더이상의 피드백이 없다면 Merge


# Git flow

- `main` 브랜치: 서비스 런칭 및 릴리즈
- `develop`: 개발환경
  - 데모데이 이전 default 브랜치
  - 데모데이 이전 개발단계에서 활용 - PR 머지 브랜치에 해당.
