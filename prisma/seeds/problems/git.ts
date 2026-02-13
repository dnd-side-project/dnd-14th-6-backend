// =============================================================
// Problem Seed Data - Git (categoryId: 1)
// 총 330개 (10 subCategories × 33 problems)
// 각 subCategory당 33개 (EASY:11, NORMAL:11, HARD:11)
// =============================================================
// subCategoryId 매핑:
// Commit:1, Branch:2, Remote:3, Undo:4, Config:5,
// Merge:6, Rebase:7, Stash:8, Tag:9, Log:10
// =============================================================

export interface ProblemSeedData {
  difficulty: string;
  title: string;
  text: string;
  answer: string;
  explanation: string;
  categoryId: number;
  subCategoryId: number;
}

export const problems: ProblemSeedData[] = [
  // =============================================
  // Git > Commit (categoryId: 1, subCategoryId: 1)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: 'Git 저장소 초기화',
    text: '현재 디렉토리를 Git 저장소로 초기화하는 명령어는?',
    answer: 'git init',
    explanation: '`git init`은 현재 디렉토리에 `.git` 폴더를 생성하여 Git 저장소로 초기화합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '스테이징 영역에 파일 추가',
    text: '`index.html` 파일을 스테이징 영역에 추가하는 명령어는?',
    answer: 'git add index.html',
    explanation:
      '`git add index.html`은 해당 파일을 스테이징 영역에 추가하여 다음 커밋에 포함되도록 준비합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '모든 변경사항 스테이징',
    text: '작업 디렉토리의 모든 변경된 파일을 스테이징 영역에 추가하는 명령어는?',
    answer: 'git add .',
    explanation:
      '`git add .`은 현재 디렉토리 이하의 모든 변경사항(새 파일, 수정, 삭제)을 스테이징 영역에 추가합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '커밋 메시지와 함께 커밋',
    text: '스테이징된 변경사항을 "first commit" 메시지와 함께 커밋하는 명령어는?',
    answer: 'git commit -m "first commit"',
    explanation:
      '`git commit -m "first commit"`은 스테이징 영역의 변경사항을 지정한 메시지와 함께 커밋합니다. `-m` 옵션을 사용하면 에디터를 열지 않고 인라인으로 메시지를 작성할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '워킹 디렉토리 상태 확인',
    text: '현재 워킹 디렉토리의 상태(변경된 파일, 스테이징 여부 등)를 확인하는 명령어는?',
    answer: 'git status',
    explanation:
      '`git status`는 워킹 디렉토리와 스테이징 영역의 상태를 보여줍니다. 어떤 파일이 수정되었고, 어떤 파일이 스테이징되었는지 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '변경사항 비교',
    text: '워킹 디렉토리의 변경사항과 스테이징 영역의 차이를 확인하는 명령어는?',
    answer: 'git diff',
    explanation:
      '`git diff`는 아직 스테이징되지 않은 워킹 디렉토리의 변경사항을 보여줍니다. 파일의 어떤 부분이 추가되거나 삭제되었는지 라인 단위로 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '특정 확장자 파일 스테이징',
    text: '현재 디렉토리의 모든 `.js` 파일을 스테이징 영역에 추가하는 명령어는?',
    answer: 'git add *.js',
    explanation:
      '`git add *.js`는 와일드카드 패턴을 사용하여 현재 디렉토리의 모든 `.js` 확장자 파일을 스테이징 영역에 추가합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '스테이징된 변경사항 확인',
    text: '스테이징 영역에 추가된 변경사항과 마지막 커밋의 차이를 확인하는 명령어는?',
    answer: 'git diff --staged',
    explanation:
      '`git diff --staged`는 스테이징 영역에 있는 변경사항과 마지막 커밋을 비교하여 보여줍니다. 커밋 전에 어떤 내용이 포함될지 최종 확인할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '파일 삭제 후 스테이징',
    text: '`temp.txt` 파일을 워킹 디렉토리와 Git 추적 대상에서 모두 삭제하는 명령어는?',
    answer: 'git rm temp.txt',
    explanation:
      '`git rm temp.txt`는 파일을 워킹 디렉토리에서 삭제하고, 해당 삭제를 자동으로 스테이징 영역에 기록합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '파일 이름 변경',
    text: '`old.txt` 파일의 이름을 `new.txt`로 변경하는 Git 명령어는?',
    answer: 'git mv old.txt new.txt',
    explanation:
      '`git mv old.txt new.txt`는 파일 이름을 변경하고 해당 변경사항을 자동으로 스테이징합니다. `mv` + `git add` + `git rm`을 한 번에 수행하는 것과 같습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'EASY',
    title: '빈 커밋 생성',
    text: '파일 변경 없이 "initial commit" 메시지로 빈 커밋을 생성하는 명령어는?',
    answer: 'git commit --allow-empty -m "initial commit"',
    explanation:
      '`git commit --allow-empty -m "initial commit"`은 변경사항이 없어도 커밋을 생성합니다. CI/CD 트리거나 프로젝트 시작점 표시에 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: 'add와 commit 동시 실행',
    text: '이미 추적 중인 파일의 변경사항을 스테이징과 커밋을 동시에 "update" 메시지로 수행하는 명령어는?',
    answer: 'git commit -am "update"',
    explanation:
      '`git commit -am "update"`에서 `-a` 옵션은 이미 추적 중인(tracked) 파일의 변경사항을 자동으로 스테이징하고, `-m`은 커밋 메시지를 지정합니다. 단, 새로 생성된 파일(untracked)은 포함되지 않습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '마지막 커밋 메시지 수정',
    text: '마지막 커밋의 메시지를 "fix typo"로 수정하는 명령어는?',
    answer: 'git commit --amend -m "fix typo"',
    explanation:
      '`git commit --amend -m "fix typo"`는 마지막 커밋의 메시지를 새 메시지로 교체합니다. `--amend` 옵션은 새 커밋을 생성하지 않고 기존 커밋을 수정합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 파일만 커밋',
    text: '`app.js` 파일만 "fix bug" 메시지로 스테이징 없이 바로 커밋하는 명령어는?',
    answer: 'git commit -m "fix bug" app.js',
    explanation:
      '`git commit -m "fix bug" app.js`는 지정된 파일만 직접 커밋합니다. 별도의 `git add` 없이 추적 중인 파일을 바로 커밋할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '인터랙티브 스테이징',
    text: '파일의 변경사항을 부분적으로(hunk 단위) 선택하여 스테이징하는 명령어는?',
    answer: 'git add -p',
    explanation:
      '`git add -p`(또는 `--patch`)는 각 변경 블록(hunk)을 하나씩 보여주며 스테이징 여부를 선택할 수 있게 합니다. 하나의 파일에서 일부 변경만 커밋하고 싶을 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '스테이징 취소',
    text: '`style.css` 파일을 스테이징 영역에서 제거(언스테이지)하되, 워킹 디렉토리의 변경은 유지하는 명령어는?',
    answer: 'git restore --staged style.css',
    explanation:
      '`git restore --staged style.css`는 스테이징 영역에서 해당 파일을 제거하지만, 워킹 디렉토리의 변경사항은 그대로 유지합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: 'Git 추적에서만 제거',
    text: '`config.env` 파일을 Git 추적 대상에서는 제거하되, 워킹 디렉토리에는 파일을 남기는 명령어는?',
    answer: 'git rm --cached config.env',
    explanation:
      '`git rm --cached config.env`는 Git의 추적 대상에서만 파일을 제거합니다. 실제 파일은 삭제되지 않으며, `.gitignore`에 추가하여 이후 추적을 방지할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 커밋의 변경 내용 확인',
    text: '커밋 해시 `a1b2c3d`의 변경 내용을 상세히 확인하는 명령어는?',
    answer: 'git show a1b2c3d',
    explanation:
      '`git show a1b2c3d`는 해당 커밋의 메타 정보(작성자, 날짜, 메시지)와 함께 변경된 파일의 diff를 보여줍니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '디렉토리 단위 스테이징',
    text: '`src/` 디렉토리 내의 모든 변경사항을 스테이징하는 명령어는?',
    answer: 'git add src/',
    explanation:
      '`git add src/`는 `src` 디렉토리 하위의 모든 파일 변경사항(새 파일, 수정, 삭제)을 재귀적으로 스테이징합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '커밋 간 변경 파일 목록',
    text: '마지막 커밋에서 변경된 파일 이름만 목록으로 확인하는 명령어는?',
    answer: 'git diff --name-only HEAD~1',
    explanation:
      '`git diff --name-only HEAD~1`은 현재 HEAD와 직전 커밋(HEAD~1) 사이에서 변경된 파일의 이름만 출력합니다. diff 내용 없이 파일 목록만 빠르게 확인할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '워킹 디렉토리 변경 취소',
    text: '`index.html` 파일의 워킹 디렉토리 변경사항을 마지막 커밋 상태로 되돌리는 명령어는?',
    answer: 'git restore index.html',
    explanation:
      '`git restore index.html`은 워킹 디렉토리의 변경사항을 버리고 마지막 커밋 상태로 파일을 복원합니다. 스테이징되지 않은 변경사항만 되돌립니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'NORMAL',
    title: '마지막 커밋에 파일 추가',
    text: '스테이징된 `utils.js` 파일을 마지막 커밋에 추가하되, 커밋 메시지는 변경하지 않는 명령어는?',
    answer: 'git commit --amend --no-edit',
    explanation:
      '`git commit --amend --no-edit`은 현재 스테이징된 변경사항을 마지막 커밋에 포함시키면서 커밋 메시지는 그대로 유지합니다. 커밋 직후 빠뜨린 파일을 추가할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: '커밋 날짜 변경',
    text: '마지막 커밋의 작성 날짜를 "2024-01-01T00:00:00"으로 변경하여 amend하는 명령어는?',
    answer: 'git commit --amend --date="2024-01-01T00:00:00" --no-edit',
    explanation:
      '`--date` 옵션은 커밋의 Author Date를 지정한 날짜로 변경합니다. `--amend`와 함께 사용하여 마지막 커밋의 날짜를 수정할 수 있으며, `--no-edit`으로 메시지는 유지합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '특정 커밋의 파일 내용 보기',
    text: '커밋 `a1b2c3d` 시점의 `src/app.js` 파일 내용을 확인하는 명령어는?',
    answer: 'git show a1b2c3d:src/app.js',
    explanation:
      '`git show <commit>:<path>` 형식으로 특정 커밋 시점의 파일 내용을 확인할 수 있습니다. 파일의 과거 상태를 복원하지 않고 내용만 볼 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '커밋 통계 요약',
    text: '마지막 3개 커밋의 변경 통계(파일별 추가/삭제 라인 수)를 요약하여 보는 명령어는?',
    answer: 'git diff --stat HEAD~3',
    explanation:
      '`git diff --stat HEAD~3`는 현재 HEAD부터 3개 전 커밋까지의 변경사항을 파일별 추가/삭제 라인 수로 요약하여 보여줍니다. 전체적인 변경 규모를 파악할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '의도적 변경 표시 스테이징',
    text: '삭제된 파일을 포함하지 않고, 새 파일과 수정된 파일만 스테이징하는 명령어는?',
    answer: 'git add --no-all .',
    explanation:
      '`git add --no-all .`은 새로 추가된 파일과 수정된 파일만 스테이징하고, 삭제된 파일은 스테이징하지 않습니다. 삭제 변경사항을 별도로 관리하고 싶을 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: 'GPG 서명 커밋',
    text: '스테이징된 변경사항을 "signed release" 메시지와 함께 GPG 서명하여 커밋하는 명령어는?',
    answer: 'git commit -S -m "signed release"',
    explanation:
      '`git commit -S -m "signed release"`에서 `-S` 옵션은 GPG 키로 커밋에 서명합니다. 서명된 커밋은 작성자의 신원을 암호학적으로 검증할 수 있어 보안이 중요한 프로젝트에서 사용됩니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '특정 파일의 커밋 이력',
    text: '`src/main.js` 파일이 변경된 커밋만 필터링하여 각 커밋의 diff와 함께 보는 명령어는?',
    answer: 'git log -p -- src/main.js',
    explanation:
      '`git log -p -- src/main.js`는 해당 파일이 변경된 커밋만 필터링하고, 각 커밋에서의 파일 변경 내용(patch)을 함께 출력합니다. `--`는 파일 경로와 옵션을 명확히 구분합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '커밋 작성자 변경',
    text: '마지막 커밋의 작성자를 "John <john@example.com>"으로 변경하는 명령어는?',
    answer: 'git commit --amend --author="John <john@example.com>" --no-edit',
    explanation:
      '`--author` 옵션은 커밋의 작성자 정보를 변경합니다. `--amend`와 함께 사용하여 마지막 커밋의 작성자를 수정할 수 있으며, `--no-edit`으로 메시지는 유지합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '두 커밋 간 변경사항 비교',
    text: '커밋 `abc1234`와 `def5678` 사이의 `src/` 디렉토리 변경사항만 비교하는 명령어는?',
    answer: 'git diff abc1234 def5678 -- src/',
    explanation:
      '`git diff <commit1> <commit2> -- <path>` 형식으로 두 커밋 간 특정 경로의 변경사항만 필터링하여 비교할 수 있습니다. `--` 뒤에 경로를 지정하여 범위를 제한합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '단어 단위 diff',
    text: '스테이징된 변경사항을 라인 단위가 아닌 단어 단위로 비교하는 명령어는?',
    answer: 'git diff --staged --word-diff',
    explanation:
      '`git diff --staged --word-diff`는 스테이징된 변경사항을 단어 단위로 비교합니다. 라인 전체가 아닌 변경된 단어만 하이라이트하여 보여주므로, 문장 일부만 수정된 경우 변경 지점을 정확히 파악할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: '특정 라인 범위 blame',
    text: '`app.js` 파일의 10번째부터 20번째 라인까지 각 라인을 마지막으로 수정한 커밋 정보를 확인하는 명령어는?',
    answer: 'git blame -L 10,20 app.js',
    explanation:
      '`git blame -L 10,20 app.js`는 지정된 라인 범위(10~20)에 대해 각 라인을 마지막으로 수정한 커밋 해시, 작성자, 날짜 정보를 보여줍니다. 특정 코드 영역의 변경 이력을 추적할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  {
    difficulty: 'HARD',
    title: 'fixup 커밋 생성',
    text: '커밋 `a1b2c3d`를 나중에 자동 squash할 목적으로 fixup 커밋을 생성하는 명령어는?',
    answer: 'git commit --fixup=a1b2c3d',
    explanation:
      '`git commit --fixup=a1b2c3d`는 지정된 커밋에 대한 fixup 커밋을 생성합니다. 나중에 `git rebase -i --autosquash`를 실행하면 fixup 커밋이 자동으로 해당 커밋과 합쳐집니다.',
    categoryId: 1,
    subCategoryId: 1,
  },
  // =============================================
  // Git > Branch (categoryId: 1, subCategoryId: 2)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '브랜치 목록 확인',
    text: '로컬 브랜치 목록을 확인하는 명령어는?',
    answer: 'git branch',
    explanation:
      '`git branch`는 로컬에 존재하는 모든 브랜치를 나열하며, 현재 브랜치 앞에 `*` 표시를 합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '새 브랜치 생성',
    text: '`feature` 이름의 새 브랜치를 생성하는 명령어는? (이동하지 않음)',
    answer: 'git branch feature',
    explanation:
      '`git branch feature`는 현재 커밋을 기반으로 `feature` 브랜치를 생성하지만, 현재 브랜치에서 이동하지는 않습니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '브랜치 이동',
    text: '`develop` 브랜치로 이동하는 명령어는?',
    answer: 'git checkout develop',
    explanation:
      '`git checkout develop`은 워킹 디렉토리를 `develop` 브랜치의 최신 상태로 전환합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: 'switch로 브랜치 이동',
    text: '`git switch` 명령어를 사용하여 `main` 브랜치로 이동하는 명령어는?',
    answer: 'git switch main',
    explanation:
      '`git switch main`은 Git 2.23에서 도입된 명령어로, `git checkout`보다 브랜치 전환 의도를 명확하게 표현합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '브랜치 생성 후 이동',
    text: '`hotfix` 브랜치를 새로 생성하고 바로 해당 브랜치로 이동하는 명령어는?',
    answer: 'git checkout -b hotfix',
    explanation:
      '`git checkout -b hotfix`는 새 브랜치를 생성하고 동시에 해당 브랜치로 전환합니다. `git branch hotfix` + `git checkout hotfix`를 한 번에 수행합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '브랜치 삭제',
    text: '이미 병합 완료된 `feature` 브랜치를 삭제하는 명령어는?',
    answer: 'git branch -d feature',
    explanation:
      '`git branch -d feature`는 현재 브랜치에 이미 병합된 브랜치를 삭제합니다. `-d`는 안전한 삭제로, 병합되지 않은 브랜치는 삭제를 거부합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '원격 브랜치 목록 확인',
    text: '원격 저장소의 브랜치 목록을 포함하여 모든 브랜치를 확인하는 명령어는?',
    answer: 'git branch -a',
    explanation:
      '`git branch -a`는 로컬 브랜치와 원격 추적 브랜치를 모두 표시합니다. 원격 브랜치는 `remotes/origin/` 접두사로 표시됩니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '현재 브랜치 확인',
    text: '현재 체크아웃된 브랜치 이름만 출력하는 명령어는?',
    answer: 'git branch --show-current',
    explanation: '`git branch --show-current`는 현재 체크아웃된 브랜치 이름만 간결하게 출력합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: 'switch로 브랜치 생성 후 이동',
    text: '`git switch` 명령어를 사용하여 `release` 브랜치를 생성하고 바로 이동하는 명령어는?',
    answer: 'git switch -c release',
    explanation:
      '`git switch -c release`는 새 브랜치를 생성하고 전환합니다. `-c`는 `--create`의 약자입니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '브랜치 강제 삭제',
    text: '병합되지 않은 `experiment` 브랜치를 강제로 삭제하는 명령어는?',
    answer: 'git branch -D experiment',
    explanation:
      '`git branch -D experiment`는 병합 여부와 관계없이 브랜치를 강제 삭제합니다. `-D`는 `--delete --force`의 약자입니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'EASY',
    title: '원격 브랜치만 확인',
    text: '원격 추적 브랜치만 목록으로 확인하는 명령어는?',
    answer: 'git branch -r',
    explanation:
      '`git branch -r`은 원격 추적 브랜치(remote-tracking branches)만 표시합니다. `origin/main`, `origin/develop` 등의 형태로 출력됩니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: '브랜치 이름 변경',
    text: '현재 브랜치의 이름을 `new-feature`로 변경하는 명령어는?',
    answer: 'git branch -m new-feature',
    explanation:
      '`git branch -m new-feature`는 현재 체크아웃된 브랜치의 이름을 변경합니다. `-m`은 `--move`의 약자입니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 커밋에서 브랜치 생성',
    text: '커밋 `a1b2c3d`를 기반으로 `bugfix` 브랜치를 생성하는 명령어는?',
    answer: 'git branch bugfix a1b2c3d',
    explanation:
      '`git branch bugfix a1b2c3d`는 지정된 커밋을 시작점으로 새 브랜치를 생성합니다. 현재 HEAD가 아닌 과거 커밋에서 브랜치를 분기할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '병합된 브랜치 목록',
    text: '현재 브랜치에 이미 병합된 브랜치 목록을 확인하는 명령어는?',
    answer: 'git branch --merged',
    explanation:
      '`git branch --merged`는 현재 브랜치에 이미 병합된 브랜치를 나열합니다. 삭제해도 안전한 브랜치를 식별할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '병합되지 않은 브랜치 목록',
    text: '현재 브랜치에 아직 병합되지 않은 브랜치 목록을 확인하는 명령어는?',
    answer: 'git branch --no-merged',
    explanation:
      '`git branch --no-merged`는 현재 브랜치에 아직 병합되지 않은 브랜치를 나열합니다. 작업이 진행 중인 브랜치를 확인할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '원격 브랜치 추적 설정',
    text: '현재 로컬 브랜치가 `origin/develop` 원격 브랜치를 추적하도록 설정하는 명령어는?',
    answer: 'git branch --set-upstream-to=origin/develop',
    explanation:
      '`git branch --set-upstream-to=origin/develop`는 현재 브랜치의 업스트림을 설정합니다. 이후 `git pull`이나 `git push`를 인자 없이 사용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '브랜치 상세 정보',
    text: '각 브랜치의 마지막 커밋 정보와 업스트림 추적 상태를 함께 보는 명령어는?',
    answer: 'git branch -vv',
    explanation:
      '`git branch -vv`는 각 브랜치의 마지막 커밋 해시, 메시지, 업스트림 브랜치와의 ahead/behind 상태를 상세히 보여줍니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '원격 브랜치 삭제',
    text: '원격 저장소 `origin`에서 `feature/old` 브랜치를 삭제하는 명령어는?',
    answer: 'git push origin --delete feature/old',
    explanation:
      '`git push origin --delete feature/old`는 원격 저장소에서 해당 브랜치를 삭제합니다. 로컬 브랜치는 별도로 삭제해야 합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '다른 브랜치 이름 변경',
    text: '`old-name` 브랜치의 이름을 `new-name`으로 변경하는 명령어는?',
    answer: 'git branch -m old-name new-name',
    explanation:
      '`git branch -m old-name new-name`은 현재 체크아웃되지 않은 브랜치의 이름도 변경할 수 있습니다. 첫 번째 인자가 원래 이름, 두 번째가 새 이름입니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '원격 브랜치 체크아웃',
    text: '원격의 `origin/feature/api` 브랜치를 로컬에 `feature/api`로 체크아웃하는 명령어는?',
    answer: 'git checkout -b feature/api origin/feature/api',
    explanation:
      '`git checkout -b feature/api origin/feature/api`는 원격 브랜치를 기반으로 동일한 이름의 로컬 브랜치를 생성하고 체크아웃합니다. 자동으로 업스트림 추적이 설정됩니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '브랜치 포함 커밋 확인',
    text: '커밋 `a1b2c3d`를 포함하고 있는 브랜치 목록을 확인하는 명령어는?',
    answer: 'git branch --contains a1b2c3d',
    explanation:
      '`git branch --contains a1b2c3d`는 해당 커밋이 포함된(도달 가능한) 모든 브랜치를 나열합니다. 특정 변경사항이 어떤 브랜치에 반영되었는지 확인할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'NORMAL',
    title: '삭제된 원격 브랜치 정리',
    text: '원격에서 이미 삭제된 브랜치의 로컬 추적 참조를 정리하는 명령어는?',
    answer: 'git remote prune origin',
    explanation:
      '`git remote prune origin`은 원격 저장소에서 이미 삭제된 브랜치에 대한 로컬의 원격 추적 참조(stale references)를 제거합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: '고아 브랜치 생성',
    text: '기존 커밋 이력 없이 완전히 새로운 시작점의 `docs` 고아 브랜치를 생성하는 명령어는?',
    answer: 'git checkout --orphan docs',
    explanation:
      '`git checkout --orphan docs`는 부모 커밋이 없는 새 브랜치를 생성합니다. GitHub Pages의 `gh-pages` 브랜치처럼 기존 프로젝트와 독립적인 이력이 필요할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '브랜치 정렬 출력',
    text: '브랜치 목록을 최근 커밋 날짜 순(최신 먼저)으로 정렬하여 출력하는 명령어는?',
    answer: 'git branch --sort=-committerdate',
    explanation:
      '`git branch --sort=-committerdate`는 커밋 날짜 기준 내림차순으로 브랜치를 정렬합니다. `-` 접두사가 내림차순을 의미하며, 최근에 작업한 브랜치를 빠르게 찾을 수 있습니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '브랜치 포인터 강제 이동',
    text: '`main` 브랜치의 포인터를 커밋 `a1b2c3d`로 강제 이동시키는 명령어는?',
    answer: 'git branch -f main a1b2c3d',
    explanation:
      '`git branch -f main a1b2c3d`는 `main` 브랜치 포인터를 지정된 커밋으로 강제 이동합니다. `-f`(force) 옵션은 기존 브랜치의 위치를 덮어씁니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '브랜치 커스텀 포맷 출력',
    text: '모든 브랜치를 "브랜치명 - 마지막커밋해시 - 커밋메시지" 형식으로 출력하는 명령어는?',
    answer: 'git branch --format="%(refname:short) - %(objectname:short) - %(subject)"',
    explanation:
      '`--format` 옵션은 `for-each-ref`의 포맷 문법을 사용하여 브랜치 정보를 커스텀 형식으로 출력합니다. `%(refname:short)`는 브랜치명, `%(objectname:short)`는 커밋 해시, `%(subject)`는 커밋 메시지입니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: 'worktree로 브랜치 동시 작업',
    text: '`feature` 브랜치를 `../feature-work` 경로에 별도 워킹 트리로 체크아웃하는 명령어는?',
    answer: 'git worktree add ../feature-work feature',
    explanation:
      '`git worktree add ../feature-work feature`는 하나의 저장소에서 여러 브랜치를 동시에 체크아웃할 수 있게 합니다. 브랜치 전환 없이 여러 브랜치를 동시에 작업할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '업스트림 추적 해제',
    text: '현재 브랜치의 업스트림 추적 설정을 해제하는 명령어는?',
    answer: 'git branch --unset-upstream',
    explanation:
      '`git branch --unset-upstream`은 현재 브랜치의 원격 추적 설정을 제거합니다. 이후 `git push`나 `git pull` 시 원격 브랜치를 명시적으로 지정해야 합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '패턴으로 브랜치 삭제',
    text: '`feature/`로 시작하는 이미 병합된 모든 로컬 브랜치를 한 번에 삭제하는 명령어는?',
    answer: 'git branch --merged | grep "feature/" | xargs git branch -d',
    explanation:
      '`git branch --merged`로 병합된 브랜치를 나열하고, `grep "feature/"`로 패턴을 필터링한 후, `xargs git branch -d`로 각 브랜치를 삭제합니다. 파이프라인을 활용한 일괄 삭제 방법입니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: 'reflog으로 삭제된 브랜치 복구',
    text: '실수로 삭제한 브랜치의 마지막 커밋이 `a1b2c3d`일 때, `recovered` 브랜치로 복구하는 명령어는?',
    answer: 'git branch recovered a1b2c3d',
    explanation:
      '삭제된 브랜치의 커밋은 즉시 삭제되지 않고 reflog에 남아있습니다. `git reflog`로 커밋 해시를 찾은 후, `git branch recovered a1b2c3d`로 해당 커밋에 새 브랜치를 생성하면 복구됩니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '특정 브랜치의 커밋 수 확인',
    text: '`main` 브랜치에는 없고 `feature` 브랜치에만 있는 커밋 수를 확인하는 명령어는?',
    answer: 'git rev-list --count main..feature',
    explanation:
      '`git rev-list --count main..feature`는 `main`에서 `feature`까지의 범위에서 `main`에 포함되지 않은 커밋 수를 계산합니다. 브랜치가 main 대비 얼마나 앞서있는지 파악할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '브랜치 분기점 찾기',
    text: '`feature` 브랜치가 `main` 브랜치에서 분기된 커밋을 찾는 명령어는?',
    answer: 'git merge-base main feature',
    explanation:
      '`git merge-base main feature`는 두 브랜치의 공통 조상(분기점)이 되는 커밋 해시를 출력합니다. 브랜치가 어디서 갈라졌는지 확인하거나 rebase 범위를 결정할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  {
    difficulty: 'HARD',
    title: '브랜치 이름 강제 변경',
    text: '이미 존재하는 `release` 브랜치 이름을 무시하고 현재 브랜치를 `release`로 강제 이름 변경하는 명령어는?',
    answer: 'git branch -M release',
    explanation:
      '`git branch -M release`는 동일한 이름의 브랜치가 이미 존재해도 강제로 이름을 변경합니다. `-M`은 `--move --force`의 약자입니다. 기존 `release` 브랜치는 덮어써집니다.',
    categoryId: 1,
    subCategoryId: 2,
  },
  // =============================================
  // Git > Remote (categoryId: 1, subCategoryId: 3)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '원격 저장소 추가',
    text: '`https://github.com/user/repo.git` URL을 `origin`이라는 이름으로 원격 저장소에 추가하는 명령어는?',
    answer: 'git remote add origin https://github.com/user/repo.git',
    explanation:
      '`git remote add origin <url>`은 원격 저장소를 `origin`이라는 별칭으로 등록합니다. `origin`은 관례적으로 기본 원격 저장소에 사용되는 이름입니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '원격 저장소 목록 확인',
    text: '등록된 원격 저장소의 이름과 URL을 확인하는 명령어는?',
    answer: 'git remote -v',
    explanation: '`git remote -v`는 등록된 모든 원격 저장소의 이름과 fetch/push URL을 표시합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '원격 저장소에 푸시',
    text: '로컬 `main` 브랜치를 `origin` 원격 저장소에 푸시하는 명령어는?',
    answer: 'git push origin main',
    explanation:
      '`git push origin main`은 로컬 `main` 브랜치의 커밋을 `origin` 원격 저장소의 `main` 브랜치에 업로드합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '원격 저장소에서 가져오기',
    text: '`origin` 원격 저장소의 변경사항을 가져오되 병합하지 않는 명령어는?',
    answer: 'git fetch origin',
    explanation:
      '`git fetch origin`은 원격 저장소의 최신 데이터를 다운로드하지만, 로컬 브랜치에 자동으로 병합하지 않습니다. 변경사항을 확인한 후 수동으로 병합할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '원격 변경사항 가져와서 병합',
    text: '`origin`의 `main` 브랜치에서 변경사항을 가져와 현재 브랜치에 병합하는 명령어는?',
    answer: 'git pull origin main',
    explanation:
      '`git pull origin main`은 `git fetch origin main` + `git merge origin/main`을 한 번에 수행합니다. 원격 브랜치의 최신 변경사항을 다운로드하고 현재 브랜치에 병합합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '저장소 복제',
    text: '`https://github.com/user/repo.git` 저장소를 로컬에 복제하는 명령어는?',
    answer: 'git clone https://github.com/user/repo.git',
    explanation:
      '`git clone`은 원격 저장소의 전체 이력을 포함하여 로컬에 복사합니다. 자동으로 `origin` 원격 저장소가 설정됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '원격 저장소 이름 확인',
    text: '등록된 원격 저장소의 이름만 확인하는 명령어는?',
    answer: 'git remote',
    explanation: '`git remote`는 등록된 원격 저장소의 이름(별칭)만 간단히 나열합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '모든 원격 저장소에서 fetch',
    text: '등록된 모든 원격 저장소에서 최신 데이터를 가져오는 명령어는?',
    answer: 'git fetch --all',
    explanation:
      '`git fetch --all`은 등록된 모든 원격 저장소에서 최신 데이터를 가져옵니다. 여러 원격 저장소를 사용하는 경우 유용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '업스트림 설정과 함께 푸시',
    text: '`feature` 브랜치를 `origin`에 처음 푸시하면서 업스트림 추적을 설정하는 명령어는?',
    answer: 'git push -u origin feature',
    explanation:
      '`git push -u origin feature`에서 `-u`(또는 `--set-upstream`)는 로컬 브랜치가 원격 브랜치를 추적하도록 설정합니다. 이후 `git push`만으로 푸시할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '원격 저장소 삭제',
    text: '등록된 `upstream` 원격 저장소를 제거하는 명령어는?',
    answer: 'git remote remove upstream',
    explanation:
      '`git remote remove upstream`은 등록된 원격 저장소 참조를 삭제합니다. 원격 저장소 자체는 삭제되지 않으며, 로컬 설정에서만 제거됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'EASY',
    title: '특정 디렉토리에 클론',
    text: '`https://github.com/user/repo.git` 저장소를 `my-project` 디렉토리에 복제하는 명령어는?',
    answer: 'git clone https://github.com/user/repo.git my-project',
    explanation:
      '`git clone <url> <directory>`는 지정한 디렉토리 이름으로 저장소를 복제합니다. 디렉토리가 존재하지 않으면 자동으로 생성됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: '원격 저장소 URL 변경',
    text: '`origin`의 URL을 `https://github.com/user/new-repo.git`로 변경하는 명령어는?',
    answer: 'git remote set-url origin https://github.com/user/new-repo.git',
    explanation:
      '`git remote set-url`은 기존 원격 저장소의 URL을 변경합니다. 저장소 이전이나 HTTPS에서 SSH로 전환할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '원격 저장소 상세 정보',
    text: '`origin` 원격 저장소의 상세 정보(URL, 추적 브랜치 등)를 확인하는 명령어는?',
    answer: 'git remote show origin',
    explanation:
      '`git remote show origin`은 원격 저장소의 fetch/push URL, 추적 중인 브랜치, 로컬 브랜치와의 관계 등 상세한 정보를 표시합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '강제 푸시',
    text: '로컬 `main` 브랜치를 `origin`에 강제로 푸시하되, 다른 사람의 작업을 덮어쓰지 않도록 안전하게 수행하는 명령어는?',
    answer: 'git push --force-with-lease origin main',
    explanation:
      '`--force-with-lease`는 원격 브랜치가 마지막 fetch 이후 변경되지 않은 경우에만 강제 푸시합니다. 단순 `--force`보다 안전하게 히스토리를 다시 쓸 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '원격 저장소 이름 변경',
    text: '원격 저장소 `origin`의 이름을 `upstream`으로 변경하는 명령어는?',
    answer: 'git remote rename origin upstream',
    explanation:
      '`git remote rename origin upstream`은 원격 저장소의 별칭을 변경합니다. 관련 추적 브랜치의 이름도 자동으로 업데이트됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 브랜치만 클론',
    text: '`https://github.com/user/repo.git`의 `develop` 브랜치만 복제하는 명령어는?',
    answer: 'git clone -b develop https://github.com/user/repo.git',
    explanation:
      '`git clone -b develop`은 지정된 브랜치를 체크아웃한 상태로 클론합니다. `-b` 옵션은 `--branch`의 약자입니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: 'pull을 rebase 방식으로',
    text: '`origin/main`의 변경사항을 가져와 merge 대신 rebase 방식으로 현재 브랜치에 적용하는 명령어는?',
    answer: 'git pull --rebase origin main',
    explanation:
      '`git pull --rebase`는 원격 변경사항을 가져온 후, 로컬 커밋을 원격 커밋 위에 재적용합니다. merge 커밋 없이 깨끗한 히스토리를 유지할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '모든 브랜치 푸시',
    text: '로컬의 모든 브랜치를 `origin`에 한 번에 푸시하는 명령어는?',
    answer: 'git push origin --all',
    explanation:
      '`git push origin --all`은 로컬에 있는 모든 브랜치를 원격 저장소에 푸시합니다. 전체 브랜치를 동기화할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: 'fetch 후 삭제된 브랜치 정리',
    text: '`origin`에서 fetch하면서 원격에서 삭제된 브랜치의 로컬 추적 참조도 함께 정리하는 명령어는?',
    answer: 'git fetch origin --prune',
    explanation:
      '`git fetch origin --prune`은 원격에서 삭제된 브랜치에 대한 로컬의 원격 추적 참조를 자동으로 제거합니다. 오래된 참조가 쌓이는 것을 방지합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 포함 푸시',
    text: '로컬의 모든 태그를 `origin`에 푸시하는 명령어는?',
    answer: 'git push origin --tags',
    explanation:
      '`git push origin --tags`는 로컬에 생성된 모든 태그를 원격 저장소에 업로드합니다. 태그는 기본적으로 `push`에 포함되지 않으므로 별도로 푸시해야 합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: 'shallow clone',
    text: '최근 1개 커밋만 포함하여 `https://github.com/user/repo.git` 저장소를 얕은 복제하는 명령어는?',
    answer: 'git clone --depth 1 https://github.com/user/repo.git',
    explanation:
      '`git clone --depth 1`은 최근 1개 커밋만 포함하여 복제합니다. 전체 이력이 필요 없는 CI/CD 환경에서 다운로드 시간과 저장 공간을 절약할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 원격 브랜치 fetch',
    text: '`origin`에서 `feature/api` 브랜치만 가져오는 명령어는?',
    answer: 'git fetch origin feature/api',
    explanation:
      '`git fetch origin feature/api`는 원격의 특정 브랜치만 가져옵니다. 모든 브랜치를 가져올 필요 없이 필요한 브랜치만 선택적으로 다운로드할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: '여러 원격 저장소 동시 푸시 설정',
    text: '`origin`에 push URL을 추가하여 `https://gitlab.com/user/repo.git`에도 동시에 푸시되도록 설정하는 명령어는?',
    answer: 'git remote set-url --add --push origin https://gitlab.com/user/repo.git',
    explanation:
      '`git remote set-url --add --push`는 원격 저장소에 추가 push URL을 등록합니다. 이후 `git push origin`을 실행하면 모든 등록된 push URL에 동시에 푸시됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '서브모듈 포함 클론',
    text: '`https://github.com/user/repo.git` 저장소를 서브모듈까지 포함하여 재귀적으로 복제하는 명령어는?',
    answer: 'git clone --recurse-submodules https://github.com/user/repo.git',
    explanation:
      '`--recurse-submodules`는 저장소 복제 시 등록된 서브모듈도 함께 초기화하고 복제합니다. 서브모듈에 의존하는 프로젝트에서 필수적입니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: 'refspec으로 fetch',
    text: '원격 `origin`의 `release/v2` 브랜치를 로컬의 `refs/heads/v2-local`로 fetch하는 명령어는?',
    answer: 'git fetch origin release/v2:refs/heads/v2-local',
    explanation:
      '`git fetch origin <src>:<dst>` refspec 형식으로 원격 브랜치를 로컬의 원하는 참조에 매핑하여 가져올 수 있습니다. 원격과 다른 이름으로 로컬 브랜치를 생성할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '미러 클론',
    text: '`https://github.com/user/repo.git` 저장소를 모든 참조를 포함하여 미러 복제(bare 저장소)하는 명령어는?',
    answer: 'git clone --mirror https://github.com/user/repo.git',
    explanation:
      '`git clone --mirror`는 모든 브랜치, 태그, refs를 포함한 완전한 미러를 bare 저장소로 생성합니다. 저장소 백업이나 마이그레이션에 사용됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '원격 브랜치 강제 덮어쓰기',
    text: '로컬 `main` 브랜치 상태로 원격 `origin/main`을 완전히 덮어쓰는 강제 푸시 명령어는?',
    answer: 'git push --force origin main',
    explanation:
      '`git push --force origin main`은 원격 브랜치의 히스토리를 로컬 브랜치로 완전히 덮어씁니다. 다른 기여자의 작업이 유실될 수 있으므로 주의가 필요합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '서브모듈 추가',
    text: '`https://github.com/lib/utils.git` 저장소를 `vendor/utils` 경로에 서브모듈로 추가하는 명령어는?',
    answer: 'git submodule add https://github.com/lib/utils.git vendor/utils',
    explanation:
      '`git submodule add <url> <path>`는 외부 저장소를 지정된 경로에 서브모듈로 등록합니다. `.gitmodules` 파일이 생성되어 서브모듈 정보가 기록됩니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '서브모듈 업데이트',
    text: '모든 서브모듈을 초기화하고 최신 커밋으로 업데이트하는 명령어는?',
    answer: 'git submodule update --init --recursive',
    explanation:
      '`git submodule update --init --recursive`는 아직 초기화되지 않은 서브모듈을 초기화(`--init`)하고, 중첩 서브모듈까지 재귀적(`--recursive`)으로 업데이트합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: 'sparse checkout 클론',
    text: '저장소를 복제하되 파일을 체크아웃하지 않고 빈 워킹 디렉토리로 클론하는 명령어는?',
    answer: 'git clone --no-checkout https://github.com/user/repo.git',
    explanation:
      '`git clone --no-checkout`은 `.git` 디렉토리만 생성하고 워킹 디렉토리에 파일을 체크아웃하지 않습니다. sparse checkout과 함께 필요한 파일만 선택적으로 체크아웃할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: 'shallow clone 깊이 확장',
    text: 'shallow clone된 저장소의 이력 깊이를 10개 커밋으로 확장하는 명령어는?',
    answer: 'git fetch --deepen=10',
    explanation:
      '`git fetch --deepen=10`은 현재 shallow clone의 깊이에서 10개 커밋을 추가로 가져옵니다. 점진적으로 이력을 확장해야 할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '단일 브랜치 클론 해제',
    text: '`--single-branch`로 클론한 저장소에서 모든 원격 브랜치를 추적할 수 있도록 fetch 설정을 변경하는 명령어는?',
    answer: 'git remote set-branches origin "*"',
    explanation:
      '`git remote set-branches origin "*"`는 원격의 모든 브랜치를 추적하도록 fetch refspec을 변경합니다. 이후 `git fetch origin`으로 모든 브랜치를 가져올 수 있습니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  {
    difficulty: 'HARD',
    title: '특정 태그만 fetch',
    text: '`origin`에서 `v2.0.0` 태그만 가져오는 명령어는?',
    answer: 'git fetch origin tag v2.0.0',
    explanation:
      '`git fetch origin tag v2.0.0`은 특정 태그와 그 태그가 가리키는 객체만 가져옵니다. 전체 fetch 없이 필요한 태그만 선택적으로 다운로드할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 3,
  },
  // =============================================
  // Git > Undo (categoryId: 1, subCategoryId: 4)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '워킹 디렉토리 파일 복원',
    text: '`app.js` 파일의 수정사항을 버리고 마지막 커밋 상태로 되돌리는 명령어는?',
    answer: 'git checkout -- app.js',
    explanation:
      '`git checkout -- app.js`는 워킹 디렉토리의 변경사항을 버리고 마지막 커밋 상태로 파일을 복원합니다. `--`는 파일 경로와 브랜치 이름을 구분합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: 'restore로 파일 복원',
    text: '`git restore` 명령어를 사용하여 `style.css` 파일을 마지막 커밋 상태로 복원하는 명령어는?',
    answer: 'git restore style.css',
    explanation:
      '`git restore style.css`는 워킹 디렉토리의 변경사항을 마지막 커밋 상태로 되돌립니다. Git 2.23에서 도입된 명령어로, `checkout`보다 직관적입니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '스테이징 취소',
    text: '`index.html` 파일을 스테이징 영역에서 제거하되 변경사항은 유지하는 명령어는?',
    answer: 'git restore --staged index.html',
    explanation:
      '`git restore --staged index.html`은 스테이징 영역에서 파일을 제거하지만, 워킹 디렉토리의 변경사항은 그대로 유지합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '마지막 커밋 취소 (변경 유지)',
    text: '마지막 커밋을 취소하되, 변경사항을 스테이징 영역에 유지하는 명령어는?',
    answer: 'git reset --soft HEAD~1',
    explanation:
      '`git reset --soft HEAD~1`은 마지막 커밋을 취소하고, 해당 커밋의 변경사항을 스테이징 영역에 그대로 유지합니다. 커밋 메시지를 수정하거나 커밋을 재구성할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '마지막 커밋 취소 (언스테이지)',
    text: '마지막 커밋을 취소하고, 변경사항을 워킹 디렉토리에만 유지하는(스테이징 해제) 명령어는?',
    answer: 'git reset HEAD~1',
    explanation:
      '`git reset HEAD~1`(기본값은 `--mixed`)은 마지막 커밋을 취소하고, 변경사항을 스테이징 영역에서 제거하여 워킹 디렉토리에만 남깁니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '특정 커밋 되돌리기',
    text: '커밋 `a1b2c3d`의 변경사항을 취소하는 새로운 커밋을 생성하는 명령어는?',
    answer: 'git revert a1b2c3d',
    explanation:
      '`git revert a1b2c3d`는 해당 커밋에서 적용된 변경사항을 반대로 적용하는 새 커밋을 생성합니다. 기존 히스토리를 보존하면서 변경을 취소합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '모든 워킹 디렉토리 변경 취소',
    text: '워킹 디렉토리의 모든 변경사항(추적 중인 파일)을 마지막 커밋 상태로 되돌리는 명령어는?',
    answer: 'git checkout -- .',
    explanation:
      '`git checkout -- .`은 현재 디렉토리 이하의 모든 추적 중인 파일의 변경사항을 마지막 커밋 상태로 복원합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '추적되지 않는 파일 삭제 미리보기',
    text: '추적되지 않는(untracked) 파일들이 삭제될 목록을 미리 확인하는 명령어는?',
    answer: 'git clean -n',
    explanation:
      '`git clean -n`(또는 `--dry-run`)은 실제 삭제 없이 `git clean`이 제거할 파일 목록을 미리 보여줍니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '추적되지 않는 파일 삭제',
    text: '추적되지 않는(untracked) 파일들을 워킹 디렉토리에서 삭제하는 명령어는?',
    answer: 'git clean -f',
    explanation:
      '`git clean -f`는 Git이 추적하지 않는 파일을 강제로 삭제합니다. `-f`(force)는 안전장치로, 옵션 없이는 실행되지 않습니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: '모든 스테이징 취소',
    text: '스테이징 영역의 모든 파일을 언스테이지하는 명령어는?',
    answer: 'git reset HEAD',
    explanation:
      '`git reset HEAD`는 스테이징 영역의 모든 변경사항을 워킹 디렉토리로 되돌립니다. 파일 내용은 변경되지 않고 스테이징만 취소됩니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'EASY',
    title: 'reflog 확인',
    text: 'HEAD의 이동 이력(reflog)을 확인하는 명령어는?',
    answer: 'git reflog',
    explanation:
      '`git reflog`는 HEAD가 이동한 모든 기록을 보여줍니다. reset, rebase 등으로 잃어버린 커밋을 찾을 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: '하드 리셋',
    text: '마지막 커밋을 취소하고, 변경사항까지 완전히 삭제하는 명령어는?',
    answer: 'git reset --hard HEAD~1',
    explanation:
      '`git reset --hard HEAD~1`은 마지막 커밋을 취소하고, 스테이징 영역과 워킹 디렉토리의 변경사항까지 모두 삭제합니다. 복구가 어려우므로 주의가 필요합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 커밋으로 하드 리셋',
    text: '`a1b2c3d` 커밋 시점으로 완전히 되돌리는(모든 이후 변경 삭제) 명령어는?',
    answer: 'git reset --hard a1b2c3d',
    explanation:
      '`git reset --hard a1b2c3d`는 HEAD, 스테이징 영역, 워킹 디렉토리를 모두 해당 커밋 상태로 되돌립니다. 이후의 모든 커밋과 변경사항이 삭제됩니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: 'revert 후 커밋하지 않기',
    text: '커밋 `a1b2c3d`를 되돌리되, 자동 커밋 없이 변경사항만 스테이징에 놓는 명령어는?',
    answer: 'git revert --no-commit a1b2c3d',
    explanation:
      '`git revert --no-commit`은 되돌리기 변경사항을 스테이징 영역에만 놓고 자동 커밋하지 않습니다. 여러 revert를 모아서 하나의 커밋으로 만들 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: '디렉토리 포함 clean',
    text: '추적되지 않는 파일과 디렉토리를 모두 삭제하는 명령어는?',
    answer: 'git clean -fd',
    explanation:
      '`git clean -fd`에서 `-f`는 강제 삭제, `-d`는 추적되지 않는 디렉토리까지 포함하여 삭제합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: 'reflog으로 복구',
    text: '`git reflog`에서 찾은 `HEAD@{3}` 상태로 워킹 디렉토리를 완전히 복원하는 명령어는?',
    answer: 'git reset --hard HEAD@{3}',
    explanation:
      '`git reset --hard HEAD@{3}`은 reflog에 기록된 3번째 이전 HEAD 상태로 전체를 복원합니다. 실수로 reset이나 rebase한 경우 복구에 사용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 파일만 특정 커밋으로 복원',
    text: '`config.js` 파일만 커밋 `a1b2c3d` 시점의 상태로 복원하는 명령어는?',
    answer: 'git restore --source=a1b2c3d config.js',
    explanation:
      '`git restore --source=a1b2c3d config.js`는 지정된 커밋의 파일 상태를 워킹 디렉토리에 복원합니다. 다른 파일은 영향받지 않습니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: '머지 충돌 시 되돌리기',
    text: '진행 중인 머지를 취소하고 머지 이전 상태로 되돌리는 명령어는?',
    answer: 'git merge --abort',
    explanation:
      '`git merge --abort`는 충돌이 발생한 머지 과정을 취소하고, 머지 시작 전 상태로 완전히 되돌립니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: 'gitignore 포함 clean',
    text: '추적되지 않는 파일과 `.gitignore`에 의해 무시되는 파일까지 모두 삭제하는 명령어는?',
    answer: 'git clean -fdx',
    explanation:
      '`git clean -fdx`에서 `-x` 옵션은 `.gitignore`에 등록된 파일까지 포함하여 삭제합니다. 빌드 결과물이나 의존성 캐시를 완전히 정리할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: 'rebase 중단',
    text: '진행 중인 rebase를 취소하고 rebase 시작 전 상태로 되돌리는 명령어는?',
    answer: 'git rebase --abort',
    explanation:
      '`git rebase --abort`는 진행 중인 rebase를 완전히 취소하고, rebase 시작 전 상태로 브랜치를 복원합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: 'cherry-pick 취소',
    text: '충돌이 발생한 cherry-pick을 취소하고 이전 상태로 되돌리는 명령어는?',
    answer: 'git cherry-pick --abort',
    explanation:
      '`git cherry-pick --abort`는 진행 중인 cherry-pick을 취소하고, cherry-pick 시작 전 상태로 복원합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'NORMAL',
    title: '최근 N개 커밋 합치기',
    text: '최근 3개 커밋을 하나로 합치기 위해 인터랙티브 rebase를 시작하는 명령어는?',
    answer: 'git rebase -i HEAD~3',
    explanation:
      '`git rebase -i HEAD~3`은 최근 3개 커밋에 대한 인터랙티브 rebase를 시작합니다. 에디터에서 `pick`을 `squash`로 변경하면 커밋을 합칠 수 있습니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: 'bisect로 버그 커밋 찾기 시작',
    text: '이진 탐색으로 버그가 발생한 커밋을 찾기 위해 bisect를 시작하는 명령어는?',
    answer: 'git bisect start',
    explanation:
      '`git bisect start`는 이진 탐색 기반의 디버깅 세션을 시작합니다. 이후 `git bisect bad`(현재 버그 있음)와 `git bisect good <commit>`(정상 커밋)을 지정하면 Git이 자동으로 중간 커밋을 체크아웃합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'bisect 자동화',
    text: '`npm test` 명령어를 기준으로 bisect를 자동으로 실행하여 버그 커밋을 찾는 명령어는?',
    answer: 'git bisect run npm test',
    explanation:
      '`git bisect run <command>`는 지정된 명령어의 종료 코드를 기반으로 good/bad를 자동 판단하며 이진 탐색을 수행합니다. 종료 코드 0은 good, 그 외는 bad로 판단합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: '범위 revert',
    text: '커밋 `abc1234`부터 `def5678`까지의 범위를 되돌리되 자동 커밋 없이 수행하는 명령어는?',
    answer: 'git revert --no-commit abc1234..def5678',
    explanation:
      '`git revert --no-commit abc1234..def5678`는 지정된 범위의 커밋들을 역순으로 되돌리고, 모든 변경사항을 스테이징에만 놓습니다. 하나의 커밋으로 여러 revert를 묶을 수 있습니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'cherry-pick으로 특정 커밋 가져오기',
    text: '다른 브랜치의 커밋 `a1b2c3d`를 현재 브랜치에 적용하는 명령어는?',
    answer: 'git cherry-pick a1b2c3d',
    explanation:
      '`git cherry-pick a1b2c3d`는 지정된 커밋의 변경사항을 현재 브랜치에 새 커밋으로 적용합니다. 특정 변경사항만 선택적으로 가져올 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: '머지 커밋 revert',
    text: '머지 커밋 `m1e2r3g`를 되돌리되, 첫 번째 부모를 기준으로 revert하는 명령어는?',
    answer: 'git revert -m 1 m1e2r3g',
    explanation:
      '머지 커밋은 부모가 2개 이상이므로 `-m` 옵션으로 기준 부모를 지정해야 합니다. `-m 1`은 첫 번째 부모(머지를 실행한 브랜치)를 기준으로 되돌립니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'filter-branch로 파일 삭제',
    text: '모든 커밋 이력에서 `secret.env` 파일을 완전히 제거하는 명령어는?',
    answer: 'git filter-branch --tree-filter "rm -f secret.env" HEAD',
    explanation:
      '`git filter-branch --tree-filter`는 모든 커밋을 순회하며 지정된 명령을 실행합니다. 실수로 커밋된 민감한 파일을 이력에서 완전히 삭제할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'worktree 복구',
    text: '워킹 디렉토리와 스테이징 영역을 모두 HEAD 상태로 완전히 초기화하는 명령어는?',
    answer: 'git reset --hard HEAD',
    explanation:
      '`git reset --hard HEAD`는 스테이징 영역과 워킹 디렉토리를 현재 HEAD 커밋 상태로 완전히 초기화합니다. 모든 미커밋 변경사항이 삭제됩니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'cherry-pick 범위 적용',
    text: '커밋 `abc1234`부터 `def5678`까지의 범위를 현재 브랜치에 cherry-pick하는 명령어는?',
    answer: 'git cherry-pick abc1234..def5678',
    explanation:
      '`git cherry-pick abc1234..def5678`는 `abc1234` 다음 커밋부터 `def5678`까지의 커밋들을 순서대로 현재 브랜치에 적용합니다. `abc1234` 자체는 포함되지 않습니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'reflog 만료 시간 설정',
    text: 'reflog 항목을 90일이 지나면 만료되도록 정리하는 명령어는?',
    answer: 'git reflog expire --expire=90.days.ago --all',
    explanation:
      '`git reflog expire --expire=90.days.ago --all`은 90일이 지난 reflog 항목을 모든 참조에서 제거합니다. 저장소 크기를 줄이거나 오래된 이력을 정리할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'interactive rebase에서 커밋 순서 변경',
    text: '최근 5개 커밋의 순서를 재배치하기 위해 인터랙티브 rebase를 시작하는 명령어는?',
    answer: 'git rebase -i HEAD~5',
    explanation:
      '`git rebase -i HEAD~5`에서 에디터가 열리면 커밋 행의 순서를 변경하여 커밋 순서를 재배치할 수 있습니다. `pick` 행의 위치를 이동시키면 커밋 적용 순서가 바뀝니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  {
    difficulty: 'HARD',
    title: 'ORIG_HEAD로 복구',
    text: '`git reset`이나 `git merge` 직후, 실행 전 상태로 되돌리는 명령어는?',
    answer: 'git reset --hard ORIG_HEAD',
    explanation:
      '`ORIG_HEAD`는 위험한 작업(reset, merge, rebase) 전의 HEAD를 자동 저장한 참조입니다. `git reset --hard ORIG_HEAD`로 직전 상태를 즉시 복원할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 4,
  },
  // =============================================
  // Git > Config (categoryId: 1, subCategoryId: 5)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '사용자 이름 설정',
    text: 'Git 전역 사용자 이름을 "John"으로 설정하는 명령어는?',
    answer: 'git config --global user.name "John"',
    explanation:
      '`git config --global user.name "John"`은 전역(global) 설정으로 모든 저장소에서 사용할 사용자 이름을 설정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '이메일 설정',
    text: 'Git 전역 이메일을 "john@example.com"으로 설정하는 명령어는?',
    answer: 'git config --global user.email "john@example.com"',
    explanation:
      '`git config --global user.email "john@example.com"`은 전역 이메일 주소를 설정합니다. 커밋에 기록되는 작성자 이메일입니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '설정값 확인',
    text: '현재 설정된 Git 사용자 이름을 확인하는 명령어는?',
    answer: 'git config user.name',
    explanation: '`git config user.name`은 현재 적용되는 사용자 이름 설정값을 출력합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '모든 설정 확인',
    text: '현재 적용 중인 모든 Git 설정을 나열하는 명령어는?',
    answer: 'git config --list',
    explanation: '`git config --list`는 system, global, local 수준의 모든 설정을 나열합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '기본 에디터 설정',
    text: 'Git의 기본 텍스트 에디터를 `vim`으로 설정하는 명령어는?',
    answer: 'git config --global core.editor vim',
    explanation:
      '`git config --global core.editor vim`은 커밋 메시지 작성이나 인터랙티브 rebase 등에서 사용할 기본 에디터를 vim으로 설정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '기본 브랜치명 설정',
    text: '새 저장소 생성 시 기본 브랜치 이름을 `main`으로 설정하는 명령어는?',
    answer: 'git config --global init.defaultBranch main',
    explanation:
      '`git config --global init.defaultBranch main`은 `git init` 시 생성되는 기본 브랜치 이름을 `main`으로 설정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '색상 출력 활성화',
    text: 'Git 출력에 색상을 자동으로 적용하도록 설정하는 명령어는?',
    answer: 'git config --global color.ui auto',
    explanation:
      '`git config --global color.ui auto`는 터미널에서 Git 출력(diff, status, branch 등)에 자동으로 색상을 적용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '전역 설정 파일 위치',
    text: '전역 Git 설정 파일을 에디터로 여는 명령어는?',
    answer: 'git config --global --edit',
    explanation:
      '`git config --global --edit`는 전역 설정 파일(`~/.gitconfig`)을 기본 에디터로 열어 직접 편집할 수 있게 합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: 'CRLF 설정',
    text: '체크아웃 시 줄바꿈을 자동으로 CRLF로 변환하도록 설정하는 명령어는?',
    answer: 'git config --global core.autocrlf true',
    explanation:
      '`git config --global core.autocrlf true`는 체크아웃 시 LF를 CRLF로, 커밋 시 CRLF를 LF로 자동 변환합니다. Windows 환경에서 주로 사용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '.gitignore 생성',
    text: '`node_modules` 디렉토리를 Git 추적에서 제외하려면 `.gitignore` 파일에 어떤 내용을 작성해야 하는가?',
    answer: 'node_modules/',
    explanation:
      '`.gitignore` 파일에 `node_modules/`를 추가하면 해당 디렉토리와 하위 파일이 Git 추적에서 제외됩니다. 끝의 `/`는 디렉토리를 의미합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'EASY',
    title: '로컬 설정 확인',
    text: '현재 저장소에만 적용되는 로컬 설정을 확인하는 명령어는?',
    answer: 'git config --local --list',
    explanation:
      '`git config --local --list`는 현재 저장소의 `.git/config` 파일에 저장된 로컬 설정만 나열합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: '별칭(alias) 설정',
    text: '`git st`를 `git status`의 별칭으로 설정하는 명령어는?',
    answer: 'git config --global alias.st status',
    explanation:
      '`git config --global alias.st status`는 `git st`를 입력하면 `git status`가 실행되도록 별칭을 설정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: '설정 삭제',
    text: '전역 설정에서 `user.name`을 삭제하는 명령어는?',
    answer: 'git config --global --unset user.name',
    explanation: '`git config --global --unset user.name`은 전역 설정에서 지정된 키를 제거합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: 'merge 전략 기본값 설정',
    text: '`git pull` 시 기본 전략을 rebase로 설정하는 명령어는?',
    answer: 'git config --global pull.rebase true',
    explanation:
      '`git config --global pull.rebase true`는 `git pull` 실행 시 merge 대신 rebase를 기본 전략으로 사용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: '푸시 기본 동작 설정',
    text: '`git push` 시 현재 브랜치만 푸시하도록 기본 동작을 설정하는 명령어는?',
    answer: 'git config --global push.default current',
    explanation:
      '`git config --global push.default current`는 `git push`를 인자 없이 실행할 때 현재 브랜치를 동일한 이름의 원격 브랜치로 푸시합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: 'diff 도구 설정',
    text: '기본 diff 도구를 `vimdiff`로 설정하는 명령어는?',
    answer: 'git config --global diff.tool vimdiff',
    explanation:
      '`git config --global diff.tool vimdiff`는 `git difftool` 실행 시 vimdiff를 사용하도록 설정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: '자격 증명 캐시',
    text: 'HTTPS 인증 정보를 15분간 메모리에 캐시하도록 설정하는 명령어는?',
    answer: 'git config --global credential.helper cache',
    explanation:
      '`credential.helper cache`는 HTTPS 인증 정보를 기본 15분간 메모리에 캐시합니다. 매번 비밀번호를 입력하지 않아도 됩니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: '설정 출처 확인',
    text: '`user.name` 설정이 어떤 파일에서 정의되었는지 확인하는 명령어는?',
    answer: 'git config --show-origin user.name',
    explanation:
      '`git config --show-origin user.name`은 설정값과 함께 해당 값이 정의된 설정 파일 경로를 표시합니다. 설정 충돌을 디버깅할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: 'merge 도구 설정',
    text: '기본 merge 도구를 `vscode`로 설정하는 명령어는?',
    answer: 'git config --global merge.tool vscode',
    explanation:
      '`git config --global merge.tool vscode`는 `git mergetool` 실행 시 VS Code를 사용하도록 설정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: 'fast-forward only 설정',
    text: '`git merge` 시 fast-forward가 불가능하면 머지를 거부하도록 설정하는 명령어는?',
    answer: 'git config --global merge.ff only',
    explanation:
      '`merge.ff only`는 fast-forward 병합만 허용합니다. 비선형 히스토리를 방지하여 깔끔한 커밋 이력을 유지할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: '전역 gitignore 설정',
    text: '`~/.gitignore_global` 파일을 전역 gitignore로 설정하는 명령어는?',
    answer: 'git config --global core.excludesfile ~/.gitignore_global',
    explanation:
      '`core.excludesfile`은 모든 저장소에서 적용되는 전역 gitignore 파일을 설정합니다. OS 관련 파일(.DS_Store 등)을 전역으로 무시할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'NORMAL',
    title: 'rerere 활성화',
    text: '이전 충돌 해결을 기억하여 동일 충돌 시 자동 적용하도록 rerere를 활성화하는 명령어는?',
    answer: 'git config --global rerere.enabled true',
    explanation:
      '`rerere`(reuse recorded resolution)는 이전에 해결한 충돌 패턴을 기록하고, 동일한 충돌 발생 시 자동으로 해결을 적용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: '복합 별칭 설정',
    text: '`git lg`를 한 줄 그래프 로그(`log --oneline --graph --all`)의 별칭으로 설정하는 명령어는?',
    answer: 'git config --global alias.lg "log --oneline --graph --all"',
    explanation:
      '별칭에 여러 옵션을 포함한 명령어를 등록할 수 있습니다. 큰따옴표로 감싸면 공백이 포함된 복합 명령어를 별칭으로 사용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: '조건부 설정 (includeIf)',
    text: '`~/work/` 하위 저장소에서만 `~/.gitconfig-work` 설정을 적용하기 위해 전역 설정에 추가해야 하는 구문은?',
    answer: '[includeIf "gitdir:~/work/"] path = ~/.gitconfig-work',
    explanation:
      '`includeIf`는 조건부로 설정 파일을 포함합니다. `gitdir:` 조건으로 특정 경로의 저장소에서만 별도 설정(회사 이메일 등)을 적용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'GPG 서명 기본 설정',
    text: '모든 커밋에 자동으로 GPG 서명을 추가하도록 설정하는 명령어는?',
    answer: 'git config --global commit.gpgsign true',
    explanation:
      '`commit.gpgsign true`는 모든 커밋에 자동으로 GPG 서명을 추가합니다. `-S` 옵션을 매번 입력하지 않아도 됩니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'GPG 키 설정',
    text: 'Git에서 사용할 GPG 서명 키를 `ABC12345`로 설정하는 명령어는?',
    answer: 'git config --global user.signingkey ABC12345',
    explanation: '`user.signingkey`는 커밋이나 태그 서명에 사용할 GPG 키 ID를 지정합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'fsmonitor 활성화',
    text: '대규모 저장소의 성능 향상을 위해 파일 시스템 모니터를 활성화하는 명령어는?',
    answer: 'git config core.fsmonitor true',
    explanation:
      '`core.fsmonitor true`는 파일 시스템 변경을 모니터링하여 `git status`나 `git add` 등의 성능을 크게 향상시킵니다. 대규모 저장소에서 효과적입니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'sparse-checkout 설정',
    text: 'sparse-checkout을 활성화하여 부분 체크아웃을 설정하는 명령어는?',
    answer: 'git config core.sparseCheckout true',
    explanation:
      '`core.sparseCheckout true`는 저장소의 일부 디렉토리만 워킹 디렉토리에 체크아웃하는 기능을 활성화합니다. 대규모 모노레포에서 필요한 부분만 작업할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'hook 경로 변경',
    text: 'Git 훅(hooks) 디렉토리를 `.githooks`로 변경하는 명령어는?',
    answer: 'git config core.hooksPath .githooks',
    explanation:
      '`core.hooksPath`는 Git 훅의 위치를 기본 `.git/hooks`에서 다른 경로로 변경합니다. 훅을 버전 관리에 포함시킬 때 프로젝트 루트의 `.githooks` 디렉토리를 사용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'diff 알고리즘 변경',
    text: 'diff 출력의 품질을 높이기 위해 patience 알고리즘을 사용하도록 설정하는 명령어는?',
    answer: 'git config --global diff.algorithm patience',
    explanation:
      '`diff.algorithm patience`는 기본 Myers 알고리즘 대신 patience 알고리즘을 사용합니다. 코드의 논리적 구조를 더 잘 반영한 diff를 생성합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'credential store 설정',
    text: 'HTTPS 인증 정보를 디스크에 영구 저장하도록 설정하는 명령어는?',
    answer: 'git config --global credential.helper store',
    explanation:
      '`credential.helper store`는 인증 정보를 `~/.git-credentials` 파일에 평문으로 저장합니다. 편리하지만 보안에 주의가 필요합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'SSH 서명 설정',
    text: 'GPG 대신 SSH 키를 사용하여 커밋에 서명하도록 설정하는 명령어는?',
    answer: 'git config --global gpg.format ssh',
    explanation:
      '`gpg.format ssh`는 서명 형식을 SSH로 변경합니다. 이후 `user.signingkey`에 SSH 키 경로를 설정하면 SSH 키로 커밋 서명이 가능합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  {
    difficulty: 'HARD',
    title: 'maintenance 자동 실행 설정',
    text: 'Git 저장소의 자동 유지보수(gc, prefetch 등)를 스케줄링하여 활성화하는 명령어는?',
    answer: 'git maintenance start',
    explanation:
      '`git maintenance start`는 백그라운드에서 자동으로 가비지 컬렉션, prefetch, commit-graph 업데이트 등의 유지보수 작업을 스케줄링합니다.',
    categoryId: 1,
    subCategoryId: 5,
  },
  // =============================================
  // Git > Merge (categoryId: 1, subCategoryId: 6)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '브랜치 병합',
    text: '`feature` 브랜치를 현재 브랜치에 병합하는 명령어는?',
    answer: 'git merge feature',
    explanation: '`git merge feature`는 `feature` 브랜치의 변경사항을 현재 브랜치에 통합합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 상태 확인',
    text: '현재 병합 충돌이 발생한 파일 목록을 확인하는 명령어는?',
    answer: 'git status',
    explanation: '`git status`는 병합 중 충돌이 발생한 파일을 "both modified" 상태로 표시합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 중단',
    text: '병합 과정을 취소하고 병합 전 상태로 되돌리는 명령어는?',
    answer: 'git merge --abort',
    explanation: '`git merge --abort`는 진행 중인 병합을 취소하고 병합 시작 전 상태로 복원합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 커밋 메시지 지정',
    text: '`feature` 브랜치를 "Merge feature branch" 메시지로 병합하는 명령어는?',
    answer: 'git merge feature -m "Merge feature branch"',
    explanation:
      '`-m` 옵션으로 병합 커밋의 메시지를 직접 지정할 수 있습니다. 지정하지 않으면 기본 메시지가 사용됩니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: 'fast-forward 병합 확인',
    text: '`develop` 브랜치를 fast-forward 방식으로만 병합하는 명령어는?',
    answer: 'git merge --ff-only develop',
    explanation:
      '`--ff-only`는 fast-forward 병합이 가능한 경우에만 병합합니다. 불가능하면 병합이 거부됩니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 후 충돌 해결 완료',
    text: '충돌을 수동으로 해결한 후, 병합을 완료하기 위해 충돌 파일을 스테이징하는 명령어는?',
    answer: 'git add .',
    explanation:
      '충돌 해결 후 `git add .`로 수정된 파일을 스테이징하고, `git commit`으로 병합을 완료합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 커밋 강제 생성',
    text: 'fast-forward가 가능해도 반드시 병합 커밋을 생성하면서 `feature`를 병합하는 명령어는?',
    answer: 'git merge --no-ff feature',
    explanation:
      '`--no-ff`는 fast-forward가 가능한 경우에도 병합 커밋을 생성합니다. 브랜치 이력을 명확히 남길 수 있습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합된 브랜치 확인',
    text: '현재 브랜치에 이미 병합된 브랜치 목록을 확인하는 명령어는?',
    answer: 'git branch --merged',
    explanation: '`git branch --merged`는 현재 브랜치에 병합 완료된 브랜치를 나열합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 diff 확인',
    text: '병합 전 `feature` 브랜치와 현재 브랜치의 차이를 확인하는 명령어는?',
    answer: 'git diff feature',
    explanation:
      '`git diff feature`는 현재 브랜치와 `feature` 브랜치 사이의 차이를 보여줍니다. 병합 전 변경사항을 미리 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '3-way diff 확인',
    text: '병합 충돌 시 공통 조상과의 차이를 포함한 diff를 확인하는 명령어는?',
    answer: 'git diff --merge',
    explanation:
      '`git diff --merge`는 병합 충돌 상태에서 양쪽 브랜치와 공통 조상을 기준으로 한 3-way diff를 보여줍니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'EASY',
    title: '병합 로그 확인',
    text: '병합 커밋만 필터링하여 로그를 확인하는 명령어는?',
    answer: 'git log --merges',
    explanation: '`git log --merges`는 병합 커밋(부모가 2개 이상인 커밋)만 필터링하여 보여줍니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: 'squash 병합',
    text: '`feature` 브랜치의 모든 커밋을 하나로 합쳐서 현재 브랜치에 스테이징하는 명령어는?',
    answer: 'git merge --squash feature',
    explanation:
      '`--squash`는 브랜치의 모든 변경사항을 하나로 합쳐서 스테이징만 합니다. 별도로 `git commit`을 해야 하며, 병합 커밋이 생성되지 않습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '충돌 해결 도구 사용',
    text: '병합 충돌을 GUI 도구로 해결하기 위해 mergetool을 실행하는 명령어는?',
    answer: 'git mergetool',
    explanation:
      '`git mergetool`은 설정된 병합 도구(vimdiff, meld, VS Code 등)를 실행하여 시각적으로 충돌을 해결할 수 있게 합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '전략 옵션으로 병합',
    text: '`feature` 브랜치를 병합하면서 충돌 시 현재 브랜치(ours)의 내용을 우선 적용하는 명령어는?',
    answer: 'git merge -X ours feature',
    explanation:
      '`-X ours`는 recursive 전략의 옵션으로, 충돌 발생 시 현재 브랜치의 내용을 자동으로 선택합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: 'theirs 전략으로 병합',
    text: '`feature` 브랜치를 병합하면서 충돌 시 `feature` 브랜치의 내용을 우선 적용하는 명령어는?',
    answer: 'git merge -X theirs feature',
    explanation:
      '`-X theirs`는 충돌 발생 시 병합 대상 브랜치(theirs)의 내용을 자동으로 선택합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '병합 충돌 파일만 확인',
    text: '현재 병합 충돌이 있는 파일만 나열하는 명령어는?',
    answer: 'git diff --name-only --diff-filter=U',
    explanation:
      '`--diff-filter=U`는 Unmerged(충돌 상태) 파일만 필터링합니다. 충돌 파일을 빠르게 식별할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '병합 시뮬레이션',
    text: '`feature` 브랜치와의 병합을 실제로 수행하지 않고, 충돌 여부만 확인하는 명령어는?',
    answer: 'git merge --no-commit --no-ff feature',
    explanation:
      '`--no-commit --no-ff`를 함께 사용하면 병합을 수행하되 커밋하지 않습니다. 충돌 여부를 확인한 후 `git merge --abort`로 되돌릴 수 있습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 커밋만 병합',
    text: '`feature` 브랜치의 특정 커밋 `a1b2c3d`만 현재 브랜치에 적용하는 명령어는?',
    answer: 'git cherry-pick a1b2c3d',
    explanation:
      '`git cherry-pick a1b2c3d`는 특정 커밋의 변경사항만 선택적으로 현재 브랜치에 적용합니다. 전체 브랜치 병합이 아닌 개별 커밋을 가져올 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '병합 계속 진행',
    text: '충돌을 해결한 후 병합을 계속 진행하여 완료하는 명령어는?',
    answer: 'git merge --continue',
    explanation:
      '`git merge --continue`는 충돌 해결 후 병합 커밋을 생성하여 병합을 완료합니다. `git commit`과 동일한 효과입니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '병합 기준 확인',
    text: '`main`과 `feature` 브랜치의 공통 조상 커밋을 찾는 명령어는?',
    answer: 'git merge-base main feature',
    explanation:
      '`git merge-base`는 두 브랜치의 최근 공통 조상(merge base)을 찾습니다. 병합이 시작될 기준점을 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '3-way 병합 설정',
    text: '충돌 마커에 공통 조상의 내용도 함께 표시하도록 설정하는 명령어는?',
    answer: 'git config --global merge.conflictstyle diff3',
    explanation:
      '`merge.conflictstyle diff3`는 충돌 마커에 base(공통 조상), ours, theirs 세 가지를 모두 표시합니다. 충돌 해결 시 맥락 파악이 쉬워집니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'NORMAL',
    title: '병합 없는 커밋만 확인',
    text: '병합 커밋을 제외하고 일반 커밋만 로그에서 확인하는 명령어는?',
    answer: 'git log --no-merges',
    explanation:
      '`git log --no-merges`는 병합 커밋을 제외한 일반 커밋만 표시합니다. 실제 코드 변경 이력만 볼 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: 'ours 전략 병합',
    text: '`feature` 브랜치를 병합하되, 실제 변경사항은 무시하고 병합 커밋만 생성하는 명령어는?',
    answer: 'git merge -s ours feature',
    explanation:
      '`-s ours` 전략은 현재 브랜치의 내용을 그대로 유지하면서 병합 커밋을 생성합니다. 브랜치를 "병합됨" 표시만 하고 싶을 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: 'subtree 병합',
    text: '`lib` 브랜치를 현재 저장소의 `vendor/lib/` 하위 디렉토리로 subtree 병합하는 명령어는?',
    answer: 'git merge -s subtree lib',
    explanation:
      '`-s subtree` 전략은 병합 대상을 현재 트리의 하위 디렉토리에 매핑하여 병합합니다. 서브모듈 대안으로 사용됩니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: 'octopus 병합',
    text: '`feature-a`, `feature-b`, `feature-c` 세 브랜치를 한 번에 병합하는 명령어는?',
    answer: 'git merge feature-a feature-b feature-c',
    explanation:
      '여러 브랜치를 동시에 병합하면 Git은 자동으로 octopus 전략을 사용합니다. 충돌이 없는 경우에만 성공합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: 'rerere로 충돌 자동 해결',
    text: 'rerere가 기록한 이전 충돌 해결을 현재 충돌에 자동 적용하는 명령어는?',
    answer: 'git rerere',
    explanation:
      '`git rerere`는 이전에 해결한 동일 패턴의 충돌을 자동으로 적용합니다. `rerere.enabled true` 설정이 필요합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: '병합 충돌 마커 이해',
    text: '병합 충돌 시 `<<<<<<<`, `=======`, `>>>>>>>` 마커에서 `=======` 위쪽은 무엇을 나타내는가?',
    answer: 'HEAD (현재 브랜치의 내용)',
    explanation:
      '`<<<<<<<` HEAD와 `=======` 사이는 현재 브랜치(HEAD)의 내용이고, `=======`과 `>>>>>>>`사이는 병합 대상 브랜치의 내용입니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: 'checkout으로 충돌 해결',
    text: '충돌 파일 `app.js`를 병합 대상 브랜치(theirs)의 버전으로 선택하여 해결하는 명령어는?',
    answer: 'git checkout --theirs app.js',
    explanation:
      '`git checkout --theirs app.js`는 충돌 파일을 병합 대상 브랜치의 버전으로 대체합니다. `--ours`는 현재 브랜치 버전을 선택합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: '부분 병합 취소',
    text: '병합 후 아직 푸시하지 않은 병합 커밋을 취소하고 병합 전 상태로 되돌리는 명령어는?',
    answer: 'git reset --hard ORIG_HEAD',
    explanation:
      '`ORIG_HEAD`는 병합 전 HEAD를 가리킵니다. `git reset --hard ORIG_HEAD`로 병합 커밋을 포함한 모든 변경을 되돌릴 수 있습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: 'no-verify 병합',
    text: '`feature` 브랜치를 병합하면서 pre-merge 훅을 건너뛰는 명령어는?',
    answer: 'git merge --no-verify feature',
    explanation:
      '`--no-verify`는 pre-merge-commit 훅 실행을 건너뜁니다. 훅이 일시적으로 문제를 일으킬 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: '병합 결과 diff 확인',
    text: '방금 완료된 병합 커밋에서 각 부모와의 combined diff를 확인하는 명령어는?',
    answer: 'git diff-tree --cc HEAD',
    explanation:
      '`git diff-tree --cc HEAD`는 병합 커밋의 combined diff를 보여줍니다. 양쪽 부모 대비 변경사항을 한 번에 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: 'patience 전략으로 병합',
    text: '충돌 시 더 나은 결과를 위해 patience diff 알고리즘을 사용하여 `feature` 브랜치를 병합하는 명령어는?',
    answer: 'git merge -X patience feature',
    explanation:
      '`-X patience`는 patience diff 알고리즘을 사용하여 충돌 해결 품질을 높입니다. 코드 구조가 크게 변경된 경우 더 나은 결과를 생성합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  {
    difficulty: 'HARD',
    title: '병합 로그 상세 기록',
    text: '`feature` 브랜치를 병합하면서 병합 커밋 메시지에 개별 커밋 목록을 포함시키는 명령어는?',
    answer: 'git merge --log feature',
    explanation:
      '`--log` 옵션은 병합 커밋 메시지에 병합되는 개별 커밋의 한 줄 요약(shortlog)을 자동으로 추가합니다.',
    categoryId: 1,
    subCategoryId: 6,
  },
  // =============================================
  // Git > Rebase (categoryId: 1, subCategoryId: 7)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '기본 rebase',
    text: '현재 브랜치를 `main` 브랜치 위로 rebase하는 명령어는?',
    answer: 'git rebase main',
    explanation:
      '`git rebase main`은 현재 브랜치의 커밋들을 `main` 브랜치의 최신 커밋 위에 재적용합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'rebase 중단',
    text: '진행 중인 rebase를 취소하고 원래 상태로 되돌리는 명령어는?',
    answer: 'git rebase --abort',
    explanation: '`git rebase --abort`는 rebase를 완전히 취소하고 시작 전 상태로 복원합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'rebase 계속',
    text: '충돌을 해결한 후 rebase를 계속 진행하는 명령어는?',
    answer: 'git rebase --continue',
    explanation:
      '충돌 해결 후 `git add`로 스테이징하고 `git rebase --continue`로 나머지 커밋의 재적용을 계속합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'rebase 건너뛰기',
    text: 'rebase 중 현재 충돌이 발생한 커밋을 건너뛰고 다음으로 진행하는 명령어는?',
    answer: 'git rebase --skip',
    explanation:
      '`git rebase --skip`은 현재 적용 중인 커밋을 건너뛰고 다음 커밋으로 진행합니다. 해당 커밋의 변경사항은 무시됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'pull --rebase',
    text: '원격 변경사항을 가져와서 merge 대신 rebase로 통합하는 명령어는?',
    answer: 'git pull --rebase',
    explanation:
      '`git pull --rebase`는 fetch 후 로컬 커밋을 원격 커밋 위에 재적용합니다. 불필요한 merge 커밋을 방지합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'rebase와 merge 차이',
    text: 'rebase는 커밋 히스토리를 어떻게 처리하는가? "선형(linear)"과 "비선형(non-linear)" 중 어느 쪽인가?',
    answer: 'linear',
    explanation:
      'rebase는 커밋을 재적용하여 선형(linear) 히스토리를 만듭니다. merge는 병합 커밋을 생성하여 비선형 히스토리가 됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'onto rebase 기본',
    text: '`feature` 브랜치를 `develop` 브랜치 위로 rebase하는 명령어는? (현재 feature 브랜치에 있다고 가정)',
    answer: 'git rebase develop',
    explanation:
      '`git rebase develop`은 현재 브랜치(feature)의 커밋들을 develop의 최신 커밋 위에 순서대로 재적용합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'interactive rebase 시작',
    text: '최근 3개 커밋을 편집하기 위해 인터랙티브 rebase를 시작하는 명령어는?',
    answer: 'git rebase -i HEAD~3',
    explanation:
      '`git rebase -i HEAD~3`은 최근 3개 커밋에 대한 인터랙티브 모드를 시작합니다. 커밋 순서 변경, squash, 편집 등이 가능합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'rebase 상태 확인',
    text: 'rebase가 진행 중인지 확인하는 방법은?',
    answer: 'git status',
    explanation:
      '`git status`를 실행하면 rebase 진행 중일 때 "interactive rebase in progress" 등의 메시지가 표시됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: '특정 브랜치를 다른 브랜치 위로',
    text: '현재 `main`에 있을 때, `feature` 브랜치를 `develop` 위로 rebase하는 명령어는?',
    answer: 'git rebase develop feature',
    explanation:
      '`git rebase develop feature`는 먼저 `feature`를 체크아웃한 후, `develop` 위로 rebase합니다. 현재 브랜치를 변경하지 않아도 됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'EASY',
    title: 'rebase 기본 설정',
    text: '`git pull` 시 항상 rebase를 사용하도록 전역 설정하는 명령어는?',
    answer: 'git config --global pull.rebase true',
    explanation: '`pull.rebase true` 설정으로 `git pull` 시 자동으로 `--rebase` 옵션이 적용됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: 'squash로 커밋 합치기',
    text: '인터랙티브 rebase에서 커밋을 이전 커밋과 합치려면 `pick`을 어떤 명령어로 변경해야 하는가?',
    answer: 'squash',
    explanation:
      '인터랙티브 rebase 에디터에서 `pick`을 `squash`(또는 `s`)로 변경하면 해당 커밋이 바로 위 커밋과 합쳐집니다. 커밋 메시지도 통합됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'fixup으로 커밋 합치기',
    text: '인터랙티브 rebase에서 커밋을 합치되 커밋 메시지는 버리려면 `pick`을 어떤 명령어로 변경해야 하는가?',
    answer: 'fixup',
    explanation:
      '`fixup`(또는 `f`)은 `squash`와 유사하지만 해당 커밋의 메시지를 버리고 이전 커밋의 메시지만 유지합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'edit으로 커밋 수정',
    text: '인터랙티브 rebase에서 특정 커밋을 중단하고 수정하려면 `pick`을 어떤 명령어로 변경해야 하는가?',
    answer: 'edit',
    explanation:
      '`edit`(또는 `e`)은 해당 커밋에서 rebase를 일시 중단합니다. 파일을 수정하고 `git commit --amend` 후 `git rebase --continue`로 진행합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'reword로 메시지 변경',
    text: '인터랙티브 rebase에서 커밋 내용은 유지하되 메시지만 변경하려면 `pick`을 어떤 명령어로 변경해야 하는가?',
    answer: 'reword',
    explanation:
      '`reword`(또는 `r`)는 커밋 내용은 그대로 유지하고 커밋 메시지만 편집할 수 있게 합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'onto 옵션 활용',
    text: '`feature` 브랜치를 `develop` 기준에서 분리하여 `main` 위로 재배치하는 명령어는?',
    answer: 'git rebase --onto main develop feature',
    explanation:
      '`--onto main develop feature`는 `develop..feature` 범위의 커밋들을 `main` 위에 재적용합니다. 브랜치의 기반을 변경할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'autosquash rebase',
    text: '`--fixup`이나 `--squash`로 만든 커밋들을 자동 정리하는 인터랙티브 rebase 명령어는?',
    answer: 'git rebase -i --autosquash HEAD~10',
    explanation:
      '`--autosquash`는 커밋 메시지가 `fixup!`이나 `squash!`로 시작하는 커밋을 자동으로 해당 원본 커밋 아래로 이동시킵니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'drop으로 커밋 삭제',
    text: '인터랙티브 rebase에서 특정 커밋을 완전히 삭제하려면 `pick`을 어떤 명령어로 변경해야 하는가?',
    answer: 'drop',
    explanation:
      '`drop`(또는 `d`)은 해당 커밋을 히스토리에서 완전히 제거합니다. 해당 행을 삭제하는 것과 같은 효과입니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'rebase 충돌 해결 과정',
    text: 'rebase 중 충돌이 발생했을 때, 충돌을 해결하고 계속 진행하는 올바른 순서의 명령어 조합은?',
    answer: 'git add . && git rebase --continue',
    explanation:
      '충돌 파일을 수정한 후 `git add .`로 스테이징하고 `git rebase --continue`로 나머지 커밋의 재적용을 계속합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'exec으로 명령 실행',
    text: '인터랙티브 rebase에서 각 커밋 적용 후 `npm test`를 자동 실행하도록 하는 방법은?',
    answer: 'git rebase -i --exec "npm test" HEAD~5',
    explanation:
      '`--exec "npm test"`는 각 커밋이 적용된 후 지정된 명령어를 자동으로 실행합니다. 실패하면 rebase가 중단됩니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'rebase 후 강제 푸시',
    text: 'rebase 후 원격에 안전하게 강제 푸시하는 명령어는?',
    answer: 'git push --force-with-lease',
    explanation:
      '`--force-with-lease`는 다른 사람의 푸시가 없었을 때만 강제 푸시합니다. rebase 후 히스토리가 변경되었으므로 강제 푸시가 필요합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'NORMAL',
    title: 'root rebase',
    text: '저장소의 첫 번째 커밋부터 모든 커밋을 인터랙티브 rebase하는 명령어는?',
    answer: 'git rebase -i --root',
    explanation:
      '`--root` 옵션은 루트 커밋(첫 번째 커밋)부터 모든 커밋을 인터랙티브 rebase 대상에 포함합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: 'onto로 범위 rebase',
    text: '`feature` 브랜치에서 `hotfix` 이후의 커밋들만 `main` 위로 재배치하는 명령어는?',
    answer: 'git rebase --onto main hotfix feature',
    explanation:
      '`--onto main hotfix feature`는 `hotfix..feature` 범위의 커밋만 `main` 위에 재적용합니다. 특정 구간만 선택적으로 옮길 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'rebase-merges',
    text: '병합 커밋을 보존하면서 `main` 위로 rebase하는 명령어는?',
    answer: 'git rebase --rebase-merges main',
    explanation:
      '`--rebase-merges`는 병합 커밋의 구조를 보존하면서 rebase합니다. 기존의 `--preserve-merges` 대체 옵션입니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'autostash rebase',
    text: '미커밋 변경사항을 자동으로 stash하고 rebase 후 복원하면서 `main` 위로 rebase하는 명령어는?',
    answer: 'git rebase --autostash main',
    explanation:
      '`--autostash`는 rebase 전에 자동으로 `stash`하고, rebase 완료 후 자동으로 `stash pop`합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'rebase 도중 커밋 분할',
    text: '인터랙티브 rebase에서 하나의 커밋을 여러 개로 분할하려면 어떤 명령어를 사용해야 하는가?',
    answer: 'edit',
    explanation:
      '`edit`으로 해당 커밋에서 중단 후, `git reset HEAD~1`로 커밋을 언두하고, 파일별로 나누어 `git add` + `git commit`을 반복한 후 `git rebase --continue`로 완료합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'exec으로 빌드 검증',
    text: '각 커밋마다 빌드가 통과하는지 확인하며 rebase하는 명령어는?',
    answer: 'git rebase -i --exec "make build" HEAD~10',
    explanation:
      '`--exec "make build"`는 각 커밋 적용 후 빌드 명령을 실행합니다. 빌드 실패 시 rebase가 중단되어 문제 커밋을 수정할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'committer date 유지',
    text: 'rebase 시 원래 커밋의 committer date를 author date와 동일하게 유지하는 명령어는?',
    answer: 'git rebase --committer-date-is-author-date main',
    explanation:
      '`--committer-date-is-author-date`는 rebase로 새로 생성되는 커밋의 committer date를 원래 author date로 설정합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'no-verify rebase',
    text: '인터랙티브 rebase 시 commit 훅을 건너뛰면서 진행하는 명령어는?',
    answer: 'git rebase -i --no-verify HEAD~5',
    explanation: '`--no-verify`는 rebase 과정에서 pre-commit 등의 훅 실행을 건너뜁니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'fork-point rebase',
    text: 'fork-point를 자동 감지하여 정확한 분기점부터 rebase하는 명령어는?',
    answer: 'git rebase --fork-point main',
    explanation:
      '`--fork-point`는 reflog을 사용하여 브랜치가 fork된 정확한 지점을 감지합니다. 업스트림이 rebase된 경우에도 올바른 범위를 계산합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'rebase 후 타임스탬프 초기화',
    text: 'rebase 시 모든 커밋의 author date를 현재 시간으로 재설정하는 명령어는?',
    answer: 'git rebase --reset-author-date main',
    explanation:
      '`--reset-author-date`는 rebase로 재생성되는 커밋의 author date를 현재 시간으로 변경합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'interactive rebase에서 label 사용',
    text: '`--rebase-merges` 모드에서 브랜치 구조를 정의하기 위해 사용하는 키워드는?',
    answer: 'label',
    explanation:
      '`--rebase-merges` 모드의 에디터에서 `label`, `reset`, `merge` 키워드로 브랜치 구조를 정의합니다. `label`은 특정 지점에 이름을 붙여 나중에 참조합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  {
    difficulty: 'HARD',
    title: 'update-ref rebase',
    text: 'rebase 시 중간 브랜치 포인터도 함께 업데이트하도록 하는 명령어는?',
    answer: 'git rebase -i --update-refs HEAD~10',
    explanation:
      '`--update-refs`는 rebase 범위 내에 다른 브랜치가 가리키는 커밋이 있을 때, 해당 브랜치 포인터도 함께 업데이트합니다.',
    categoryId: 1,
    subCategoryId: 7,
  },
  // =============================================
  // Git > Stash (categoryId: 1, subCategoryId: 8)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: 'stash 저장',
    text: '현재 워킹 디렉토리의 변경사항을 임시 저장(stash)하는 명령어는?',
    answer: 'git stash',
    explanation:
      '`git stash`는 수정된 추적 파일과 스테이징된 변경사항을 임시 스택에 저장하고, 워킹 디렉토리를 깨끗한 상태로 만듭니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: 'stash 복원',
    text: '가장 최근에 stash한 변경사항을 복원하고 stash 목록에서 제거하는 명령어는?',
    answer: 'git stash pop',
    explanation:
      '`git stash pop`은 가장 최근 stash를 워킹 디렉토리에 적용하고, stash 스택에서 제거합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: 'stash 목록 확인',
    text: '저장된 stash 목록을 확인하는 명령어는?',
    answer: 'git stash list',
    explanation:
      '`git stash list`는 저장된 모든 stash를 `stash@{0}`, `stash@{1}` 등의 인덱스와 함께 나열합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: 'stash 적용 (제거 안함)',
    text: '가장 최근 stash를 적용하되, stash 목록에서 제거하지 않는 명령어는?',
    answer: 'git stash apply',
    explanation:
      '`git stash apply`는 stash를 워킹 디렉토리에 적용하지만, stash 목록에 그대로 유지합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: 'stash 삭제',
    text: '가장 최근 stash를 삭제하는 명령어는?',
    answer: 'git stash drop',
    explanation:
      '`git stash drop`은 가장 최근 stash를 스택에서 제거합니다. 적용 없이 삭제만 합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: '모든 stash 삭제',
    text: '저장된 모든 stash를 한 번에 삭제하는 명령어는?',
    answer: 'git stash clear',
    explanation:
      '`git stash clear`는 stash 스택의 모든 항목을 삭제합니다. 복구할 수 없으므로 주의가 필요합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: '메시지와 함께 stash',
    text: '"작업 중인 로그인 기능"이라는 메시지와 함께 stash하는 명령어는?',
    answer: 'git stash push -m "작업 중인 로그인 기능"',
    explanation:
      '`git stash push -m "메시지"`는 설명 메시지와 함께 stash를 저장합니다. 나중에 목록에서 어떤 작업이었는지 식별하기 쉬워집니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: 'stash 내용 확인',
    text: '가장 최근 stash의 변경 내용을 확인하는 명령어는?',
    answer: 'git stash show',
    explanation:
      '`git stash show`는 가장 최근 stash의 변경된 파일과 수정 통계를 요약하여 보여줍니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: 'stash diff 확인',
    text: '가장 최근 stash의 상세한 diff를 확인하는 명령어는?',
    answer: 'git stash show -p',
    explanation:
      '`git stash show -p`(또는 `--patch`)는 stash의 변경 내용을 라인 단위 diff로 상세히 보여줍니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: '특정 stash 적용',
    text: '`stash@{2}` 항목을 적용하는 명령어는?',
    answer: 'git stash apply stash@{2}',
    explanation:
      '`git stash apply stash@{2}`는 인덱스를 지정하여 특정 stash를 적용합니다. 가장 최근 stash가 아닌 이전 stash를 적용할 때 사용합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'EASY',
    title: '특정 stash 삭제',
    text: '`stash@{1}` 항목을 삭제하는 명령어는?',
    answer: 'git stash drop stash@{1}',
    explanation: '`git stash drop stash@{1}`은 지정된 인덱스의 stash만 스택에서 제거합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: 'untracked 파일 포함 stash',
    text: '추적되지 않는(untracked) 파일까지 포함하여 stash하는 명령어는?',
    answer: 'git stash -u',
    explanation:
      '`git stash -u`(또는 `--include-untracked`)는 추적되지 않는 새 파일까지 stash에 포함합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: 'ignored 파일 포함 stash',
    text: '.gitignore에 등록된 파일까지 모두 포함하여 stash하는 명령어는?',
    answer: 'git stash -a',
    explanation:
      '`git stash -a`(또는 `--all`)는 추적되지 않는 파일과 무시된 파일까지 모두 stash에 포함합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: 'stash를 새 브랜치로',
    text: '가장 최근 stash를 `temp-work` 브랜치를 새로 생성하며 적용하는 명령어는?',
    answer: 'git stash branch temp-work',
    explanation:
      '`git stash branch temp-work`는 stash 생성 시점의 커밋에서 새 브랜치를 생성하고, stash를 적용한 후 stash를 삭제합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: '특정 파일만 stash',
    text: '`src/app.js` 파일의 변경사항만 stash하는 명령어는?',
    answer: 'git stash push src/app.js',
    explanation: '`git stash push <path>`는 지정된 파일의 변경사항만 선택적으로 stash합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: '인터랙티브 stash',
    text: '변경사항을 부분적으로 선택하여 stash하는 명령어는?',
    answer: 'git stash -p',
    explanation:
      '`git stash -p`(또는 `--patch`)는 각 변경 블록(hunk)을 하나씩 보여주며 stash 여부를 선택할 수 있게 합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: 'stash 인덱스 유지',
    text: 'stash 적용 시 스테이징 상태도 함께 복원하는 명령어는?',
    answer: 'git stash apply --index',
    explanation:
      '`--index` 옵션은 stash 저장 시 스테이징되어 있던 파일을 다시 스테이징 영역에 놓습니다. 옵션 없이 적용하면 모든 변경사항이 워킹 디렉토리에만 복원됩니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: '여러 파일 선택 stash',
    text: '`src/` 디렉토리의 변경사항만 메시지와 함께 stash하는 명령어는?',
    answer: 'git stash push -m "src changes" src/',
    explanation: '`git stash push -m "메시지" <path>`로 메시지와 경로를 동시에 지정할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: 'stash pop 특정 항목',
    text: '`stash@{2}` 항목을 적용하고 stash 목록에서 제거하는 명령어는?',
    answer: 'git stash pop stash@{2}',
    explanation: '`git stash pop stash@{2}`는 지정된 stash를 적용하고 목록에서 제거합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: 'stash에서 특정 파일만 복원',
    text: '가장 최근 stash에서 `config.js` 파일만 워킹 디렉토리로 복원하는 명령어는?',
    answer: 'git checkout stash@{0} -- config.js',
    explanation:
      '`git checkout stash@{0} -- config.js`는 stash에서 특정 파일만 선택적으로 복원합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: '스테이징된 것 제외 stash',
    text: '스테이징된 변경사항은 유지하고, 스테이징되지 않은 변경사항만 stash하는 명령어는?',
    answer: 'git stash --keep-index',
    explanation:
      '`--keep-index`는 스테이징 영역의 변경사항은 그대로 두고, 스테이징되지 않은 변경사항만 stash합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'NORMAL',
    title: '스테이징만 stash',
    text: '스테이징된 변경사항만 stash하는 명령어는?',
    answer: 'git stash --staged',
    explanation:
      '`git stash --staged`는 스테이징 영역의 변경사항만 stash합니다. Git 2.35에서 도입된 기능입니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: 'stash를 패치로 변환',
    text: '`stash@{0}`의 내용을 패치 파일로 추출하는 명령어는?',
    answer: 'git stash show -p stash@{0} > stash.patch',
    explanation:
      '`git stash show -p`의 출력을 파일로 리다이렉트하면 패치 파일을 생성할 수 있습니다. 다른 저장소에 적용하거나 백업할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash의 untracked 파일 확인',
    text: '`stash@{0}`에 포함된 추적되지 않는 파일 목록을 확인하는 명령어는?',
    answer: 'git show stash@{0}^3 --name-only',
    explanation:
      'stash의 세 번째 부모(`^3`)에 untracked 파일이 저장됩니다. `git show stash@{0}^3 --name-only`로 해당 파일 목록을 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash 내부 구조',
    text: 'stash는 내부적으로 몇 개의 커밋 객체로 구성되는가? (untracked 파일 미포함 기준)',
    answer: '2',
    explanation:
      'stash는 워킹 디렉토리 상태(stash 커밋)와 인덱스 상태(두 번째 부모)로 2개의 커밋으로 구성됩니다. untracked 포함 시 3번째 부모가 추가됩니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash 충돌 시 복원',
    text: 'stash pop 중 충돌이 발생하면 stash가 자동으로 삭제되는가?',
    answer: 'no',
    explanation:
      'stash pop 중 충돌이 발생하면 stash는 삭제되지 않고 목록에 남아있습니다. 충돌 해결 후 수동으로 `git stash drop`해야 합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash를 다른 브랜치에 적용',
    text: 'main 브랜치에 있는 상태에서 stash를 develop 브랜치에 적용하려면 어떤 순서로 명령어를 실행해야 하는가?',
    answer: 'git checkout develop && git stash pop',
    explanation:
      '먼저 `git checkout develop`으로 대상 브랜치로 이동한 후 `git stash pop`으로 stash를 적용합니다. stash는 어떤 브랜치에서든 적용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash ref로 직접 접근',
    text: 'stash를 refs/stash 참조로 직접 diff하여 현재 HEAD와 비교하는 명령어는?',
    answer: 'git diff refs/stash HEAD',
    explanation:
      '`refs/stash`는 가장 최근 stash를 가리키는 참조입니다. 일반 커밋처럼 diff, log 등의 명령어에서 참조로 사용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash에서 브랜치 생성 (특정 항목)',
    text: '`stash@{2}` 항목을 `recovery` 브랜치로 생성하며 적용하는 명령어는?',
    answer: 'git stash branch recovery stash@{2}',
    explanation:
      '`git stash branch <name> <stash>`는 특정 stash를 지정된 이름의 새 브랜치에 적용합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash 생성만 (저장 안함)',
    text: 'stash 객체를 생성하되 refs/stash에 저장하지 않고 해시만 출력하는 명령어는?',
    answer: 'git stash create',
    explanation:
      '`git stash create`는 stash 커밋 객체를 생성하고 해시를 출력하지만, stash 스택에 저장하지 않습니다. 스크립트에서 커스텀 stash 관리에 사용됩니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash store',
    text: '`git stash create`로 생성한 해시 `abc123`을 stash 스택에 "custom stash" 메시지로 저장하는 명령어는?',
    answer: 'git stash store -m "custom stash" abc123',
    explanation:
      '`git stash store`는 기존에 생성된 stash 커밋을 refs/stash에 저장합니다. `create`와 함께 사용하여 커스텀 stash 워크플로를 구현할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash 전체 diff 비교',
    text: '`stash@{0}`과 `stash@{1}`의 차이를 비교하는 명령어는?',
    answer: 'git diff stash@{0} stash@{1}',
    explanation:
      '`git diff stash@{0} stash@{1}`은 두 stash 간의 차이를 보여줍니다. stash도 커밋 객체이므로 일반 diff 명령어를 사용할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  {
    difficulty: 'HARD',
    title: 'stash push 정규식 패턴',
    text: '파일 이름이 `test`를 포함하는 파일의 변경사항만 stash하는 명령어는?',
    answer: 'git stash push -- $(git diff --name-only | grep test)',
    explanation:
      '`git diff --name-only`로 변경된 파일 목록을 얻고, `grep test`로 필터링한 후 `git stash push --`에 전달합니다.',
    categoryId: 1,
    subCategoryId: 8,
  },
  // =============================================
  // Git > Tag (categoryId: 1, subCategoryId: 9)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '태그 목록 확인',
    text: '로컬에 존재하는 모든 태그를 확인하는 명령어는?',
    answer: 'git tag',
    explanation: '`git tag`는 로컬 저장소에 생성된 모든 태그를 알파벳 순으로 나열합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: 'lightweight 태그 생성',
    text: '현재 커밋에 `v1.0` 이름의 lightweight 태그를 생성하는 명령어는?',
    answer: 'git tag v1.0',
    explanation:
      '`git tag v1.0`은 현재 HEAD 커밋에 lightweight 태그를 생성합니다. 별도의 메타데이터 없이 커밋에 대한 포인터만 생성됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: 'annotated 태그 생성',
    text: '"Release 1.0" 메시지를 포함한 `v1.0` annotated 태그를 생성하는 명령어는?',
    answer: 'git tag -a v1.0 -m "Release 1.0"',
    explanation:
      '`git tag -a v1.0 -m "Release 1.0"`은 태그 이름, 작성자, 날짜, 메시지 등의 메타데이터를 포함한 annotated 태그를 생성합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '태그 삭제',
    text: '로컬의 `v1.0` 태그를 삭제하는 명령어는?',
    answer: 'git tag -d v1.0',
    explanation:
      '`git tag -d v1.0`은 로컬 저장소에서 해당 태그를 삭제합니다. 원격 태그는 별도로 삭제해야 합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '태그 정보 확인',
    text: '`v1.0` 태그의 상세 정보를 확인하는 명령어는?',
    answer: 'git show v1.0',
    explanation:
      '`git show v1.0`은 태그 정보(annotated 태그의 경우 작성자, 날짜, 메시지)와 해당 커밋의 내용을 보여줍니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '태그 원격 푸시',
    text: '`v1.0` 태그를 `origin` 원격 저장소에 푸시하는 명령어는?',
    answer: 'git push origin v1.0',
    explanation:
      '`git push origin v1.0`은 특정 태그를 원격 저장소에 업로드합니다. 태그는 기본 push에 포함되지 않아 별도로 푸시해야 합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '모든 태그 푸시',
    text: '모든 로컬 태그를 `origin`에 한 번에 푸시하는 명령어는?',
    answer: 'git push origin --tags',
    explanation: '`git push origin --tags`는 로컬의 모든 태그를 원격 저장소에 업로드합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '특정 패턴 태그 검색',
    text: '`v1`으로 시작하는 태그만 검색하는 명령어는?',
    answer: 'git tag -l "v1*"',
    explanation:
      '`git tag -l "v1*"`은 와일드카드 패턴을 사용하여 `v1`으로 시작하는 태그만 필터링합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '태그로 체크아웃',
    text: '`v1.0` 태그 시점의 코드를 확인하기 위해 체크아웃하는 명령어는?',
    answer: 'git checkout v1.0',
    explanation:
      '`git checkout v1.0`은 해당 태그가 가리키는 커밋으로 체크아웃합니다. detached HEAD 상태가 됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '원격 태그 삭제',
    text: '`origin`의 `v1.0` 태그를 삭제하는 명령어는?',
    answer: 'git push origin --delete v1.0',
    explanation:
      '`git push origin --delete v1.0`은 원격 저장소에서 해당 태그를 삭제합니다. 로컬 태그는 별도로 삭제해야 합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'EASY',
    title: '특정 커밋에 태그',
    text: '커밋 `a1b2c3d`에 `v0.9` 태그를 생성하는 명령어는?',
    answer: 'git tag v0.9 a1b2c3d',
    explanation: '`git tag v0.9 a1b2c3d`는 현재 HEAD가 아닌 특정 커밋에 태그를 생성합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: 'annotated 태그에 서명',
    text: 'GPG 서명이 포함된 `v2.0` 태그를 "Signed release" 메시지로 생성하는 명령어는?',
    answer: 'git tag -s v2.0 -m "Signed release"',
    explanation:
      '`-s` 옵션은 GPG 키로 태그에 서명합니다. 서명된 태그는 `git tag -v`로 검증할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 서명 검증',
    text: '`v2.0` 태그의 GPG 서명을 검증하는 명령어는?',
    answer: 'git tag -v v2.0',
    explanation:
      '`git tag -v v2.0`은 해당 태그의 GPG 서명을 검증합니다. 유효한 서명인 경우 서명자 정보가 표시됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 간 diff',
    text: '`v1.0`과 `v2.0` 태그 사이의 변경사항을 비교하는 명령어는?',
    answer: 'git diff v1.0 v2.0',
    explanation: '`git diff v1.0 v2.0`은 두 태그가 가리키는 커밋 간의 전체 변경사항을 보여줍니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 간 로그',
    text: '`v1.0`부터 `v2.0`까지의 커밋 로그를 확인하는 명령어는?',
    answer: 'git log v1.0..v2.0',
    explanation: '`git log v1.0..v2.0`은 v1.0 이후부터 v2.0까지의 커밋 이력을 보여줍니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 정렬 출력',
    text: '태그를 버전 번호 순으로 정렬하여 출력하는 명령어는?',
    answer: 'git tag --sort=version:refname',
    explanation:
      '`--sort=version:refname`은 시맨틱 버저닝 규칙에 따라 태그를 정렬합니다. `v2.0`이 `v10.0`보다 먼저 표시됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그를 포함하는 브랜치',
    text: '`v1.5` 태그를 포함하는 브랜치 목록을 확인하는 명령어는?',
    answer: 'git branch --contains v1.5',
    explanation:
      '`git branch --contains v1.5`는 해당 태그가 가리키는 커밋을 포함하는 모든 브랜치를 나열합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그에서 브랜치 생성',
    text: '`v1.0` 태그를 기준으로 `hotfix-v1` 브랜치를 생성하는 명령어는?',
    answer: 'git checkout -b hotfix-v1 v1.0',
    explanation:
      '`git checkout -b hotfix-v1 v1.0`은 태그가 가리키는 커밋에서 새 브랜치를 생성하고 체크아웃합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 이름 변경',
    text: '`v1.0` 태그의 이름을 `v1.0.0`으로 변경하는 명령어 조합은? (기존 태그 삭제 후 새로 생성)',
    answer: 'git tag v1.0.0 v1.0 && git tag -d v1.0',
    explanation:
      '태그는 직접 이름 변경이 불가능합니다. `git tag v1.0.0 v1.0`으로 동일 커밋에 새 태그를 만들고, `git tag -d v1.0`으로 기존 태그를 삭제합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '최신 태그 확인',
    text: '현재 커밋에서 가장 가까운 태그 이름을 확인하는 명령어는?',
    answer: 'git describe --tags --abbrev=0',
    explanation:
      '`git describe --tags --abbrev=0`은 현재 커밋에서 도달 가능한 가장 최근 태그 이름만 출력합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '원격 태그만 가져오기',
    text: '`origin`에서 태그만 가져오는 명령어는?',
    answer: 'git fetch origin --tags',
    explanation: '`git fetch origin --tags`는 원격의 모든 태그를 로컬로 가져옵니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'NORMAL',
    title: '태그 간 변경 파일 목록',
    text: '`v1.0`과 `v2.0` 사이에서 변경된 파일 이름만 확인하는 명령어는?',
    answer: 'git diff --name-only v1.0 v2.0',
    explanation: '`git diff --name-only v1.0 v2.0`은 두 태그 간 변경된 파일의 이름만 나열합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: 'describe 상세 출력',
    text: '현재 커밋의 위치를 가장 가까운 태그 기준으로 "v1.0-3-g1a2b3c4" 형식으로 출력하는 명령어는?',
    answer: 'git describe --tags',
    explanation:
      '`git describe --tags`는 "가장 가까운 태그-이후 커밋 수-g현재 커밋 해시" 형식으로 출력합니다. 빌드 버전 식별에 유용합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '태그 포맷 출력',
    text: '모든 태그의 이름, 생성 날짜, 메시지를 커스텀 형식으로 출력하는 명령어는?',
    answer: 'git tag -l --format="%(refname:short) %(creatordate:short) %(subject)"',
    explanation:
      '`--format`은 `for-each-ref`의 포맷 문법을 사용하여 태그 정보를 커스텀 형식으로 출력합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '특정 커밋에 annotated 태그',
    text: '과거 커밋 `a1b2c3d`에 "Hotfix release" 메시지의 annotated 태그 `v1.0.1`을 생성하는 명령어는?',
    answer: 'git tag -a v1.0.1 a1b2c3d -m "Hotfix release"',
    explanation:
      '`git tag -a v1.0.1 a1b2c3d -m "Hotfix release"`는 특정 과거 커밋에 메시지를 포함한 annotated 태그를 생성합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '태그 강제 이동',
    text: '이미 존재하는 `latest` 태그를 현재 커밋으로 강제 이동시키는 명령어는?',
    answer: 'git tag -f latest',
    explanation:
      '`git tag -f latest`는 기존 `latest` 태그를 삭제하고 현재 커밋에 새로 생성합니다. `-f`(force) 없이는 이미 존재하는 태그명 사용이 거부됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '태그와 커밋 차이 카운트',
    text: '`v1.0` 태그 이후 현재 HEAD까지의 커밋 수를 확인하는 명령어는?',
    answer: 'git rev-list --count v1.0..HEAD',
    explanation:
      '`git rev-list --count v1.0..HEAD`는 태그 이후의 커밋 수를 계산합니다. 릴리스 간 변경 규모를 파악할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '태그 날짜순 정렬',
    text: '태그를 생성 날짜 기준 내림차순(최신 먼저)으로 정렬하여 출력하는 명령어는?',
    answer: 'git tag --sort=-creatordate',
    explanation:
      '`--sort=-creatordate`는 태그를 생성 날짜 기준 내림차순으로 정렬합니다. `-` 접두사가 내림차순을 의미합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '원격 태그 강제 갱신',
    text: '원격 `origin`의 `latest` 태그를 현재 커밋으로 강제 갱신하는 명령어는?',
    answer: 'git push origin -f latest',
    explanation:
      '`git push origin -f latest`는 원격의 기존 태그를 강제로 덮어씁니다. CI/CD에서 `latest` 태그를 갱신할 때 사용됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '릴리스 노트 자동 생성',
    text: '`v1.0`부터 `v2.0`까지의 커밋 메시지를 한 줄 요약으로 출력하는 명령어는?',
    answer: 'git log --oneline v1.0..v2.0',
    explanation:
      '`git log --oneline v1.0..v2.0`은 두 태그 사이의 커밋을 한 줄씩 요약합니다. 릴리스 노트 작성의 기초 자료로 활용됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: 'lightweight vs annotated 구분',
    text: '`v1.0` 태그가 annotated 태그인지 확인하기 위해 객체 타입을 출력하는 명령어는?',
    answer: 'git cat-file -t v1.0',
    explanation:
      '`git cat-file -t v1.0`은 객체 타입을 출력합니다. annotated 태그는 `tag`, lightweight 태그는 `commit`으로 표시됩니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '태그에서 아카이브 생성',
    text: '`v1.0` 태그 시점의 소스코드를 `release-v1.0.tar.gz`로 아카이브하는 명령어는?',
    answer: 'git archive --format=tar.gz --prefix=release-v1.0/ v1.0 -o release-v1.0.tar.gz',
    explanation:
      '`git archive`는 특정 태그나 커밋 시점의 소스코드를 압축 파일로 생성합니다. `--prefix`로 아카이브 내 디렉토리 접두사를 지정합니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  {
    difficulty: 'HARD',
    title: '원격에만 있는 태그 확인',
    text: '`origin` 원격 저장소의 태그 목록을 로컬 fetch 없이 직접 조회하는 명령어는?',
    answer: 'git ls-remote --tags origin',
    explanation:
      '`git ls-remote --tags origin`은 원격 저장소에 직접 연결하여 태그 목록과 해시를 조회합니다. fetch 없이 원격 태그를 확인할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 9,
  },
  // =============================================
  // Git > Log (categoryId: 1, subCategoryId: 10)
  // =============================================
  // --- EASY (11) ---
  {
    difficulty: 'EASY',
    title: '커밋 로그 확인',
    text: '커밋 이력을 확인하는 기본 명령어는?',
    answer: 'git log',
    explanation:
      '`git log`는 현재 브랜치의 커밋 이력을 최신 순으로 보여줍니다. 각 커밋의 해시, 작성자, 날짜, 메시지가 표시됩니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '한 줄 로그',
    text: '커밋 이력을 한 줄씩 간결하게 보는 명령어는?',
    answer: 'git log --oneline',
    explanation: '`git log --oneline`은 각 커밋을 짧은 해시와 메시지 한 줄로 표시합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '최근 N개 로그',
    text: '최근 5개 커밋만 확인하는 명령어는?',
    answer: 'git log -5',
    explanation: '`git log -5`는 출력할 커밋 수를 5개로 제한합니다. `-n 5`와 동일합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '그래프 로그',
    text: '브랜치 히스토리를 ASCII 그래프로 시각화하는 명령어는?',
    answer: 'git log --graph',
    explanation:
      '`git log --graph`는 커밋 이력을 ASCII 그래프로 시각화하여 브랜치 분기와 병합을 직관적으로 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '모든 브랜치 로그',
    text: '로컬의 모든 브랜치 커밋 이력을 한 번에 확인하는 명령어는?',
    answer: 'git log --all',
    explanation: '`git log --all`은 현재 브랜치뿐 아니라 모든 브랜치의 커밋을 표시합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '변경 파일 포함 로그',
    text: '각 커밋에서 변경된 파일 목록을 함께 보는 명령어는?',
    answer: 'git log --name-only',
    explanation: '`git log --name-only`는 각 커밋 정보와 함께 변경된 파일의 이름을 나열합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '변경 통계 포함 로그',
    text: '각 커밋의 파일별 추가/삭제 라인 수 통계를 함께 보는 명령어는?',
    answer: 'git log --stat',
    explanation:
      '`git log --stat`는 각 커밋에서 변경된 파일과 추가/삭제 라인 수를 요약하여 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '특정 파일 로그',
    text: '`src/app.js` 파일의 변경 이력만 확인하는 명령어는?',
    answer: 'git log -- src/app.js',
    explanation: '`git log -- src/app.js`는 해당 파일이 변경된 커밋만 필터링하여 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: 'patch 포함 로그',
    text: '각 커밋의 변경 내용(diff)을 함께 보는 명령어는?',
    answer: 'git log -p',
    explanation:
      '`git log -p`(또는 `--patch`)는 각 커밋의 변경 내용을 라인 단위 diff와 함께 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '그래프와 한 줄 로그 조합',
    text: '모든 브랜치의 커밋을 한 줄씩 그래프와 함께 보는 명령어는?',
    answer: 'git log --oneline --graph --all',
    explanation:
      '`--oneline --graph --all`을 조합하면 모든 브랜치의 히스토리를 간결한 그래프로 시각화할 수 있습니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'EASY',
    title: '작성자 필터 로그',
    text: '"John"이 작성한 커밋만 확인하는 명령어는?',
    answer: 'git log --author="John"',
    explanation: '`--author="John"`은 작성자 이름에 "John"이 포함된 커밋만 필터링합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  // --- NORMAL (11) ---
  {
    difficulty: 'NORMAL',
    title: '날짜 범위 로그',
    text: '2024년 1월 1일부터 2024년 6월 30일까지의 커밋을 확인하는 명령어는?',
    answer: 'git log --since="2024-01-01" --until="2024-06-30"',
    explanation: '`--since`와 `--until`으로 날짜 범위를 지정하여 커밋을 필터링합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '커밋 메시지 검색',
    text: '커밋 메시지에 "fix bug"가 포함된 커밋을 검색하는 명령어는?',
    answer: 'git log --grep="fix bug"',
    explanation: '`--grep="fix bug"`는 커밋 메시지에 해당 문자열이 포함된 커밋만 필터링합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '코드 변경 검색',
    text: '`function login`이라는 문자열이 추가되거나 삭제된 커밋을 찾는 명령어는?',
    answer: 'git log -S "function login"',
    explanation:
      '`-S "문자열"`은 해당 문자열의 등장 횟수가 변경된 커밋을 찾습니다. 코드에서 특정 함수가 추가/삭제된 시점을 추적할 때 유용합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '커스텀 포맷 로그',
    text: '커밋 해시(단축), 작성자, 메시지를 탭으로 구분하여 출력하는 명령어는?',
    answer: 'git log --pretty=format:"%h\t%an\t%s"',
    explanation:
      '`--pretty=format`으로 출력 형식을 지정합니다. `%h`는 단축 해시, `%an`은 작성자, `%s`는 커밋 메시지입니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '브랜치 간 로그',
    text: '`main`에는 없고 `feature`에만 있는 커밋을 확인하는 명령어는?',
    answer: 'git log main..feature',
    explanation:
      '`main..feature`는 `main`에서 도달할 수 없지만 `feature`에서 도달 가능한 커밋을 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '파일 변경 상태 로그',
    text: '각 커밋에서 파일의 변경 상태(추가/수정/삭제)를 함께 보는 명령어는?',
    answer: 'git log --name-status',
    explanation:
      '`--name-status`는 각 파일의 상태(A: 추가, M: 수정, D: 삭제)와 파일명을 함께 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '최근 일주일 로그',
    text: '최근 1주일 이내의 커밋만 확인하는 명령어는?',
    answer: 'git log --since="1 week ago"',
    explanation: '`--since`는 "1 week ago", "yesterday" 등 자연어 형태의 날짜 표현도 지원합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '정규식으로 메시지 검색',
    text: '커밋 메시지가 "fix"로 시작하는 커밋만 검색하는 명령어는?',
    answer: 'git log --grep="^fix"',
    explanation:
      '`--grep`은 정규식을 지원합니다. `^fix`는 메시지가 "fix"로 시작하는 커밋을 매칭합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: 'shortlog 요약',
    text: '작성자별 커밋 수와 메시지를 요약하여 보는 명령어는?',
    answer: 'git shortlog',
    explanation:
      '`git shortlog`는 작성자별로 그룹화하여 커밋 메시지를 요약합니다. 릴리스 노트 작성에 유용합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: '작성자별 커밋 수',
    text: '작성자별 커밋 수만 내림차순으로 요약하는 명령어는?',
    answer: 'git shortlog -sn',
    explanation: '`git shortlog -sn`에서 `-s`는 커밋 수만, `-n`은 내림차순 정렬을 의미합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'NORMAL',
    title: 'first-parent 로그',
    text: '머지 커밋의 첫 번째 부모만 따라가며 메인 라인 이력을 확인하는 명령어는?',
    answer: 'git log --first-parent',
    explanation:
      '`--first-parent`는 병합 커밋에서 첫 번째 부모만 추적하여 메인 브랜치의 히스토리만 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  // --- HARD (11) ---
  {
    difficulty: 'HARD',
    title: '정규식 코드 변경 검색',
    text: '정규식 패턴 `function\\s+login`과 일치하는 코드가 변경된 커밋을 찾는 명령어는?',
    answer: 'git log -G "function\\s+login"',
    explanation:
      '`-G`는 정규식 패턴과 일치하는 라인이 추가되거나 삭제된 커밋을 찾습니다. `-S`와 달리 정규식을 지원합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: 'diff-filter 로그',
    text: '새로 추가된(Added) 파일이 있는 커밋만 확인하는 명령어는?',
    answer: 'git log --diff-filter=A --name-only',
    explanation:
      '`--diff-filter=A`는 파일이 추가된 커밋만 필터링합니다. D(삭제), M(수정), R(이름변경) 등도 사용 가능합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: '양쪽 고유 커밋 비교',
    text: '`main`과 `feature` 양쪽에서 서로에게 없는 커밋을 모두 확인하는 명령어는?',
    answer: 'git log --left-right main...feature',
    explanation:
      '`--left-right`과 `...`(대칭 차이)를 사용하면 양쪽에서 고유한 커밋을 `<`(왼쪽)와 `>`(오른쪽)로 구분하여 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: 'blame으로 라인별 이력',
    text: '`app.js` 파일의 각 라인을 마지막으로 수정한 커밋을 확인하는 명령어는?',
    answer: 'git blame app.js',
    explanation:
      '`git blame app.js`는 각 라인을 마지막으로 수정한 커밋의 해시, 작성자, 날짜를 보여줍니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: '복합 포맷 로그',
    text: '커밋 해시(단축), 상대 날짜, 작성자, 데코레이션, 메시지를 한 줄로 출력하는 명령어는?',
    answer: 'git log --pretty=format:"%h %ar %an %d %s"',
    explanation:
      '`%h`는 단축 해시, `%ar`는 상대 날짜(3 days ago 등), `%an`은 작성자, `%d`는 브랜치/태그 데코레이션, `%s`는 메시지입니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: '파일 이름 변경 추적',
    text: '이름이 변경된 파일의 변경 이력까지 추적하는 로그 명령어는?',
    answer: 'git log --follow -- src/app.js',
    explanation:
      '`--follow`는 파일 이름이 변경되기 전의 이력까지 추적합니다. 단일 파일에 대해서만 사용 가능합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: 'walk-reflogs',
    text: '커밋 이력 대신 reflog(HEAD 이동 기록)을 로그 형식으로 출력하는 명령어는?',
    answer: 'git log -g',
    explanation:
      '`git log -g`(또는 `--walk-reflogs`)는 커밋 그래프가 아닌 reflog 엔트리를 순회하며 출력합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: '빈 커밋 검색',
    text: '부모 커밋과 트리가 동일한(변경사항이 없는) 빈 머지 커밋을 찾는 명령어는?',
    answer: 'git log --merges --diff-filter=d',
    explanation:
      '`--merges`로 머지 커밋만 필터링하고, `--diff-filter=d`로 변경이 없는 커밋을 식별합니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: '커밋 그래프 데이터 생성',
    text: '커밋 그래프 파일을 생성하여 로그 조회 성능을 향상시키는 명령어는?',
    answer: 'git commit-graph write --reachable',
    explanation:
      '`git commit-graph write --reachable`은 도달 가능한 커밋의 그래프 파일을 생성합니다. 대규모 저장소에서 `git log` 등의 성능을 크게 향상시킵니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: 'cherry로 미적용 커밋 확인',
    text: '`feature` 브랜치에서 `main`에 아직 cherry-pick 되지 않은 커밋을 확인하는 명령어는?',
    answer: 'git cherry main feature',
    explanation:
      '`git cherry main feature`는 패치 ID 기반으로 동일한 변경사항을 감지합니다. `+`는 미적용, `-`는 이미 적용된 커밋을 나타냅니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
  {
    difficulty: 'HARD',
    title: '다중 조건 로그 검색',
    text: '작성자가 "John"이고 커밋 메시지에 "fix"가 포함된 커밋만 검색하는 명령어는?',
    answer: 'git log --author="John" --grep="fix" --all-match',
    explanation:
      '`--all-match`는 여러 조건을 AND로 결합합니다. 이 옵션 없이는 OR로 동작하여 둘 중 하나만 만족해도 표시됩니다.',
    categoryId: 1,
    subCategoryId: 10,
  },
];
