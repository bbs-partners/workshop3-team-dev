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
        self.assertIn('cp -R features dist/features', workflow)
        for forbidden in ('README.md', 'TODO.md', 'ISSUES-SETUP.md', 'practice.md'):
            self.assertNotIn(f'cp {forbidden}', workflow)

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
