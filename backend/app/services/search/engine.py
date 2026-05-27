import re
import unicodedata
from typing import List, Tuple

from rapidfuzz import fuzz, process

from app.schemas.market import SearchResult
from app.services.search.catalog import SEARCH_CATALOG, CatalogEntry


def _normalize(text: str) -> str:
    """Türkçe karakterleri ASCII'ye yaklaştır + küçük harf."""
    text = text.strip().lower()
    text = unicodedata.normalize("NFKD", text)
    return "".join(c for c in text if not unicodedata.combining(c))


def _symbol_keys(entry: CatalogEntry) -> List[str]:
    sym = entry["symbol"]
    keys = [
        sym.lower(),
        sym.lower().replace(".is", ""),
        sym.lower().replace("-usd", ""),
        sym.lower().lstrip("^"),
    ]
    return list(dict.fromkeys(k for k in keys if k))


def _all_terms(entry: CatalogEntry) -> List[str]:
    terms = [entry["name"], *_symbol_keys(entry), *entry.get("aliases", [])]
    return [_normalize(t) for t in terms if t]


def _score_entry(query: str, entry: CatalogEntry) -> float:
    q = _normalize(query)
    if not q:
        return 0.0

    best = 0.0
    sym_clean = _normalize(entry["symbol"].replace(".IS", "").replace("-USD", ""))

    # Tam eşleşme / prefix — "thy" → THYAO
    if q == sym_clean:
        return 100.0
    if sym_clean.startswith(q) and len(q) >= 2:
        best = max(best, 98.0 - (len(sym_clean) - len(q)) * 2)

    for term in _all_terms(entry):
        if q == term:
            best = max(best, 99.0)
        elif term.startswith(q) and len(q) >= 2:
            best = max(best, 92.0)
        elif q in term:
            best = max(best, 85.0)
        # "türk" → "turk hava yollari" token
        if q in term.split():
            best = max(best, 88.0)

    # Kelime başlangıcı: "turk" eşleşmesi
    for word in re.split(r"[\s\-]+", " ".join(_all_terms(entry))):
        if word.startswith(q) and len(q) >= 3:
            best = max(best, 90.0)

    # Fuzzy
    for term in _all_terms(entry):
        ratio = fuzz.partial_ratio(q, term)
        token = fuzz.token_set_ratio(q, term)
        combined = max(ratio, token)
        if combined > best:
            best = combined

    # Kısa sorgular için eşik düşür
    if len(q) <= 3 and best >= 70:
        best = min(100, best + 5)

    return best


def fuzzy_search(query: str, limit: int = 10) -> List[SearchResult]:
    q = query.strip()
    if not q:
        return []

    scored: List[Tuple[float, CatalogEntry]] = []
    for entry in SEARCH_CATALOG:
        score = _score_entry(q, entry)
        min_threshold = 50 if len(q) <= 3 else 55
        if score >= min_threshold:
            scored.append((score, entry))

    scored.sort(key=lambda x: x[0], reverse=True)

    results: List[SearchResult] = []
    seen: set[str] = set()
    for score, entry in scored[:limit]:
        sym = entry["symbol"]
        if sym in seen:
            continue
        seen.add(sym)
        results.append(
            SearchResult(
                symbol=sym,
                name=entry["name"],
                asset_type=entry["asset_type"],
                exchange=entry.get("exchange"),
                score=round(score / 100, 3),
            )
        )

    # Ek fuzzy pass — kaçanları yakala
    if len(results) < limit:
        choices = {}
        for entry in SEARCH_CATALOG:
            for t in _all_terms(entry):
                choices[t] = entry
        extra = process.extract(_normalize(q), list(choices.keys()), scorer=fuzz.WRatio, limit=limit)
        for match_str, sc, _ in extra:
            if sc < 55:
                continue
            entry = choices[match_str]
            if entry["symbol"] not in seen:
                seen.add(entry["symbol"])
                results.append(
                    SearchResult(
                        symbol=entry["symbol"],
                        name=entry["name"],
                        asset_type=entry["asset_type"],
                        exchange=entry.get("exchange"),
                        score=round(sc / 100, 3),
                    )
                )
            if len(results) >= limit:
                break

    return results[:limit]
