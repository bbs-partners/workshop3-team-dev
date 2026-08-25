import unittest
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEATURES = [
    'features/issue-1-search.js',
    'features/issue-2-room-filter.js',
    'features/issue-3-dark-mode.js',
    'features/issue-4-cancel.js',
    'features/issue-5-monthly-count.js',
]
BRANCHES = [
    'feature/issue-1-search',
    'feature/issue-2-room-filter',
    'feature/issue-3-dark-mode',
    'feature/issue-4-cancel',
    'feature/issue-5-monthly-count',
]

class RepositoryContractTest(unittest.TestCase):
    def test_five_team_files_exist_and_are_loaded(self):
        html = (ROOT / 'index.html').read_text(encoding='utf-8')
        for relative in FEATURES:
            self.assertTrue((ROOT / relative).is_file(), relative)
            self.assertIn(f'src="{relative}"', html)
            body = (ROOT / relative).read_text(encoding='utf-8')
            self.assertIn('このファイルだけを編集', body)

    def test_work1_still_uses_practice_md_only(self):
        practice = (ROOT / 'practice.md').read_text(encoding='utf-8')
        self.assertIn('同じファイルの同じ行', practice)
        self.assertIn('アプリ本体', practice)

    def test_pages_workflow_copies_only_runtime_allowlist(self):
        workflow = (ROOT / '.github/workflows/deploy-pages.yml').read_text(encoding='utf-8')
        self.assertIn('cp index.html style.css app.js dist/', workflow)
        self.assertIn('mkdir -p dist/features', workflow)
        self.assertNotIn('cp -R features', workflow)
        for relative in FEATURES:
            self.assertIn(f'cp {relative} dist/features/', workflow)
        for forbidden in ('README.md', 'TODO.md', 'ISSUES-SETUP.md', 'practice.md'):
            self.assertNotIn(f'cp {forbidden}', workflow)

    def test_exact_branch_names_are_visible_in_all_participant_sources(self):
        readme = (ROOT / 'README.md').read_text(encoding='utf-8')
        todo = (ROOT / 'TODO.md').read_text(encoding='utf-8')
        setup = (ROOT / 'ISSUES-SETUP.md').read_text(encoding='utf-8')
        for branch, relative in zip(BRANCHES, FEATURES):
            self.assertIn(branch, readme)
            self.assertIn(branch, todo)
            self.assertIn(branch, setup)
            feature = (ROOT / relative).read_text(encoding='utf-8')
            self.assertIn(branch, feature)

    def test_beginner_hints_cover_action_contract_and_initial_count(self):
        cancel = (ROOT / FEATURES[3]).read_text(encoding='utf-8')
        monthly = (ROOT / FEATURES[4]).read_text(encoding='utf-8')
        for token in ('label', 'onClick', 'className'):
            self.assertIn(token, cancel)
        self.assertIn('app.getReservations()', monthly)
        self.assertIn('最初', monthly)

    def test_reservation_id_is_escaped_before_html_output(self):
        app = (ROOT / 'app.js').read_text(encoding='utf-8')
        self.assertIn('data-reservation-id="${escapeHtml(r.id)}"', app)

    def test_issue_setup_preserves_slide_number_order_and_paths(self):
        setup = (ROOT / 'ISSUES-SETUP.md').read_text(encoding='utf-8')
        titles = re.findall(r'gh issue create --title "([^"]+)"', setup)
        self.assertEqual(titles, [
            '予約を名前で検索できるようにする',
            '会議室で絞り込めるようにする',
            'ダークモードを付ける',
            '予約をキャンセルできるようにする',
            '今月の予約件数を表示する',
        ])
        for relative in FEATURES:
            self.assertEqual(setup.count(relative), 1, relative)

if __name__ == '__main__':
    unittest.main()
