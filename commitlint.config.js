module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'fix', // 버그수정
        'feat', // 기능 추가
        'refactor', // 코드 리팩터링
        'docs', // 리드미 작성
        'chore', // 패키지 설치, 기능단위가 아닌 작업
        'init', // 프로젝트 초기셋팅
        'hotfix', // 이슈, QA에서 급한 버그수정
        'remove', // 불필요 코드/파일 삭제
        'rename', // 파일 이름 변경
        'test', // 테스트파일 관련 작업
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
