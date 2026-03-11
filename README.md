# CardioApp – Map-Based Workout Tracker

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199903?style=for-the-badge&logo=leaflet&logoColor=white)

## 🚀 Live Demo
Aplikacja dostępna pod adresem: [cardioapp-three.vercel.app](https://cardioapp-three.vercel.app/)

## 📝 Opis projektu
**CardioApp** to interaktywny rejestrator aktywności fizycznej oparty na mapie. Aplikacja pozwala użytkownikowi na planowanie i zapisywanie treningów (bieganie, jazda na rowerze) bezpośrednio w miejscach, w których się odbyły. Projekt kładzie duży nacisk na obsługę danych geograficznych oraz trwałość informacji bez konieczności posiadania backendowej bazy danych.

## ✨ Kluczowe funkcjonalności
- **Inteligentna Geolokalizacja:** Aplikacja automatycznie pobiera współrzędne użytkownika (szerokość i długość geograficzną) za pomocą Browser Geolocation API i centruje mapę na jego aktualnej pozycji.
- **Interaktywne logowanie treningów:** Użytkownik może kliknąć w dowolne miejsce na mapie, aby otworzyć panel wprowadzania danych (rodzaj aktywności, czas, dystans, tempo lub zmiana wysokości).
- **Trwałość danych (Persistence):** Dzięki wykorzystaniu **Local Storage**, wszystkie zapisane pinezki i szczegóły treningów są przechowywane lokalnie w przeglądarce. Dane nie znikają po odświeżeniu strony.
- **Dynamiczny interfejs:** Lewy panel aktualizuje się w czasie rzeczywistym, wyświetlając listę wszystkich zarejestrowanych aktywności.

## 🛠 Stos technologiczny
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Mapy:** OpenStreetMap z wykorzystaniem biblioteki **Leaflet.js**.
- **Przechowywanie danych:** Local Storage API.
- **Geolokalizacja:** Navigator Geolocation API.

## 💡 Czego uczy ten projekt?
Budowa tej aplikacji była kluczowa dla zrozumienia:
1. **Asynchroniczności w praktyce:** Obsługa żądań o uprawnienia do lokalizacji użytkownika.
2. **Pracy z bibliotekami zewnętrznymi:** Integracja i konfiguracja Leaflet.js, obsługa zdarzeń (eventów) na mapie.
3. **Zarządzania stanem w Local Storage:** Parsowanie obiektów do formatu JSON i ich odczyt, aby zapewnić ciągłość doświadczenia użytkownika.
4. **Manipulacji DOM:** Dynamiczne tworzenie list i okienek pop-up na podstawie interakcji z mapą.

[W TYM MIEJSCU WRZUĆ GIF POKAZUJĄCY DODAWANIE TRENINGU NA MAPIE]

## 🔧 Uruchomienie lokalne
1. Sklonuj repozytorium:
   ```bash
   git clone [https://github.com/zywicki-314/cardioapp-three.git](https://github.com/zywicki-314/cardioapp-three.git)
