import streamlit as st
import sys
import os

# 1. Proje yollarını sunucuya tanıtıyoruz
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "backend"))
sys.path.append(os.path.join(current_dir, "backend", "app"))

# 2. Senin asıl backend sayfalarını ve FastAPI/Streamlit köprüsünü buraya bağlıyoruz
try:
    # backend/app klasörünün altındaki ana uygulamanı çağırıyoruz
    from main import app
    
    # Sayfa Başlığı ve Tasarımı
    st.set_page_config(page_title="TR-Analytix", layout="wide")
    
    # NOT: Eğer backend içindeki sayfaları doğrudan Streamlit'te çizdirdiysen 
    # projenin giriş fonksiyonunu burada tetikliyoruz.
    # Örneğin: main.py içinde "if __name__ == '__main__':" bloğunda ne çalışıyorsa o tetiklenecek.
    st.success("TR-Analytix Başarıyla Yüklendi!")
    
    # Senin asıl geliştirdiğin TradingView ve finans arayüz modüllerini buraya import edip başlatabilirsin.
    # Örnek: from api.routes import market_insights
    
except Exception as e:
    st.error(f"Arayüz yüklenirken bir sorun oluştu: {e}")
    