"""Multi-provider AI orchestration — keys stay server-side only."""

from typing import Literal, Optional

from app.core.config import get_settings
from app.schemas.market import AIAnalysisResponse
from app.services.market_data.service import get_asset_analysis, get_asset_quote, normalize_symbol

settings = get_settings()


def _build_prompt(symbol: str, quote: dict, analysis: dict, mode: str) -> str:
    ind = analysis.get("indicators", {})
    risk = analysis.get("risk", {})
    return f"""Sen profesyonel bir finans analistisin. Türkçe, yatırımcı dostu ve özlü yaz.

Varlık: {symbol}
Fiyat: {quote.get('price')} {quote.get('currency', 'USD')}
Günlük değişim: %{quote.get('change_percent')}
RSI: {ind.get('rsi')}
MACD histogram: {ind.get('macd_hist')}
Risk skoru: {risk.get('score')} ({risk.get('level')})

Mod: {mode}

Şu formatta yanıt ver (JSON):
{{
  "summary": "2 cümle piyasa özeti",
  "trend": "trend yorumu",
  "risk_comment": "risk açıklaması",
  "technical_summary": "teknik analiz özeti"
}}"""


async def _call_openai(prompt: str, fast: bool = False) -> Optional[str]:
    if not settings.openai_api_key:
        return None
    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        model = settings.openai_model_fast if fast else settings.openai_model_primary
        resp = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Finans analisti. Sadece geçerli JSON döndür."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
        return resp.choices[0].message.content
    except Exception:
        return None


async def _call_gemini(prompt: str) -> Optional[str]:
    if not settings.gemini_api_key:
        return None
    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        resp = await model.generate_content_async(prompt + "\n\nYanıtı JSON olarak ver.")
        return resp.text
    except Exception:
        return None


def _fallback_analysis(symbol: str, quote: dict, analysis: dict) -> AIAnalysisResponse:
    ind = analysis.get("indicators", {})
    risk = analysis.get("risk", {})
    rsi = ind.get("rsi")
    level = risk.get("level", "medium")

    rsi_note = ""
    if rsi and rsi > 70:
        rsi_note = "yüksek RSI seviyesi kısa vadeli düzeltme riskine işaret ediyor"
    elif rsi and rsi < 30:
        rsi_note = "düşük RSI aşırı satım bölgesine yakınlık gösterebilir"
    else:
        rsi_note = "momentum göstergeleri dengeli bir görünüm sunuyor"

    name = quote.get("name", symbol)
    change = quote.get("change_percent", 0)
    momentum = "güçlü momentum" if change > 1 else "zayıf momentum" if change < -1 else "yatay seyir"

    summary = (
        f"{name} ({symbol}) {momentum} sergiliyor; ancak {rsi_note}."
    )
    return AIAnalysisResponse(
        symbol=symbol,
        summary=summary,
        trend=f"Günlük değişim %{change:.2f} — {'yükseliş' if change > 0 else 'düşüş' if change < 0 else 'yatay'} eğilimi baskın.",
        risk_comment=f"Risk seviyesi: {level.upper()} (skor {risk.get('score', 'N/A')}/100).",
        technical_summary=f"RSI: {rsi or 'N/A'} | MACD hist: {ind.get('macd_hist', 'N/A')}",
        model_used="nexus-rules-engine",
    )


async def generate_analysis(
    symbol: str,
    asset_type: Literal["stock", "crypto"] = "stock",
    mode: Literal["full", "quick"] = "full",
) -> AIAnalysisResponse:
    sym = normalize_symbol(symbol, asset_type)
    quote_obj = await get_asset_quote(sym, asset_type)
    analysis = await get_asset_analysis(sym, asset_type)

    quote = quote_obj.model_dump() if quote_obj else {"symbol": sym, "price": 0, "change_percent": 0, "name": sym}
    prompt = _build_prompt(sym, quote, analysis, mode)

    import json

    raw: Optional[str] = None
    model_used = "nexus-rules-engine"

    if mode == "quick":
        raw = await _call_openai(prompt, fast=True)
        model_used = settings.openai_model_fast
    else:
        raw = await _call_openai(prompt, fast=False)
        model_used = settings.openai_model_primary

    if not raw:
        raw = await _call_gemini(prompt)
        model_used = settings.gemini_model if raw else model_used

    if raw:
        try:
            # Strip markdown fences if present
            text = raw.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            data = json.loads(text.strip())
            return AIAnalysisResponse(
                symbol=sym,
                summary=data.get("summary", ""),
                trend=data.get("trend", ""),
                risk_comment=data.get("risk_comment", ""),
                technical_summary=data.get("technical_summary", ""),
                model_used=model_used,
            )
        except json.JSONDecodeError:
            pass

    return _fallback_analysis(sym, quote, analysis)
