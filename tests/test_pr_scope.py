import unittest
from scripts.check_pr_scope import validate_scope

class PrScopeTest(unittest.TestCase):
    def test_issue_branch_can_change_only_its_feature_file(self):
        self.assertEqual(validate_scope('feature/issue-1-search', ['features/issue-1-search.js']), [])

    def test_issue_branch_rejects_shared_file(self):
        errors = validate_scope('feature/issue-1-search', ['features/issue-1-search.js', 'app.js'])
        self.assertTrue(errors)
        self.assertIn('app.js', '\n'.join(errors))

    def test_unknown_feature_branch_fails_closed(self):
        self.assertTrue(validate_scope('feature/other', ['features/issue-1-search.js']))

if __name__ == '__main__':
    unittest.main()
