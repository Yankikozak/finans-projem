"""Temel analiz — Yahoo Finance bilanço/gelir metrikleri + yorum."""

from typing import Any, Optional

import yfinance as yf

from app.services.market_data.service import normalize_symbol


def _fmt_num(val: Any, suffix: str = "") -> Optional[str]:
    if val is None:
        return None
    try:
        v = float(val)
        if abs(v) >= 1e12:
            return f"{v / 1e12:.2f}T{suffix}"
        if abs(v) >= 1e9:
            return f"{v / 1e9:.2f}B{suffix}"
        if abs(v) >= 1e6:
            return f"{v / 1e6:.2f}M{suffix}"
        return f"{v:,.2f}{suffix}"
    except (TypeError, ValueError):
        return None


def build_fundamental_analysis(symbol: str, asset_type: str = "stock") -> dict[str, Any]:
    sym = normalize_symbol(symbol, asset_type)
    info: dict = {}
    try:
        info = yf.Ticker(sym).info or {}
    except Exception:
        pass

    pe = info.get("trailingPE") or info.get("forwardPE")
    eps = info.get("trailingEps")
    revenue = info.get("totalRevenue")
    profit_margin = info.get("profitMargins")
    debt_to_equity = info.get("debtToEquity")
    roe = info.get("returnOnEquity")
    dividend_yield = info.get("dividendYield")
    beta = info.get("beta")
    sector = info.get("sector") or "—"
    industry = info.get("industry") or "—"
    name = info.get("longName") or info.get("shortName") or sym

    metrics = {
        "pe_ratio": round(pe, 2) if pe else None,
        "eps": round(eps, 2) if eps else None,
        "revenue": _fmt_num(revenue),
        "profit_margin": f"{profit_margin * 100:.1f}%" if profit_margin else None,
        "debt_to_equity": round(debt_to_equity, 2) if debt_to_equity else None,
        "roe": f"{roe * 100:.1f}%" if roe else None,
        "dividend_yield": f"{dividend_yield * 100:.2f}%" if dividend_yield else None,
        "beta": round(beta, 2) if beta else None,
        "sector": sector,
        "industry": industry,
    }

    commentary_parts = [f"{name} ({sym.replace('.IS', '')}) temel analiz özeti:"]

    if pe:
        if pe < 12:
            commentary_parts.append(
                f"F/K oranı {pe:.1f} ile sektör ortalamasının altında kalabilir; değerleme cazip görünebilir."
            )
        elif pe > 30:
            commentary_parts.append(
                f"F/K {pe:.1f} ile yüksek büyüme beklentisi fiyatlanmış olabilir; kazanç hızı kritik."
            )
        else:
            commentary_parts.append(f"F/K {pe:.1f} dengeli bir değerleme bandında.")

    if profit_margin and profit_margin > 0.15:
        commentary_parts.append("Kar marjı güçlü; operasyonel verimlilik olumlu sinyal.")
    elif profit_margin and profit_margin < 0.05:
        commentary_parts.append("Düşük kar marjı maliyet baskısına işaret edebilir.")

    if beta:
        if beta > 1.3:
            commentary_parts.append(f"Beta {beta:.2f} — piyasaya göre daha volatil.")
        elif beta < 0.8:
            commentary_parts.append(f"Beta {beta:.2f} — görece defansif profil.")

    if not pe and asset_type == "crypto":
        commentary_parts.append(
            "Kripto varlıklarda klasik F/K metrikleri sınırlıdır; piyasa değeri, hacim ve ağ aktivitesi önceliklidir."
        )

    commentary = " ".join(commentary_parts)

    return {
        "symbol": sym,
        "name": name,
        "metrics": metrics,
        "commentary": commentary,
    }
