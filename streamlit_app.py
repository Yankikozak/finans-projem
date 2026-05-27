import streamlit as st
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "backend", "app"))
st.set_page_config(page_title="TR-Analytix", layout="wide")
st.title("TR-Analytix Finans Platformu")
st.write("Uygulama basariyla baslatildi!")
