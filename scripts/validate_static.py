from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = ("index.html", "style.css", "app.js")


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.local_assets: list[str] = []
        self.has_title = False
        self.html_lang = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html":
            self.html_lang = values.get("lang", "") or ""
        if tag == "title":
            self.has_title = True
        if values.get("id"):
            self.ids.append(values["id"] or "")
        for key in ("href", "src"):
            value = values.get(key)
            if not value or value.startswith(("#", "mailto:", "tel:", "data:")):
                continue
            parsed = urlparse(value)
            if not parsed.scheme and not parsed.netloc:
                self.local_assets.append(parsed.path)


def validate_css(css: str) -> None:
    depth = 0
    quote: str | None = None
    in_comment = False
    i = 0
    while i < len(css):
        pair = css[i : i + 2]
        char = css[i]
        if in_comment:
            if pair == "*/":
                in_comment = False
                i += 2
                continue
        elif quote:
            if char == "\\":
                i += 2
                continue
            if char == quote:
                quote = None
        elif pair == "/*":
            in_comment = True
            i += 2
            continue
        elif char in ("'", '"'):
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth < 0:
                raise ValueError("style.css has an unmatched closing brace")
        i += 1
    if in_comment:
        raise ValueError("style.css has an unterminated comment")
    if quote:
        raise ValueError("style.css has an unterminated string")
    if depth:
        raise ValueError("style.css has unbalanced braces")


def main() -> None:
    for relative in REQUIRED_FILES:
        path = ROOT / relative
        if not path.is_file() or path.stat().st_size == 0:
            raise FileNotFoundError(f"Missing or empty required file: {relative}")

    parser = SiteParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    parser.close()

    if parser.html_lang != "ja":
        raise ValueError('index.html must declare <html lang="ja">')
    if not parser.has_title:
        raise ValueError("index.html must contain a title")

    duplicate_ids = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    if duplicate_ids:
        raise ValueError(f"Duplicate HTML ids: {', '.join(duplicate_ids)}")

    for asset in parser.local_assets:
        if not (ROOT / asset).is_file():
            raise FileNotFoundError(f"Referenced local asset does not exist: {asset}")

    if "style.css" not in parser.local_assets or "app.js" not in parser.local_assets:
        raise ValueError("index.html must reference style.css and app.js")

    validate_css((ROOT / "style.css").read_text(encoding="utf-8"))
    print("Static site validation passed")


if __name__ == "__main__":
    main()
