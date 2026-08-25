from __future__ import annotations
import argparse
import subprocess

BRANCH_RULES = {
    "feature/issue-1-search": "features/issue-1-search.js",
    "feature/issue-2-room-filter": "features/issue-2-room-filter.js",
    "feature/issue-3-dark-mode": "features/issue-3-dark-mode.js",
    "feature/issue-4-cancel": "features/issue-4-cancel.js",
    "feature/issue-5-monthly-count": "features/issue-5-monthly-count.js",
}

def validate_scope(branch: str, changed_files: list[str]) -> list[str]:
    allowed = BRANCH_RULES.get(branch)
    if not allowed:
        return [f"研修用ブランチ名を確認できません: {branch}", "READMEの指定どおり feature/issue-N-... を使ってください。"]
    unexpected = sorted(path for path in changed_files if path != allowed)
    if not unexpected:
        return []
    return [f"{branch} で変更できるファイルは {allowed} だけです。", "担当外の変更: " + ", ".join(unexpected), "担当外の変更を戻してから、もう一度pushしてください。"]

def changed_files(base: str, head: str) -> list[str]:
    output = subprocess.check_output(["git", "diff", "--name-only", f"{base}...{head}"], text=True)
    return [line.strip() for line in output.splitlines() if line.strip()]

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--branch", required=True)
    parser.add_argument("--base", required=True)
    parser.add_argument("--head", required=True)
    args = parser.parse_args()
    errors = validate_scope(args.branch, changed_files(args.base, args.head))
    if errors:
        print("変更範囲チェック：FAIL")
        print("\n".join(errors))
        raise SystemExit(1)
    print("変更範囲チェック：PASS")
    print(f"{args.branch}: {BRANCH_RULES[args.branch]}")

if __name__ == "__main__":
    main()
