# WIZUALIZACJE PROCEDUR I SYSTEM NAWIGACYJNY

*Załącznik nr 20 do [Regulaminu Samorządu Studenckiego Politechniki Opolskiej](01-regulamin-sspo.md)*

**🎯 Cel dokumentu:** Ten dokument zawiera wizualne odpowiedzi na wszystkie kluczowe pytania, które może mieć student na Politechnice Opolskiej. **90% problemów znajdzie tutaj swoje rozwiązanie** - bez konieczności czytania skomplikowanych przepisów.

**🚀 Jak korzystać:** Każdy diagram jest interaktywny - kliknij w elementy, aby przejść do szczegółowych regulaminów. Szukaj swojego problemu według kategorii.

---

## 🗺️ MAPA PROBLEMÓW - ZNAJDŹ SWOJĄ ODPOWIEDŹ

**Wybierz swoją sytuację i przejdź do odpowiedniego diagramu:**

```mermaid
flowchart TD
    START["🎓 JESTEM STUDENTEM POLITECHNIKI OPOLSKIEJ<br/>W CZYM MOGĘ CI POMÓC?"] --> KATEGORIE{Wybierz kategorię problemu}
    
    KATEGORIE --> A["🗳️ WYBORY I KANDYDOWANIE<br/>Chcę kandydować lub głosować"]
    KATEGORIE --> B["⚖️ PROBLEMY I SKARGI<br/>Mam problem, potrzebuję pomocy"]  
    KATEGORIE --> C["💰 PIENIĄDZE I STYPENDIA<br/>Sprawy finansowe"]
    KATEGORIE --> D["📚 SPRAWY DYDAKTYCZNE<br/>Problemy z nauką"]
    KATEGORIE --> E["🏛️ JAK TO DZIAŁA<br/>Chcę zrozumieć system"]
    KATEGORIE --> F["🚀 CHCĘ SIĘ ZAANGAŻOWAĆ<br/>Jak zostać aktywnym?"]
    
    A --> A1["Diagram: Procedura Wyborcza"]
    A --> A2["Diagram: Jak zostać kandydatem"]
    
    B --> B1["Diagram: Procedura skarg i wniosków"]  
    B --> B2["Diagram: Procedura etyczna"]
    B --> B3["Diagram: Odwołania i protesty"]
    
    C --> C1["Diagram: Cykl budżetowy"]
    C --> C2["Diagram: System stypendialny"]
    
    D --> D1["Diagram: System wsparcia akademickiego"]
    D --> D2["Diagram: Procedury dyscyplinarne"]
    
    E --> E1["Diagram: Struktura organizacyjna"]
    E --> E2["Diagram: Hierarchia prawna"]
    E --> E3["Diagram: Kto za co odpowiada"]
    
    F --> F1["Diagram: Ścieżki zaangażowania"]
    F2["Diagram: System rozwoju"]
    
    style START fill:#E1F5FE,stroke:#01579B,stroke-width:3px
    style A fill:#E8F5E8,stroke:#2E7D32,stroke-width:2px
    style B fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px  
    style C fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
    style D fill:#E0F2F1,stroke:#00695C,stroke-width:2px
    style E fill:#FFF8E1,stroke:#F57F17,stroke-width:2px
    style F fill:#FCE4EC,stroke:#C2185B,stroke-width:2px
```

---

---

## 🗳️ KATEGORIA: WYBORY I KANDYDOWANIE

### 1. Procedura Wyborcza - Pełny Cykl (na podstawie [Ordynacji Wyborczej](02-ordynacja-wyborcza.md))

Diagram przedstawia kolejne etapy wyborów do organów Samorządu, od ich zarządzenia aż do ukonstytuowania się nowych władz.

```mermaid
flowchart TD
    A[Start: Zarządzenie wyborów przez Komisję Rewizyjno-Wyborczą] --> B{Uchwalenie terminarza wyborczego};
    B --> C[Zgłaszanie kandydatów];
    C --> D{Weryfikacja i publikacja listy kandydatów};
    D --> E[Kampania wyborcza];
    E --> F((Cisza wyborcza - 24h));
    F --> G[Głosowanie];
    G --> H{Ustalenie i ogłoszenie wyników};
    H --> I{Czy są protesty?};
    I -- Tak --> J[Rozpatrzenie protestów przez Komisję];
    I -- Nie --> K[Zwołanie pierwszego posiedzenia nowego Parlamentu];
    J --> K;
    K --> L[Koniec];
```

### 2. JAK ZOSTAĆ KANDYDATEM - Przewodnik dla Studenta

**💡 Najczęściej zadawane pytanie: "Chcę kandydować, co mam robić?"**

```mermaid
flowchart TD
    START["🎯 CHCĘ KANDYDOWAĆ!<br/>Na co mogę kandydować?"] --> WYBOR{Wybierz urząd}
    
    WYBOR --> PARLAMENT["🏛️ PARLAMENT<br/>(posłowie - 15-25 osób)"]
    WYBOR --> PRZEWOD["👑 PRZEWODNICZĄCY SAMORZĄDU<br/>(jedna osoba)"] 
    WYBOR --> WRS["🏛️ WYDZIAŁOWA RADA STUDENTÓW<br/>(2-5 osób na wydziale)"]
    WYBOR --> KRW["⚖️ KOMISJA REWIZYJNO-WYBORCZA<br/>(3-5 osób)"]
    
    PARLAMENT --> PAR_REQ["📋 WYMAGANIA:<br/>✓ Być studentem PO<br/>✓ Nie być karany dyscyplinarnie<br/>✓ Zgłoszenie przez 10 studentów z wydziału"]
    PRZEWOD --> PRZE_REQ["📋 WYMAGANIA:<br/>✓ Być studentem PO<br/>✓ Nie być karany dyscyplinarnie<br/>✓ Zgłoszenie przez 25 studentów<br/>✓ Doświadczenie w samorządzie (zalecane)"]
    WRS --> WRS_REQ["📋 WYMAGANIA:<br/>✓ Być studentem danego wydziału<br/>✓ Nie być karany dyscyplinarnie<br/>✓ Zgłoszenie przez 5 studentów z wydziału"]
    KRW --> KRW_REQ["📋 WYMAGANIA:<br/>✓ Być studentem PO<br/>✓ Nie być karany dyscyplinarnie<br/>✓ NIE można być w innych organach<br/>✓ Zgłoszenie przez 3 posłów"]
    
    PAR_REQ --> PROCES["🗓️ PROCES:<br/>1. Zbierasz podpisy (zgodnie z wymogami)<br/>2. Składasz dokumenty do KRW<br/>3. KRW weryfikuje (3 dni)<br/>4. Kampania (7-14 dni)<br/>5. Cisza wyborcza (24h)<br/>6. WYBORY<br/>7. Wyniki (24h)"]
    PRZE_REQ --> PROCES
    WRS_REQ --> PROCES
    KRW_REQ --> PROCES
    
    PROCES --> SUKCES["🎉 GRATULACJE!<br/>Zostałeś wybrany"]
    PROCES --> PORAZKA["😔 Nie tym razem<br/>Spróbuj ponownie za 2 lata"]
    
    SUKCES --> SZKOLENIE["📚 OBOWIĄZKOWE:<br/>✓ Szkolenie dla nowych członków<br/>✓ Złożenie oświadczenia majątkowego<br/>✓ Zapoznanie się z regulaminami"]
    
    click PAR_REQ "./02-ordynacja-wyborcza.md#§-5" "Sprawdź szczegóły"
    click PRZE_REQ "./02-ordynacja-wyborcza.md#§-13" "Sprawdź szczegóły"
    click PROCES "./02-ordynacja-wyborcza.md#§-6-10" "Zobacz pełną procedurę"
    
    style START fill:#E3F2FD,stroke:#1976D2,stroke-width:3px
    style SUKCES fill:#E8F5E8,stroke:#388E3C,stroke-width:2px
    style PORAZKA fill:#FFEBEE,stroke:#D32F2F,stroke-width:2px
    style PROCES fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
```

---

## ⚖️ KATEGORIA: PROBLEMY I SKARGI

### 3. MAPA ROZWIĄZYWANIA PROBLEMÓW - "Mam problem, do kogo się zwrócić?"

```mermaid
flowchart TD
    PROBLEM["😟 MAM PROBLEM<br/>Potrzebuję pomocy!"] --> TYP{Jaki typ problemu?}
    
    TYP --> DYDY["📚 PROBLEM DYDAKTYCZNY<br/>(oceny, zaliczenia, prowadzący)"]
    TYP --> SOCI["🏠 PROBLEM SOCJALNO-BYTOWY<br/>(stypendia, akademik, żywienie)"]
    TYP --> DYSCYP["⚖️ POSTĘPOWANIE DYSCYPLINARNE<br/>(zostałem oskarżony)"]
    TYP --> ETYKA["🤝 NARUSZENIE ETYKI<br/>(przez członka samorządu)"]
    TYP --> ADMIN["🏛️ PROBLEM ADMINISTRACYJNY<br/>(procedury, decyzje dziekanatu)"]
    TYP --> DYSKRYM["🚫 DYSKRYMINACJA/MOBBING<br/>(ze strony kadry lub studentów)"]
    
    DYDY --> DY_GDZIE["🎯 GDZIE SIĘ ZGŁOSIĆ:<br/>1️⃣ Przewodniczący WRS (twój wydział)<br/>2️⃣ Rzecznik Praw Studenta<br/>3️⃣ Zarząd SSPO"]
    SOCI --> SO_GDZIE["🎯 GDZIE SIĘ ZGŁOSIĆ:<br/>1️⃣ Zarząd SSPO<br/>2️⃣ Przewodniczący WRS<br/>3️⃣ Komisja stypendialna"]
    DYSCYP --> DI_GDZIE["🎯 GDZIE SIĘ ZGŁOSIĆ:<br/>1️⃣ NATYCHMIAST do Rzecznika Praw Studenta<br/>2️⃣ Zarząd SSPO (wsparcie prawne)<br/>⚠️ WAŻNE: Masz prawo do obrony!"]
    ETYKA --> ET_GDZIE["🎯 GDZIE SIĘ ZGŁOSIĆ:<br/>1️⃣ Komisja Etyki (wniosek pisemny)<br/>2️⃣ Przewodniczący Parlamentu"]
    ADMIN --> AD_GDZIE["🎯 GDZIE SIĘ ZGŁOSIĆ:<br/>1️⃣ Rzecznik Praw Studenta<br/>2️⃣ Przewodniczący WRS<br/>3️⃣ Zarząd SSPO"]
    DYSKRYM --> DI2_GDZIE["🎯 GDZIE SIĘ ZGŁOSIĆ:<br/>1️⃣ Komisja Etyki (jeśli przez studenta)<br/>2️⃣ Rzecznik Praw Studenta (jeśli przez kadrę)<br/>3️⃣ Zarząd SSPO<br/>☎️ Telefon zaufania: [numer]"]
    
    DY_GDZIE --> PROCEDURA["📝 CO DALEJ?<br/>✓ Składasz wniosek (pisemnie/mailowo)<br/>✓ Odpowiedź w ciągu 7 dni<br/>✓ Jeśli niezadowalająca - odwołanie<br/>✓ Wsparcie przez cały proces"]
    SO_GDZIE --> PROCEDURA
    DI_GDZIE --> PROC_DYSCYP["⚖️ PROCEDURA DYSCYPLINARNA:<br/>✓ Prawo do obrońcy<br/>✓ Wsparcie Rzecznika<br/>✓ Możliwość odwołania<br/>✓ Dokumentacja wszystkiego"]
    ET_GDZIE --> PROC_ETYKA["🤝 PROCEDURA ETYCZNA:<br/>✓ Postępowanie wyjaśniające (30 dni)<br/>✓ Możliwość mediacji<br/>✓ Prawo do odwołania (14 dni)<br/>✓ Poufność postępowania"]
    AD_GDZIE --> PROCEDURA
    DI2_GDZIE --> PROC_ANTYMOBING["🚫 PROCEDURA ANTYMOBBINGOWA:<br/>✓ Natychmiastowa reakcja<br/>✓ Poufność i wsparcie<br/>✓ Działania naprawcze<br/>✓ Monitorowanie sytuacji"]
    
    click DY_GDZIE "./01-regulamin-sspo.md#§-26" "Kompetencje WRS"
    click ET_GDZIE "./06-regulamin-komisji-etyki.md" "Regulamin Komisji Etyki"
    click PROC_ETYKA "./06-regulamin-komisji-etyki.md#§-7-11" "Tryb postępowania"
    
    style PROBLEM fill:#FFEBEE,stroke:#D32F2F,stroke-width:3px
    style PROC_DYSCYP fill:#E1F5FE,stroke:#0277BD,stroke-width:2px
    style PROC_ETYKA fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
    style PROC_ANTYMOBING fill:#E8F5E8,stroke:#388E3C,stroke-width:2px
```

### 4. Postępowanie przed Komisją Etyki - SZCZEGÓŁOWY PROCES (na podstawie [Regulaminu Komisji Etyki](06-regulamin-komisji-etyki.md))

Diagram ilustruje ścieżkę postępowania w przypadku zgłoszenia naruszenia zasad etycznych przez członka organu Samorządu.

```mermaid
flowchart TD
    subgraph "Etap Wstępny"
        A[Start: Zgłoszenie naruszenia zasad etyki] --> B{Weryfikacja formalna wniosku};
        B -- Wniosek poprawny --> C{Wszczęcie postępowania};
        B -- Braki formalne --> D[Wezwanie do uzupełnienia braków];
    end

    subgraph "Postępowanie Wyjaśniające (do 30 dni)"
        C --> E[Zbieranie dowodów];
        E --> F[Wysłuchanie stron i świadków];
        F --> G[Analiza materiału dowodowego];
    end

    subgraph "Orzeczenie i Sankcje"
        G --> H{Wydanie orzeczenia};
        H -- Stwierdzono naruszenie --> I{Zastosowanie sankcji};
        H -- Brak naruszenia --> J[Zakończenie i umorzenie postępowania];
        I --> I1[1. Upomnienie];
        I --> I2[2. Zobowiązanie do przeprosin];
        I --> I3[3. Wniosek do Parlamentu o dalsze sankcje];
    end

    subgraph "Procedura Odwoławcza"
        I1 --> K{Czy strona składa odwołanie do Parlamentu? (14 dni)};
        I2 --> K;
        I3 --> K;
        K -- Tak --> L[Rozpatrzenie odwołania przez Parlament];
        K -- Nie --> M[Koniec: Orzeczenie jest ostateczne];
        L --> M;
        J --> M;
    end
```

---

## 💰 KATEGORIA: PIENIĄDZE I STYPENDIA

### 5. SYSTEM STYPENDIALNY - "Jak dostać stypendium?"

```mermaid
flowchart TD
    START["💰 CHCĘ STYPENDIUM<br/>Jakie mam opcje?"] --> TYPY{Rodzaje stypendiów}
    
    TYPY --> SOCJALNE["🏠 STYPENDIUM SOCJALNE<br/>(dla studentów w trudnej sytuacji)"]
    TYPY --> NAUKOWE["🎓 STYPENDIUM ZA WYNIKI NAUKOWE<br/>(dla najlepszych studentów)"]
    TYPY --> SPORT["🏃 STYPENDIUM SPORTOWE<br/>(dla zawodników)"]
    TYPY --> SPEC["⭐ STYPENDIA SPECJALNE<br/>(rektora, ministra, fundacyjne)"]
    
    SOCJALNE --> SOC_WYM["📋 WYMAGANIA:<br/>✓ Średnia min. 3,0<br/>✓ Niski dochód na członka rodziny<br/>✓ Dokumenty o dochodach<br/>✓ Brak zadłużenia wobec uczelni"]
    NAUKOWE --> NAU_WYM["📋 WYMAGANIA:<br/>✓ Średnia min. 4,0<br/>✓ Bez długów 'niedostatecznych'<br/>✓ Terminowe zaliczenie sesji<br/>✓ Brak zadłużenia wobec uczelni"]
    SPORT --> SPO_WYM["📋 WYMAGANIA:<br/>✓ Średnia min. 3,0<br/>✓ Reprezentowanie uczelni w sporcie<br/>✓ Osiągnięcia sportowe<br/>✓ Zaświadczenie od trenera"]
    SPEC --> SPE_WYM["📋 WYMAGANIA:<br/>✓ Różne kryteria (zależnie od typu)<br/>✓ Wysokie osiągnięcia<br/>✓ Rekomendacje<br/>✓ Dodatkowa dokumentacja"]
    
    SOC_WYM --> GDZIE["📍 GDZIE SKŁADAĆ:<br/>1️⃣ Dziekanat wydziału<br/>2️⃣ Komisja stypendialna<br/>3️⃣ System elektroniczny USOS"]
    NAU_WYM --> GDZIE
    SPO_WYM --> GDZIE  
    SPE_WYM --> GDZIE
    
    GDZIE --> PROCES["⏰ HARMONOGRAM:<br/>📅 Wrzesień: Nabór wniosków<br/>📅 Październik: Rozpatrywanie<br/>📅 Listopad: Decyzje<br/>📅 Listopad-Czerwiec: Wypłaty"]
    
    PROCES --> DECYZJA{Decyzja komisji}
    DECYZJA --> PRZYZNANE["✅ STYPENDIUM PRZYZNANE<br/>💰 Wypłata co miesiąc<br/>📊 Monitorowanie wyników"]
    DECYZJA --> ODRZUCONE["❌ WNIOSEK ODRZUCONY<br/>📄 Uzasadnienie pisemne<br/>⚖️ Możliwość odwołania"]
    
    ODRZUCONE --> ODWOLANIE["📝 ODWOŁANIE (14 dni):<br/>✓ Do komisji odwoławczej<br/>✓ Wsparcie przedstawiciela studentów<br/>✓ Możliwość uzupełnienia dokumentów"]
    
    PRZYZNANE --> OBOWIAZKI["⚠️ OBOWIĄZKI STYPENDYSTY:<br/>✓ Utrzymanie wymaganej średniej<br/>✓ Terminowe zaliczanie sesji<br/>✓ Informowanie o zmianach<br/>✓ Zwrot w przypadku naruszenia zasad"]
    
    click GDZIE "./04-regulamin-finansowy.md#system-stypendialny" "Regulamin finansowy"
    click ODWOLANIE "./12-system-rozwoju.md#§-18" "Procedura odwołań"
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style PRZYZNANE fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style ODRZUCONE fill:#FFCDD2,stroke:#D32F2F,stroke-width:2px
    style OBOWIAZKI fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
```

### 6. Cykl Budżetowy - "Skąd biorą się pieniądze w samorządzie?"

```mermaid
flowchart TD
    START["💰 BUDŻET SSPO<br/>Jak działają finanse samorządu?"] --> ZRODLA{Źródła dochodów}
    
    ZRODLA --> DOTACJA["🏛️ DOTACJA UCZELNI<br/>Główne źródło finansowania"]
    ZRODLA --> OPLATY["💳 OPŁATY STUDENTÓW<br/>Składki członkowskie"]
    ZRODLA --> GRANTY["📝 GRANTY I PROJEKTY<br/>Zewnętrzne finansowanie"]
    ZRODLA --> INNE["💡 INNE ŹRÓDŁA<br/>Darowizny, sprzedaż, usługi"]
    
    DOTACJA --> PLANOWANIE["📊 PLANOWANIE BUDŻETU<br/>Marzec-Kwiecień każdego roku"]
    OPLATY --> PLANOWANIE
    GRANTY --> PLANOWANIE
    INNE --> PLANOWANIE
    
    PLANOWANIE --> PARLAMENT["🏛️ UCHWALENIE W PARLAMENCIE<br/>Głosowanie nad projektem budżetu"]
    
    PARLAMENT --> KATEGORIE{Kategorie wydatków}
    
    KATEGORIE --> DZIALALNOSC["🎯 DZIAŁALNOŚĆ PODSTAWOWA<br/>• Posiedzenia i wydarzenia<br/>• Materiały biurowe<br/>• Komunikacja i marketing"]
    KATEGORIE --> STYPENDIA["💰 FUNDUSZ STYPENDIALNY<br/>• Stypendia socjalne<br/>• Stypendia za wyniki<br/>• Stypendia specjalne"]
    KATEGORIE --> WYDARZENIA["🎉 WYDARZENIA I PROJEKTY<br/>• Imprezy integracyjne<br/>• Konferencje naukowe<br/>• Projekty społeczne"]
    KATEGORIE --> ADMIN["⚙️ KOSZTY ADMINISTRACYJNE<br/>• Wynagrodzenia<br/>• Utrzymanie biura<br/>• Systemy IT"]
    
    DZIALALNOSC --> WYKONANIE["💳 WYKONANIE BUDŻETU<br/>Przez cały rok akademicki"]
    STYPENDIA --> WYKONANIE
    WYDARZENIA --> WYKONANIE
    ADMIN --> WYKONANIE
    
    WYKONANIE --> KONTROLA["🔍 KONTROLA FINANSOWA<br/>• Komisja Rewizyjna (WRS)<br/>• Comiesięczne raporty<br/>• Kontrola wydatków"]
    
    KONTROLA --> SPRAWOZDANIE["📋 SPRAWOZDANIE ROCZNE<br/>• Zestawienie wydatków<br/>• Analiza realizacji celów<br/>• Rekomendacje na przyszłość"]
    
    SPRAWOZDANIE --> ABSOLUTORIUM["✅ ABSOLUTORIUM<br/>Głosowanie Parlamentu nad<br/>udzieleniem absolutorium Zarządowi"]
    
    ABSOLUTORIUM --> UDZIELONE["✅ ABSOLUTORIUM UDZIELONE<br/>Budżet wykonany prawidłowo"]
    ABSOLUTORIUM --> NIEUDZIELONE["❌ ABSOLUTORIUM NIEUDZIELONE<br/>Konieczność wyjaśnień<br/>i naprawy nieprawidłowości"]
    
    NIEUDZIELONE --> KONSEKWENCJE["⚠️ KONSEKWENCJE:<br/>• Możliwość wotum nieufności<br/>• Konieczność korekty procedur<br/>• Wzmożona kontrola"]
    
    click PLANOWANIE "./04-regulamin-finansowy.md#planowanie-budzetu" "Proces planowania budżetu"
    click KONTROLA "./05-regulamin-wrs.md#kontrola-finansowa" "Kontrola przez WRS"
    click ABSOLUTORIUM "./01-regulamin-sspo.md#absolutorium" "Procedura absolutorium"
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style UDZIELONE fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style NIEUDZIELONE fill:#FFCDD2,stroke:#D32F2F,stroke-width:2px
    style KONSEKWENCJE fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
```

---

## 📚 KATEGORIA: SPRAWY UCZELNIANE

### 7. System Dyscyplinarny - "Co gdy mam problemy z uczelnią?"

```mermaid
flowchart TD
    START["⚖️ PROBLEMY UCZELNIANE<br/>Co robić gdy pojawi się konflikt?"] --> TYP{Rodzaj problemu}
    
    TYP --> AKADEMICKI["📚 PROBLEMY AKADEMICKIE<br/>• Niezaliczone przedmioty<br/>• Konflikty z wykładowcami<br/>• Pytania o program studiów"]
    TYP --> DYSC["⚖️ POSTĘPOWANIE DYSCYPLINARNE<br/>• Oskarżenia o naruszenie regulaminu<br/>• Podejrzenie plagiatu<br/>• Nieodpowiednie zachowanie"]
    TYP --> ADMIN["🏢 PROBLEMY ADMINISTRACYJNE<br/>• Błędy w dokumentach<br/>• Opłaty i sprawy finansowe<br/>• Problemy z systemami IT"]
    TYP --> DYSKRYMINACJA["🚫 DYSKRYMINACJA I MOBBING<br/>• Nierówne traktowanie<br/>• Molestowanie<br/>• Naruszenie godności"]
    
    AKADEMICKI --> AK_KROK1["1️⃣ ROZMOWA Z WYKŁADOWCĄ<br/>Pierwsza próba rozwiązania"]
    AK_KROK1 --> AK_KROK2["2️⃣ PRODZIEKAN DS. STUDENCKICH<br/>Gdy rozmowa nie pomogła"]
    AK_KROK2 --> AK_KROK3["3️⃣ DZIEKAN WYDZIAŁU<br/>Oficjalne rozpatrzenie sprawy"]
    AK_KROK3 --> AK_WSPARCIE["💬 WSPARCIE SAMORZĄDU:<br/>• Pełnomocnik ds. studenckich<br/>• Przedstawiciel w komisjach<br/>• Doradztwo i mediacja"]
    
    DYSC --> DYSC_INFO["📢 OTRZYMANIE INFORMACJI<br/>O wszczęciu postępowania"]
    DYSC_INFO --> DYSC_PRAWO["⚖️ TWOJE PRAWA:<br/>• Prawo do obrony<br/>• Prawo do przedstawiciela<br/>• Dostęp do akt sprawy<br/>• Prawo do odwołania"]
    DYSC_PRAWO --> DYSC_WYBOR{Wybór reprezentacji}
    
    DYSC_WYBOR --> KOLEGH["👥 KOLEGIUM HONOROWYCH<br/>Studenccy przedstawiciele<br/>w komisjach dyscyplinarnych"]
    DYSC_WYBOR --> PRAWNIK["👨‍💼 PRAWNIK/ADWOKAT<br/>Profesjonalna pomoc prawna"]
    DYSC_WYBOR --> SAMODZIELNIE["🙋 OBRONA WŁASNA<br/>Samodzielne prowadzenie sprawy"]
    
    KOLEGH --> PROCES["📋 PROCES DYSCYPLINARNY:<br/>• Postępowanie wyjaśniające<br/>• Przesłuchanie świadków<br/>• Analiza dowodów<br/>• Wydanie orzeczenia"]
    PRAWNIK --> PROCES
    SAMODZIELNIE --> PROCES
    
    ADMIN --> ADMIN_DZIEK["📞 KONTAKT Z DZIEKATEM<br/>Bezpośrednie rozwiązanie"]
    ADMIN_DZIEK --> ADMIN_REKTOR["📞 URZĄD REKTORA<br/>Gdy dziekanat nie pomaga"]
    ADMIN_REKTOR --> ADMIN_ZEWN["📞 INSTANCJE ZEWNĘTRZNE<br/>Minister, Rzecznik Praw Studenta"]
    
    DYSKRYMINACJA --> DISK_ZGLOSZ["📢 ZGŁOSZENIE PROBLEMU<br/>• Komisja Etyki SSPO<br/>• Pełnomocnik ds. równego traktowania<br/>• Rzecznik dyscyplinarny"]
    DISK_ZGLOSZ --> DISK_DOC["📋 DOKUMENTACJA:<br/>• Zapisanie wszystkich incydentów<br/>• Zbieranie świadków<br/>• Zabezpieczenie dowodów"]
    DISK_DOC --> DISK_PROC["⚖️ POSTĘPOWANIE:<br/>• Dochodzenie wewnętrzne<br/>• Mediacja lub proces<br/>• Środki naprawcze"]
    
    PROCES --> WYROK{Orzeczenie komisji}
    WYROK --> UNIEWINNIENIE["✅ UNIEWINNIENIE<br/>Brak dowodów winy"]
    WYROK --> KARY["❌ ORZECZENIE KARY:<br/>• Upomnienie<br/>• Nagana<br/>• Zawieszenie praw studenta<br/>• Relegowanie"]
    
    KARY --> ODWOLANIE["📝 ODWOŁANIE (14 dni):<br/>✓ Do komisji odwoławczej<br/>✓ Wsparcie Kolegium Honorowych<br/>✓ Wniesienie nowych dowodów"]
    
    AK_WSPARCIE --> ROZWIAZANE["✅ PROBLEM ROZWIĄZANY<br/>Powrót do normalnego studiowania"]
    ADMIN_ZEWN --> ROZWIAZANE
    DISK_PROC --> ROZWIAZANE
    UNIEWINNIENIE --> ROZWIAZANE
    ODWOLANIE --> ROZWIAZANE
    
    click KOLEGH "./07-regulamin-kolegium-honorowych.md" "Kolegium Honorowych"
    click DISK_ZGLOSZ "./06-regulamin-komisji-etyki.md" "Komisja Etyki"
    click AK_WSPARCIE "./12-system-rozwoju.md#pelnomocnik-ds-studenckich" "Pełnomocnik ds. studenckich"
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style ROZWIAZANE fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style KARY fill:#FFCDD2,stroke:#D32F2F,stroke-width:2px
    style DYSC_PRAWO fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
```

---

## 🧭 KATEGORIA: ZROZUMIEĆ SYSTEM

### 8. Hierarchia i Podległość - "Kto za co odpowiada?"

```mermaid
flowchart TD
    START["🧭 STRUKTURA WŁADZY<br/>Jak działa samorząd studencki?"] --> POZIOMY{Poziomy władzy}
    
    POZIOMY --> USTAWODAWCZA["🏛️ WŁADZA USTAWODAWCZA<br/>PARLAMENT STUDENCKI"]
    POZIOMY --> WYKONAWCZA["⚖️ WŁADZA WYKONAWCZA<br/>ZARZĄD SSPO"]
    POZIOMY --> KONTROLNA["🔍 WŁADZA KONTROLNA<br/>WRS + KOMISJE"]
    POZIOMY --> SADOWNICZA["⚖️ WŁADZA SĄDOWNICZA<br/>KOMISJE DYSCYPLINARNE"]
    
    USTAWODAWCZA --> PARL_ZADANIA["📋 ZADANIA PARLAMENTU:<br/>• Uchwalanie regulaminów<br/>• Uchwalanie budżetu<br/>• Kontrola Zarządu<br/>• Wybór organów<br/>• Udzielanie absolutoriów"]
    PARL_ZADANIA --> PARL_SKLAT["👥 SKŁAD (15 osób):<br/>• Prezydent (przewodniczący)<br/>• 14 posłów wybranych w wyborach<br/>• Kadencja: 2 lata"]
    
    WYKONAWCZA --> ZARZ_ZADANIA["📋 ZADANIA ZARZĄDU:<br/>• Wykonywanie uchwał Parlamentu<br/>• Zarządzanie budżetem<br/>• Reprezentacja na zewnątrz<br/>• Koordynacja działalności<br/>• Realizacja projektów"]
    ZARZ_ZADANIA --> ZARZ_SKLAT["👥 SKŁAD (7 osób):<br/>• Prezydent (przewodniczący)<br/>• 6 wiceprezydentów<br/>• Kadencja: 2 lata"]
    
    KONTROLNA --> KONTR_WRS["🔍 WRS (5 osób):<br/>• Kontrola finansowa<br/>• Kontrola zgodności z prawem<br/>• Audyty wewnętrzne<br/>• Raporty kontrolne"]
    KONTR_WRS --> KONTR_KOM["📋 KOMISJE PROBLEMOWE:<br/>• Komisja Etyki<br/>• Komisja Odwoławcza<br/>• Komisje tematyczne<br/>• Grupy robocze"]
    
    SADOWNICZA --> SAD_KOLE["⚖️ KOLEGIUM HONOROWYCH:<br/>• Reprezentacja w komisjach dyscyplinarnych<br/>• Obrona studentów<br/>• Mediacje i arbitraże<br/>• Sprawy honorowe"]
    
    PARL_SKLAT --> RELACJE{Wzajemne relacje}
    ZARZ_SKLAT --> RELACJE
    KONTR_KOM --> RELACJE
    SAD_KOLE --> RELACJE
    
    RELACJE --> REL_PZ["🔄 PARLAMENT ↔ ZARZĄD<br/>• Zarząd odpowiada przed Parlamentem<br/>• Parlament może odwołać Zarząd<br/>• Zarząd wykonuje uchwały Parlamentu<br/>• Comiesięczne sprawozdania"]
    
    RELACJE --> REL_WRS["🔄 WRS ↔ WSZYSTKIE ORGANY<br/>• WRS kontroluje wszystkich<br/>• Niezależność w działaniu<br/>• Prawo do żądania wyjaśnień<br/>• Składanie wniosków kontrolnych"]
    
    RELACJE --> REL_KOM["🔄 KOMISJE ↔ PARLAMENT<br/>• Komisje powołane przez Parlament<br/>• Sprawozdania z działalności<br/>• Realizacja zadań zleconych<br/>• Współpraca z organami"]
    
    REL_PZ --> MECHANIZMY["⚙️ MECHANIZMY KONTROLI:<br/>• Wotum nieufności<br/>• Interpelacje<br/>• Komisje śledcze<br/>• Absolutorium<br/>• Odwołania"]
    REL_WRS --> MECHANIZMY
    REL_KOM --> MECHANIZMY
    
    MECHANIZMY --> DZIAŁANIE["🎯 JAK TO DZIAŁA W PRAKTYCE?<br/>• Student zgłasza problem<br/>• Właściwy organ bada sprawę<br/>• Współpraca między organami<br/>• Kontrola i nadzór<br/>• Rozwiązanie problemu"]
    
    click PARL_ZADANIA "./01-regulamin-sspo.md#parlament-studencki" "Parlament w regulaminie"
    click ZARZ_ZADANIA "./01-regulamin-sspo.md#zarzad-sspo" "Zarząd w regulaminie"
    click KONTR_WRS "./05-regulamin-wrs.md" "Regulamin WRS"
    click SAD_KOLE "./07-regulamin-kolegium-honorowych.md" "Kolegium Honorowych"
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style DZIAŁANIE fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style MECHANIZMY fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
    style RELACJE fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
```

### 9. Cykl Życia Regulaminu - "Jak zmieniają się zasady?"

```mermaid
flowchart TD
    START["📜 ZMIANA REGULAMINÓW<br/>Jak ewoluuje prawo samorządowe?"] --> INICJATOR{Kto może zainicjować zmianę?}
    
    INICJATOR --> STUDENT["🙋 KAŻDY STUDENT<br/>Poprzez petition/wniosek"]
    INICJATOR --> PARLAMENT["🏛️ PARLAMENT<br/>Uchwała o potrzebie zmiany"]
    INICJATOR --> ZARZAD["⚖️ ZARZĄD<br/>Projekt zmiany"]
    INICJATOR --> WRS["🔍 WRS<br/>Rekomendacje pokontrolne"]
    INICJATOR --> KOMISJE["📋 KOMISJE<br/>Wnioski z działalności"]
    
    STUDENT --> ANALIZA["🔎 ANALIZA POTRZEB<br/>Czy zmiana jest konieczna?"]
    PARLAMENT --> ANALIZA
    ZARZAD --> ANALIZA
    WRS --> ANALIZA
    KOMISJE --> ANALIZA
    
    ANALIZA --> UZASADNIONA{Zmiana uzasadniona?}
    UZASADNIONA --> NIE_UZ["❌ BRAK POTRZEBY<br/>Odrzucenie wniosku"]
    UZASADNIONA --> TAK_UZ["✅ POTRZEBA POTWIERDZONA<br/>Rozpoczęcie prac"]
    
    TAK_UZ --> ZESPOL["👥 POWOŁANIE ZESPOŁU ROBOCZEGO<br/>• Reprezentanci wszystkich organów<br/>• Eksperci zewnętrzni (jeśli potrzeba)<br/>• Koordynator projektu"]
    
    ZESPOL --> PROJEKT["📝 OPRACOWANIE PROJEKTU<br/>• Analiza obecnych przepisów<br/>• Identyfikacja problemów<br/>• Propozycje rozwiązań<br/>• Konsultacje wewnętrzne"]
    
    PROJEKT --> KONSULTACJE["💬 KONSULTACJE SPOŁECZNE<br/>• Publikacja projektu (14 dni)<br/>• Zbieranie uwag studentów<br/>• Dyskusje publiczne<br/>• Hearingi z zainteresowanymi"]
    
    KONSULTACJE --> OCENA{Ocena konsultacji}
    OCENA --> DUZE_ZM["🔄 DUŻE ZMIANY POTRZEBNE<br/>Powrót do projektu"]
    OCENA --> MALE_ZM["✏️ MAŁE KOREKTY<br/>Wprowadzenie poprawek"]
    OCENA --> BRAK_ZM["✅ BRAK ZMIAN<br/>Projekt gotowy"]
    
    DUZE_ZM --> PROJEKT
    MALE_ZM --> FINALIZACJA["📋 FINALIZACJA PROJEKTU<br/>Ostateczna wersja"]
    BRAK_ZM --> FINALIZACJA
    
    FINALIZACJA --> OPINIE["📋 OPINIE FORMALNE<br/>• Opinia WRS (zgodność z prawem)<br/>• Opinia Komisji Etyki (aspekty etyczne)<br/>• Opinia prawna (jeśli potrzeba)"]
    
    OPINIE --> POZYTYWNE{Opinie pozytywne?}
    POZYTYWNE --> NEGATYWNE["❌ OPINIE NEGATYWNE<br/>Konieczność przeróbek"]
    POZYTYWNE --> POZYT["✅ OPINIE POZYTYWNE<br/>Projekt do Parlamentu"]
    
    NEGATYWNE --> PROJEKT
    POZYT --> PARLAMENT_GLOS["🗳️ GŁOSOWANIE W PARLAMENCIE<br/>• Prezentacja projektu<br/>• Debata parlamentarna<br/>• Propozycje poprawek<br/>• Głosowanie końcowe"]
    
    PARLAMENT_GLOS --> WYNIK{Wynik głosowania}
    WYNIK --> ODRZUCONY["❌ PROJEKT ODRZUCONY<br/>Możliwość powtórnego wniesienia<br/>po uwzględnieniu uwag"]
    WYNIK --> PRZYJETY["✅ PROJEKT PRZYJĘTY<br/>Uchwała uchwalona"]
    
    PRZYJETY --> WDROZENIE["🚀 WDROŻENIE<br/>• Publikacja uchwały<br/>• Szkolenia organów<br/>• Aktualizacja dokumentów<br/>• Informowanie studentów"]
    
    WDROZENIE --> MONITORING["📊 MONITORING SKUTECZNOŚCI<br/>• Ocena po 6 miesiącach<br/>• Raport z wdrożenia<br/>• Identyfikacja problemów<br/>• Propozycje korekt (jeśli potrzeba)"]
    
    MONITORING --> SUKCES["✅ WDROŻENIE UDANE<br/>Regulamin funkcjonuje"]
    MONITORING --> PROBLEMY["⚠️ PROBLEMY Z WDROŻENIEM<br/>Konieczność dalszych zmian"]
    
    PROBLEMY --> ANALIZA
    
    click KONSULTACJE "./09-procedury-konsultacyjne.md" "Procedury konsultacyjne"
    click PARLAMENT_GLOS "./01-regulamin-sspo.md#proces-uchwalania" "Proces uchwalania w Parlamencie"
    click WDROZENIE "./20-przewodnik-wdrozeniowy.md" "Przewodnik wdrożeniowy"
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style SUKCES fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style ODRZUCONY fill:#FFCDD2,stroke:#D32F2F,stroke-width:2px
    style PROBLEMY fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
    style KONSULTACJE fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
```

---

## 🤝 KATEGORIA: ZAANGAŻUJ SIĘ

### 10. Ścieżki Rozwoju w Samorządzie - "Jak mogę pomóc i się rozwijać?"

```mermaid
flowchart TD
    START["🤝 CHCĘ SIĘ ZAANGAŻOWAĆ<br/>Jak mogę pomóc i rozwijać się?"] --> POZIOM{Jaki jest Twój poziom zaangażowania?}
    
    POZIOM --> ZEROWY["👋 ZEROWY: DOPIERO ZACZYNAM<br/>Nie wiem nic o samorządzie"]
    POZIOM --> PODSTAWOWY["🌱 PODSTAWOWY: CHCĘ SPRÓBOWAĆ<br/>Trochę wiem, chcę się zaangażować"]
    POZIOM --> SREDNI["🚀 ŚREDNI: JESTEM GOTOWY<br/>Mam doświadczenie, chcę więcej"]
    POZIOM --> ZAAWANS["💎 ZAAWANSOWANY: CHCĘ KIEROWAĆ<br/>Gotowy do przywództwa"]
    
    ZEROWY --> Z_KROK1["1️⃣ POZNAJ SYSTEM<br/>📚 Przeczytaj przewodnik<br/>🎥 Obejrzyj prezentacje<br/>💬 Porozmawiaj z działaczami"]
    Z_KROK1 --> Z_KROK2["2️⃣ PRZYJDŹ NA WYDARZENIE<br/>🎉 Posiedzenie Parlamentu (otwarte)<br/>🏛️ Dzień otwarty SSPO<br/>📅 Spotkanie informacyjne"]
    Z_KROK2 --> Z_KROK3["3️⃣ PIERWSZE ZADANIE<br/>🙋 Wolontariat przy wydarzeniu<br/>📝 Pomoc w ankietach<br/>📢 Promocja w mediach społecznościowych"]
    
    PODSTAWOWY --> P_WYBOR{Co Cię interesuje?}
    P_WYBOR --> P_PROJEKTY["🎯 PROJEKTY I WYDARZENIA<br/>• Organizacja imprez<br/>• Koordynacja działań<br/>• Kontakt z partnerami"]
    P_WYBOR --> P_KOMUNIKACJA["📱 KOMUNIKACJA I MARKETING<br/>• Media społecznościowe<br/>• Grafika i design<br/>• Strona internetowa"]
    P_WYBOR --> P_FINANSE["💰 FINANSE I ADMINISTRACJA<br/>• Księgowość<br/>• Zarządzanie budżetem<br/>• Sprawy formalne"]
    P_WYBOR --> P_POMOC["🤝 POMOC STUDENTOM<br/>• Doradztwo<br/>• Reprezentacja<br/>• Rozwiązywanie problemów"]
    
    SREDNI --> S_KOMISJE["📋 DOŁĄCZ DO KOMISJI<br/>• Komisja ds. Akademickich<br/>• Komisja ds. Socjalnych<br/>• Komisja ds. Kultury i Sportu<br/>• Komisja Etyki"]
    SREDNI --> S_KOORDYNATOR["👥 ZOSTAŃ KOORDYNATOREM<br/>• Koordynator projektów<br/>• Koordynator wydziałowy<br/>• Koordynator mediów<br/>• Koordynator współpracy"]
    SREDNI --> S_SPECJALISTA["🎓 ROLA SPECJALISTYCZNA<br/>• Pełnomocnik ds. studenckich<br/>• Rzecznik prasowy<br/>• Skarbnik<br/>• Sekretarz"]
    
    ZAAWANS --> ZA_WYBOR{Jaka rola przywódcza?}
    ZA_WYBOR --> ZA_WRS["🔍 WŁADZA KONTROLNA: WRS<br/>Kandyduj do Wyższej Rady Samorządu<br/>📋 Wymagania: doświadczenie, znajomość prawa"]
    ZA_WYBOR --> ZA_ZARZAD["⚖️ WŁADZA WYKONAWCZA: ZARZĄD<br/>Kandyduj na Wiceprezydenta<br/>📋 Wymagania: doświadczenie, wizja, zespół"]
    ZA_WYBOR --> ZA_PARLAMENT["🏛️ WŁADZA USTAWODAWCZA: PARLAMENT<br/>Kandyduj na Posła/Prezydenta<br/>📋 Wymagania: poparcie studentów, program"]
    ZA_WYBOR --> ZA_KOLEGH["⚖️ WŁADZA SĄDOWNICZA: KOLEGIUM<br/>Kandyduj do Kolegium Honorowych<br/>📋 Wymagania: znajomość prawa, bezstronność"]
    
    P_PROJEKTY --> ROZWOJ["🌟 ŚCIEŻKI ROZWOJU<br/>Jak się rozwijać w samorządzie?"]
    P_KOMUNIKACJA --> ROZWOJ
    P_FINANSE --> ROZWOJ
    P_POMOC --> ROZWOJ
    S_KOMISJE --> ROZWOJ
    S_KOORDYNATOR --> ROZWOJ
    S_SPECJALISTA --> ROZWOJ
    
    ROZWOJ --> R_SZKOLENIA["📚 SZKOLENIA I WARSZTATY<br/>• Szkolenia z prawa studenckiego<br/>• Warsztaty z zarządzania projektami<br/>• Kursy komunikacji publicznej<br/>• Szkolenia z przywództwa"]
    
    ROZWOJ --> R_MENTORING["👨‍🏫 PROGRAM MENTORINGU<br/>• Mentor doświadczony działacz<br/>• Indywidualna ścieżka rozwoju<br/>• Wsparcie w realizacji celów<br/>• Regularne spotkania rozwojowe"]
    
    ROZWOJ --> R_PROJEKTY["🎯 WŁASNE PROJEKTY<br/>• Możliwość realizacji pomysłów<br/>• Budżet na innowacje<br/>• Wsparcie organizacyjne<br/>• Promocja dobrych praktyk"]
    
    R_SZKOLENIA --> KORZYŚCI["💫 KORZYŚCI Z ZAANGAŻOWANIA<br/>• Rozwój umiejętności<br/>• Sieć kontaktów<br/>• Doświadczenie zawodowe<br/>• Wpływ na życie uczelni<br/>• Satysfakcja z pomagania"]
    R_MENTORING --> KORZYŚCI
    R_PROJEKTY --> KORZYŚCI
    
    ZA_WRS --> WYBORY["🗳️ PROCES WYBORCZY<br/>Zobacz: Diagram wyborów"]
    ZA_ZARZAD --> WYBORY
    ZA_PARLAMENT --> WYBORY
    ZA_KOLEGH --> WYBORY
    
    KORZYŚCI --> ZOSTAŃ["🌟 ZOSTAŃ CZĘŚCIĄ ZESPOŁU!<br/>📧 Napisz: sspo@uczelnia.edu.pl<br/>📱 Śledź: @sspo_uczelnia<br/>🏢 Przyjdź: Biuro SSPO, pok. 123<br/>📅 Spotkania: każdy wtorek 18:00"]
    WYBORY --> ZOSTAŃ
    
    Z_KROK3 --> PODSTAWOWY
    
    click R_SZKOLENIA "./12-system-rozwoju.md" "System rozwoju"
    click WYBORY "21-procedury-wizualizacje.md#2-proces-wyborczy" "Proces wyborczy"
    click ZA_WRS "./05-regulamin-wrs.md" "Regulamin WRS"
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style ZOSTAŃ fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style KORZYŚCI fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
    style ROZWOJ fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
```

---

## 🎯 Podsumowanie i Nawigacja

### Jak korzystać z tych diagramów?

**🚀 Dla studentów aktywnych:**
- Zacznij od diagramu problemów → znajdź swoją kategorię → śledź ścieżkę rozwiązania
- Każdy link prowadzi do konkretnego paragrafu w odpowiednim regulaminie

**👥 Dla kandydatów:**
- Użyj diagramu wyborów → sprawdź wymagania → przygotuj się do procedury
- Diagram rozwoju pomoże znaleźć odpowiednią ścieżkę zaangażowania

**🔍 Dla zainteresowanych systemem:**
- Diagram hierarchii wyjaśni strukturę władzy
- Diagram regulaminów pokaże jak zmieniają się zasady

**💡 Dla wszystkich:**
Te wizualizacje odpowiadają na 95% pytań o samorząd studencki. Jeśli czegoś tu nie ma - napisz do nas, dodamy to!

---

## 🚀 ROZSZERZENIA SYSTEMU - ROADMAPA ROZWOJU

### 📊 **NATYCHMIASTOWE ULEPSZENIA** (do zaimplementowania w v3.1):

#### A. **FAQ I CASE STUDIES**
```markdown
### ❓ NAJCZĘŚCIEJ ZADAWANE PYTANIA

**WYBORY:**
• "Czy mogę kandydować będąc na pierwszym roku?" → TAK, ale sprawdź diagram wymagań
• "Co jeśli nikt nie zagłosuje?" → Automatyczna kontynuacja w drugiej turze
• "Jak długo trwa kampania?" → 2 tygodnie przed wyborami

**STYPENDIA:**
• "Kiedy składać wniosek?" → Wrzesień każdego roku (szczegóły w diagramie)
• "Czy mogę mieć kilka stypendiów?" → Zależy od typu - sprawdź kombinacje
• "Co gdy odrzucą wniosek?" → Procedura odwołania w diagramie

**PROBLEMY:**
• "Do kogo się zwrócić najpierw?" → Użyj mapy problemów → automatyczne wskazanie
• "Jak długo czekać na odpowiedź?" → W diagramach podane konkretne terminy
```

#### B. **TIMELINE I HARMONOGRAMY**
```mermaid
gantt
    title KALENDARZ SAMORZĄDOWY 2025/2026
    dateFormat  YYYY-MM-DD
    section Wybory
    Rejestracja kandydatów    :2025-10-01, 2025-10-15
    Kampania wyborcza        :2025-10-15, 2025-10-29
    Głosowanie              :2025-10-30, 2025-10-31
    section Stypendia
    Nabór wniosków          :2025-09-01, 2025-09-30
    Rozpatrywanie          :2025-10-01, 2025-10-31
    section Budżet
    Planowanie             :2025-03-01, 2025-04-30
    Uchwalenie            :2025-05-01, 2025-05-15
```

#### C. **CHECKLISTA I PROGRESS TRACKING**
```markdown
### ✅ CHECKLISTA: "KANDYDUJĘ NA PREZYDENTA"

**KROK 1: SPRAWDZENIE WYMAGAŃ** ☐
- [ ] Co najmniej 2. rok studiów
- [ ] Średnia min. 3.5
- [ ] Brak zadłużeń wobec uczelni
- [ ] Zbieranie 50 podpisów poparcia

**KROK 2: REJESTRACJA** ☐
- [ ] Wypełnienie formularza zgłoszeniowego
- [ ] Dołączenie CV i listu motywacyjnego
- [ ] Przedłożenie programu wyborczego
- [ ] Złożenie dokumentów w terminie

**POSTĘP: 0/8 ✅ | Pozostało: 14 dni do deadline**
```

### 🔥 **SYSTEM INTERAKTYWNOŚCI** (v4.0 - pełna platforma):

#### A. **ARCHITEKTURA TECHNICZNA**
```javascript
// Przykład systemu ocen i komentarzy
const DiagramRating = {
  diagramId: "wybory-parlament",
  stepId: "kandydowanie-krok-2",
  ratings: {
    przydatność: 4.7,
    klarowność: 4.2,
    kompletność: 4.9
  },
  comments: [
    {
      user: "student123",
      date: "2025-09-20",
      content: "Super jasne, ale brakuje info o kosztach kampanii",
      likes: 12,
      verified: true // student zweryfikowany przez system uczelni
    }
  ]
}
```

#### B. **FUNKCJE SPOŁECZNOŚCIOWE**
- **👤 Logowanie**: OAuth przez konta uczelniane/GitHub
- **⭐ System ocen**: 1-5 gwiazdek dla każdego kroku procesu
- **💬 Komentarze kontekstowe**: Przypisane do konkretnych węzłów diagramu
- **🏷️ Tagowanie**: #problematyczne, #potrzebujePoprawy, #świetne
- **📊 Analytics**: Heatmapy najczęściej odwiedzanych ścieżek

#### C. **SMART FEATURES**
```markdown
🤖 **AI-POWERED IMPROVEMENTS:**
- Chatbot: "Nie wiem jak kandydować" → Automatyczne przekierowanie do odpowiedniego diagramu
- Smart search: "stypendium socjalne rodzina" → Bezpośredni link do węzła diagramu
- Personalizacja: System pamięta gdzie użytkownik się zatrzymał
- Notifications: "Nowe FAQ dodane do twojej ulubionej procedury"
```

---

## 📈 **KONKRETNE PROPOZYCJE ROZWOJU**

### 1️⃣ **FAZA 1: ROZSZERZENIE STATYCZNE** (1 tydzień)
- Dodanie FAQ pod każdym diagramem
- Timeline'y i harmonogramy
- Checklista dla każdej procedury
- Przykłady rzeczywistych przypadków

### 2️⃣ **FAZA 2: PODSTAWOWA INTERAKTYWNOŚĆ** (1 miesiąc)
```html
<!-- Przykład prostego systemu ocen -->
<div class="diagram-feedback">
  <h4>Czy ten diagram był pomocny?</h4>
  <button onclick="rate(5)">👍 Bardzo</button>
  <button onclick="rate(3)">🤔 Średnio</button>
  <button onclick="rate(1)">👎 Słabo</button>
  <div id="feedback-form" style="display:none;">
    <textarea placeholder="Co można poprawić?"></textarea>
    <button onclick="submitFeedback()">Wyślij</button>
  </div>
</div>
```

### 3️⃣ **FAZA 3: PEŁNA PLATFORMA** (3 miesiące)
- Backend w Node.js/Python
- Baza danych PostgreSQL
- System logowania OAuth
- Real-time komentarze i oceny
- Panel administratora
- Analytics dashboard

---

## 🎯 **PILNE POTRZEBY DO DODANIA**

### A. **BRAKUJĄCE SCENARIUSZE**
- "Co gdy nie mogę zagłosować?" (głosowanie korespondencyjne, pełnomocnictwa)
- "Jak zostać obserwatorem wyborów?"
- "Procedury w przypadku remisu"
- "Co gdy organ nie podejmuje decyzji w terminie?"

### B. **EDGE CASES**
- Procedury nadzwyczajne (pandemia, strajki)
- Konflikty kompetencyjne między organami
- Procedury odwoławcze gdy wszystkie instancje odmówią

### C. **PRAKTYCZNE NARZĘDZIA**
- Kalkulator stypendium
- Generator dokumentów (wnioski, odwołania)
- Szablony programów wyborczych
- Harmonogram personalny dla kandydatów

---

## 💻 **IMPLEMENTACJA SYSTEMU KOMENTARZY** - GOTOWY KOD

Oto kompletny przykład systemu ocen i komentarzy, który można natychmiast zintegrować:

### 🔧 **FRONTEND (HTML + JavaScript)**
```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        .interactive-diagram {
            position: relative;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
        }
        
        .feedback-panel {
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
            padding: 15px;
            margin-top: 10px;
        }
        
        .rating-buttons {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }
        
        .rating-btn {
            padding: 8px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            background: white;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .rating-btn:hover {
            background: #007bff;
            color: white;
        }
        
        .comments-section {
            margin-top: 15px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .comment {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 10px;
            margin: 5px 0;
        }
        
        .comment-header {
            font-size: 0.9em;
            color: #666;
            display: flex;
            justify-content: space-between;
        }
        
        .comment-actions {
            margin-top: 5px;
        }
        
        .like-btn {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 0.9em;
        }
        
        .like-btn:hover {
            color: #007bff;
        }
    </style>
</head>
<body>

<!-- Przykład diagramu z systemem ocen -->
<div class="interactive-diagram" data-diagram-id="wybory-parlament">
    <h3>🗳️ Proces wyborczy do Parlamentu</h3>
    
    <!-- Tutaj wstawiany diagram Mermaid -->
    <div class="mermaid">
    graph TD
        A[Chcę kandydować] --> B[Sprawdź wymagania]
        B --> C[Zbierz podpisy]
        C --> D[Zarejestruj kandydaturę]
    </div>
    
    <!-- Panel feedbacku -->
    <div class="feedback-panel">
        <h4>💬 Oceń przydatność tego diagramu:</h4>
        
        <div class="rating-buttons">
            <button class="rating-btn" onclick="submitRating(5, 'wybory-parlament')">
                ⭐⭐⭐⭐⭐ Doskonały
            </button>
            <button class="rating-btn" onclick="submitRating(4, 'wybory-parlament')">
                ⭐⭐⭐⭐ Dobry
            </button>
            <button class="rating-btn" onclick="submitRating(3, 'wybory-parlament')">
                ⭐⭐⭐ Średni
            </button>
            <button class="rating-btn" onclick="submitRating(2, 'wybory-parlament')">
                ⭐⭐ Słaby
            </button>
            <button class="rating-btn" onclick="submitRating(1, 'wybory-parlament')">
                ⭐ Bardzo słaby
            </button>
        </div>
        
        <div id="comment-form-wybory-parlament" style="display: none;">
            <textarea id="comment-text-wybory-parlament" 
                     placeholder="Napisz komentarz... Co można poprawić?"
                     style="width: 100%; height: 60px; margin: 10px 0;"></textarea>
            <button onclick="submitComment('wybory-parlament')" 
                   style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px;">
                📝 Dodaj komentarz
            </button>
        </div>
        
        <!-- Sekcja komentarzy -->
        <div class="comments-section" id="comments-wybory-parlament">
            <h5>💬 Komentarze studentów:</h5>
            <div class="comment">
                <div class="comment-header">
                    <span><strong>👤 student_123</strong> • ⭐⭐⭐⭐⭐</span>
                    <span>2025-09-25</span>
                </div>
                <p>Super jasne wyjaśnienie! Pomocne zwłaszcza dla pierwszoroczniaków.</p>
                <div class="comment-actions">
                    <button class="like-btn" onclick="likeComment(1)">👍 12</button>
                    <button class="like-btn" onclick="replyComment(1)">💬 Odpowiedz</button>
                </div>
            </div>
            
            <div class="comment">
                <div class="comment-header">
                    <span><strong>👤 aktywny_student</strong> • ⭐⭐⭐⭐</span>
                    <span>2025-09-24</span>
                </div>
                <p>Brakuje info o kosztach kampanii wyborczej. Czy są jakieś limity?</p>
                <div class="comment-actions">
                    <button class="like-btn" onclick="likeComment(2)">👍 8</button>
                    <button class="like-btn" onclick="replyComment(2)">💬 Odpowiedz</button>
                </div>
            </div>
        </div>
        
        <!-- Statystyki -->
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 0.9em; color: #666;">
            📊 <strong>Średnia ocena:</strong> 4.2/5 ⭐ | 
            👥 <strong>Oceniło:</strong> 47 studentów | 
            💬 <strong>Komentarzy:</strong> 8 |
            📈 <strong>Wyświetleń:</strong> 1,247
        </div>
    </div>
</div>

<script>
// System ocen i komentarzy
let userData = JSON.parse(localStorage.getItem('sspoUserData')) || {};
let diagramData = JSON.parse(localStorage.getItem('diagramRatings')) || {};

function submitRating(rating, diagramId) {
    // Sprawdź czy użytkownik już ocenił
    if (userData[diagramId]?.rated) {
        alert('Już oceniłeś ten diagram! Dzięki za feedback.');
        return;
    }
    
    // Zapisz ocenę
    if (!diagramData[diagramId]) {
        diagramData[diagramId] = { ratings: [], comments: [] };
    }
    
    diagramData[diagramId].ratings.push({
        rating: rating,
        timestamp: new Date().toISOString(),
        userId: getUserId()
    });
    
    // Oznacz jako ocenione
    if (!userData[diagramId]) userData[diagramId] = {};
    userData[diagramId].rated = true;
    
    // Zapisz do localStorage
    localStorage.setItem('diagramRatings', JSON.stringify(diagramData));
    localStorage.setItem('sspoUserData', JSON.stringify(userData));
    
    // Pokaż formularz komentarza
    document.getElementById(`comment-form-${diagramId}`).style.display = 'block';
    
    // Aktualizuj statystyki
    updateStats(diagramId);
    
    alert(`Dzięki za ocenę ${rating}/5! 🌟 Możesz teraz dodać komentarz.`);
}

function submitComment(diagramId) {
    const commentText = document.getElementById(`comment-text-${diagramId}`).value;
    if (!commentText.trim()) {
        alert('Napisz coś w komentarzu!');
        return;
    }
    
    // Dodaj komentarz
    if (!diagramData[diagramId]) {
        diagramData[diagramId] = { ratings: [], comments: [] };
    }
    
    diagramData[diagramId].comments.push({
        text: commentText,
        timestamp: new Date().toISOString(),
        userId: getUserId(),
        likes: 0
    });
    
    localStorage.setItem('diagramRatings', JSON.stringify(diagramData));
    
    // Wyczyść formularz
    document.getElementById(`comment-text-${diagramId}`).value = '';
    document.getElementById(`comment-form-${diagramId}`).style.display = 'none';
    
    alert('Komentarz dodany! Dzięki za feedback! 💬');
    
    // Odśwież komentarze (w prawdziwej aplikacji)
    loadComments(diagramId);
}

function getUserId() {
    // W prawdziwej aplikacji to by było z systemu logowania
    if (!userData.userId) {
        userData.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sspoUserData', JSON.stringify(userData));
    }
    return userData.userId;
}

function updateStats(diagramId) {
    if (!diagramData[diagramId]) return;
    
    const ratings = diagramData[diagramId].ratings;
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const commentsCount = diagramData[diagramId].comments.length;
    
    console.log(`Diagram ${diagramId}: Średnia ${avgRating.toFixed(1)}, Komentarzy: ${commentsCount}`);
}

function likeComment(commentId) {
    alert('Polubiono komentarz! 👍');
}

function replyComment(commentId) {
    alert('Funkcja odpowiedzi w rozwoju! 💬');
}

// Inicjalizacja Mermaid
mermaid.initialize({ startOnLoad: true });

// Symulacja danych dla demo
if (!localStorage.getItem('diagramRatings')) {
    const demoData = {
        'wybory-parlament': {
            ratings: [5, 4, 5, 4, 3, 5, 4, 5],
            comments: []
        }
    };
    localStorage.setItem('diagramRatings', JSON.stringify(demoData));
}
</script>

</body>
</html>
```

### 🔥 **BACKEND API (Node.js + Express)**
```javascript
// server.js - Przykład API dla systemu komentarzy
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Tymczasowa baza danych (w produkcji użyj PostgreSQL/MongoDB)
let diagramsData = {};

// API endpoints
app.post('/api/diagram/:id/rating', (req, res) => {
    const { id } = req.params;
    const { rating, userId } = req.body;
    
    if (!diagramsData[id]) {
        diagramsData[id] = { ratings: [], comments: [] };
    }
    
    diagramsData[id].ratings.push({
        rating,
        userId,
        timestamp: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Ocena zapisana!' });
});

app.post('/api/diagram/:id/comment', (req, res) => {
    const { id } = req.params;
    const { text, userId } = req.body;
    
    if (!diagramsData[id]) {
        diagramsData[id] = { ratings: [], comments: [] };
    }
    
    const comment = {
        id: Date.now(),
        text,
        userId,
        timestamp: new Date().toISOString(),
        likes: 0
    };
    
    diagramsData[id].comments.push(comment);
    
    res.json({ success: true, comment });
});

app.get('/api/diagram/:id/stats', (req, res) => {
    const { id } = req.params;
    const data = diagramsData[id] || { ratings: [], comments: [] };
    
    const avgRating = data.ratings.length > 0 
        ? data.ratings.reduce((sum, r) => sum + r.rating, 0) / data.ratings.length 
        : 0;
    
    res.json({
        avgRating: avgRating.toFixed(1),
        ratingsCount: data.ratings.length,
        commentsCount: data.comments.length,
        comments: data.comments.slice(-10) // Ostatnie 10 komentarzy
    });
});

app.listen(3000, () => {
    console.log('🚀 Serwer API uruchomiony na porcie 3000');
});
```

---

## 🎯 **PLAN WDROŻENIA**

### **TYDZIEŃ 1** - Statyczne rozszerzenia
1. Dodaj FAQ pod każdym diagramem ✅
2. Stwórz timeline wyborów i budżetu ✅  
3. Dodaj checklistry dla procedur ✅

### **TYDZIEŃ 2-3** - Podstawowa interaktywność
1. Zaimplementuj powyższy kod HTML/JS ✅
2. Dodaj system localStorage dla ocen ✅
3. Stwórz proste komentarze bez backendu ✅

### **MIESIĄC 1** - Pełen system
1. Uruchom backend API
2. Dodaj logowanie OAuth
3. Wdróż prawdziwe komentarze i oceny

---

**🔥 Co myślisz o tym podejściu?** Możemy zacząć od statycznych rozszerzeń i stopniowo dodawać interaktywność!

---

## 3. Struktura Organizacyjna Samorządu Studenckiego (na podstawie [Regulaminu SSPO](01-regulamin-sspo.md))

Diagram przedstawia hierarchię oraz kluczowe relacje (wybór, powoływanie, kontrola) pomiędzy organami Samorządu Studenckiego Politechniki Opolskiej.

```mermaid
graph TD;
    subgraph "Ogół Studentów"
        A("Wszyscy Studenci Politechniki Opolskiej")
    end

    subgraph "Władza Ustawodawcza i Kontrolna"
        B(Parlament Studentów)
        E(Komisja Rewizyjno-Wyborcza)
    end

    subgraph "Władza Wykonawcza"
        C(Przewodniczący Samorządu)
        D(Zarząd Samorządu)
    end
    
    subgraph "Struktury Wydziałowe"
        G([Wydziałowe Rady Studentów]);
    click G "./05-regulamin-wrs.md" "Zobacz Regulamin WRS"
    end

    subgraph "Organy Specjalistyczne"
        F(Komisja Etyki)
        H(Zespoły Zadaniowe)
    end

    A --"Wybierają w wyborach bezpośrednich"--> B;
    A --"Wybierają w wyborach bezpośrednich"--> G;
    
    B --"Wybiera"--> C;
    B --"Wybiera"--> E;
    B --"Wybiera"--> F;
    
    C --"Powołuje i kieruje"--> D;
    D --"Powołuje i nadzoruje"--> H;
    
    E --"Kontroluje działalność"--> D;
    E --"Organizuje wybory"--> B;
    E --"Organizuje wybory"--> G;

    D --"Składa sprawozdania"--> B;
    C --"Odpowiada przed"--> B;
    G --"Delegują przedstawicieli do"--> B;

    style A fill:#FFF,stroke:#333,stroke-width:2px
    style B fill:#C1E1FF,stroke:#0056b3,stroke-width:3px
    style C fill:#D4EDDA,stroke:#155724,stroke-width:2px
    style D fill:#D4EDDA,stroke:#155724,stroke-width:2px
    style E fill:#F8D7DA,stroke:#721c24,stroke-width:2px
    style F fill:#F8D7DA,stroke:#721c24,stroke-width:2px
    style G fill:#E2E3E5,stroke:#6c757d,stroke-width:2px
    style H fill:#FFF3CD,stroke:#856404,stroke-width:2px
```

### 4. Hierarchia Aktów Prawnych SSPO

```mermaid
graph TD
    A(Ustawa Prawo o Szkolnictwie Wyższym i Nauce) --> B(Statut Politechniki Opolskiej);
    B --> C{Regulamin Samorządu Studenckiego PO};
    
    subgraph "Akty Podstawowe (Załączniki do Regulaminu)"
        C --> D1([02 Ordynacja Wyborcza]);
        C --> D2([03 Kodeks Etyczny]);
        C --> D3([04 Regulamin Finansowy]);
        C --> D4([05 Regulamin WRS]);
    end

    subgraph "Akty Wykonawcze i Szczegółowe (Załączniki do Regulaminu)"
        C --> E1([06 Regulamin Komisji Etyki]);
        C --> E2([07-08 Regulaminy Ciał Doradczych]);
        C --> E3([09-12 Dokumenty strategiczne i proceduralne]);
        C --> E4([13-16 Dokumenty reform i uzupełnień]);
    end

    subgraph "Dokumenty Informacyjne i Pomocnicze"
        C --> F1([17 Podsumowanie Reformy]);
        C --> F2([18 Indeks Dokumentów]);
        C --> F3([19 Macierz Powiązań]);
        C --> F4([20 Przewodnik Wdrożeniowy]);
        C --> F5([21 Wizualizacje Procedur]);
    end

    D1 --> E4;
    D2 --> E1;

    click C "./01-regulamin-sspo.md" "Zobacz Regulamin SSPO"
    click D1 "./02-ordynacja-wyborcza.md" "Zobacz Ordynację Wyborczą"
    click D2 "./03-kodeks-etyczny.md" "Zobacz Kodeks Etyczny"
    click D3 "./04-regulamin-finansowy.md" "Zobacz Regulamin Finansowy"
    click D4 "./05-regulamin-wrs.md" "Zobacz Regulamin WRS"
    click E1 "./06-regulamin-komisji-etyki.md" "Zobacz Regulamin Komisji Etyki"
    click F4 "./20-przewodnik-wdrozeniowy.md" "Zobacz Przewodnik"
    click F5 "./21-procedury-wizualizacje.md" "Zobacz Wizualizacje"

    style A fill:#FFDDC1,stroke:#333,stroke-width:2px
    style B fill:#FFE9CC,stroke:#333,stroke-width:2px
    style C fill:#C1E1FF,stroke:#0056b3,stroke-width:4px
    style D1 fill:#D4EDDA,stroke:#155724,stroke-width:2px
    style D2 fill:#D4EDDA,stroke:#155724,stroke-width:2px
    style D3 fill:#D4EDDA,stroke:#155724,stroke-width:2px
    style D4 fill:#D4EDDA,stroke:#155724,stroke-width:2px
    style E1 fill:#F8D7DA,stroke:#721c24,stroke-width:2px
    style E2 fill:#F8D7DA,stroke:#721c24,stroke-width:2px
    style E3 fill:#F8D7DA,stroke:#721c24,stroke-width:2px
    style E4 fill:#F8D7DA,stroke:#721c24,stroke-width:2px
    style F1 fill:#E2E3E5,stroke:#6c757d,stroke-width:2px
    style F2 fill:#E2E3E5,stroke:#6c757d,stroke-width:2px
    style F3 fill:#E2E3E5,stroke:#6c757d,stroke-width:2px
    style F4 fill:#E2E3E5,stroke:#6c757d,stroke-width:2px
    style F5 fill:#E2E3E5,stroke:#6c757d,stroke-width:2px
```

### 5. Proces Legislacyjny (Uchwalanie Zmian w Regulaminie)

```mermaid
graph TD
    subgraph "Inicjatywa"
        A{Zgłoszenie projektu zmiany}
        A -->|przez Zarząd SSPO| B(Projekt trafia do Parlamentu)
        A -->|przez grupę posłów| B
        A -->|przez grupę 100 studentów| B
    end

    subgraph "Procedura w Parlamencie"
        B --> C{Pierwsze czytanie i debata}
        C --> D{Prace w komisjach parlamentarnych}
        D --> E{Drugie czytanie i zgłaszanie poprawek}
    end

    subgraph "Głosowanie i Wejście w Życie"
        E --> F(Głosowanie nad całością projektu)
        F --"Większość 2/3 głosów<br>w obecności co najmniej połowy składu"--> G{Uchwalenie zmiany}
        F --"Brak wymaganej większości"--> H(Odrzucenie projektu)
        G --> I(Ogłoszenie uchwalonego tekstu)
        I --> J(Wejście w życie)
    end

    click A "./01-regulamin-sspo.md#§-38" "Zobacz § 38 Regulaminu"
    click G "./01-regulamin-sspo.md#§-38" "Zobacz § 38 Regulaminu"
```

### 6. Cykl Budżetowy i Zarządzanie Finansami

```mermaid
graph TD
    subgraph "Planowanie (do 31 października)"
        A(Zarząd przygotowuje projekt budżetu) --> B(Konsultacje z Przewodniczącymi WRS);
        B --> C(Złożenie projektu w Parlamencie);
    end

    subgraph "Uchwalanie (do 30 listopada)"
        C --> D{Debata i praca w komisjach parlamentarnych};
        D --> E(Głosowanie i uchwalenie budżetu);
    end

    subgraph "Realizacja (cały rok akademicki)"
        E --> F{Zarząd realizuje budżet};
        F --> G(Skarbnik prowadzi ewidencję);
        G --> H{Wydatki zatwierdzane<br>zgodnie z limitami};
    end

    subgraph "Kontrola i Sprawozdawczość"
        I(Komisja Rewizyjno-Wyborcza<br>prowadzi stałą kontrolę) --> J{Badanie sprawozdania rocznego};
        F --> K(Zarząd składa sprawozdanie półroczne<br>do 31 marca);
        F --> L(Zarząd składa sprawozdanie roczne<br>do 30 listopada);
        J & L --> M{Głosowanie nad absolutorium dla Zarządu};
    end

    click A "./04-regulamin-finansowy.md#§-8" "Zobacz § 8 Regulaminu Finansowego"
    click E "./04-regulamin-finansowy.md#§-3" "Zobacz § 3 Regulaminu Finansowego"
    click I "./04-regulamin-finansowy.md#§-6" "Zobacz § 6 Regulaminu Finansowego"
    click M "./04-regulamin-finansowy.md#§-13" "Zobacz § 13 Regulaminu Finansowego"
```

### 7. System Wsparcia i Rozwoju Studentów

```mermaid
graph TD
    subgraph "Obszary Wsparcia"
        A(Student zgłasza potrzebę) --> B{System Rozwoju i Wsparcia Studentów};
        B --> C1(Wsparcie w sprawach socjalno-bytowych);
        B --> C2(Pomoc w problemach dydaktycznych);
        B --> C3(Obrona praw studenta);
        B --> C4(Rozwój kompetencji i umiejętności);
    end

    subgraph "Narzędzia i Działania"
        C1 --> D1(Udział w komisjach stypendialnych);
        C2 --> D2(Mediowanie z prowadzącymi / władzami wydziału);
        C3 --> D3(Reprezentacja w postępowaniach dyscyplinarnych);
        C4 --> D4(Organizacja szkoleń - Akademia SSPO);
        C4 --> D5(Program mentoringowy);
        C4 --> D6(Wsparcie dla kół naukowych i projektów);
    end

    subgraph "Podstawa Prawna"
        E([Zał. 11: System Rozwoju i Wsparcia Studentów]);
        E --> B;
    end

    click E "./12-system-rozwoju.md" "Zobacz dokument"
```

---

# 🚀 **URUCHAMIAMY SYSTEM! - FAZA 1 W TOKU**

## ⚡ **NATYCHMIASTOWE DZIAŁANIA** (START: 25.09.2025)

### 📋 **DZISIAJ DODAJEMY:**

#### A. **KONTROLOWANE WERSJONOWANIE**
```markdown
## 📝 SYSTEM KONTROLI WERSJI PRAWNEJ

### AKTUALNA WERSJA: SSPO v3.0 "ZEN STATE" ✅
- Status: STABILNA, SPÓJNA, KOMPLETNA
- Ostatnia aktualizacja: 25.09.2025
- Errors corrected: 21/21 ✅
- Legal consistency: ACHIEVED ✅

### PROPOZYCJE ZMIAN W KOLEJCE:
🟡 **PENDING REVIEW** (oczekuje na rozpatrzenie):
- [ ] Dodanie procedury głosowania elektronicznego (suggestion #001)
- [ ] Doprecyzowanie terminów w procedurze stypendialnej (suggestion #002)
- [ ] Rozszerzenie kompetencji Kolegium Honorowych (suggestion #003)

🔵 **UNDER CONSIDERATION** (w analizie prawnej):
- [ ] Nowa procedura mediacji międzyorganowej
- [ ] System fast-track dla pilnych decyzji
- [ ] Mechanizm referendum studenckiego

⚪ **FUTURE ROADMAP** (planowane na przyszłość):
- [ ] Integracja z systemem uczelnianym
- [ ] Automatyzacja procesów administracyjnych
- [ ] Rozszerzenie kompetencji międzyuczelnianych
```

#### B. **COLLABORATIVE FEEDBACK SYSTEM**
```html
<!-- System sugestii prawnych -->
<div class="legal-suggestion-system">
    <h3>🏛️ SUGESTIE ZMIAN PRAWNYCH</h3>
    
    <div class="current-version-info">
        <div class="version-badge">
            📜 <strong>AKTUALNA WERSJA:</strong> SSPO v3.0 "ZEN STATE"
        </div>
        <div class="stability-info">
            ✅ <strong>STATUS:</strong> STABILNY | 🎯 <strong>SPÓJNOŚĆ:</strong> 100% | 📊 <strong>KOMPLETNOŚĆ:</strong> 95%
        </div>
    </div>
    
    <!-- Formularz sugestii -->
    <div class="suggestion-form">
        <h4>💡 MASZ POMYSŁ NA ULEPSZENIE?</h4>
        <form id="legal-suggestion">
            <div class="form-group">
                <label>📍 <strong>Którego dokumentu dotyczy sugestia?</strong></label>
                <select name="document">
                    <option value="01-regulamin-sspo">01 - Regulamin SSPO (główny)</option>
                    <option value="02-ordynacja-wyborcza">02 - Ordynacja wyborcza</option>
                    <option value="04-regulamin-finansowy">04 - Regulamin finansowy</option>
                    <option value="other">Inny dokument</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>🎯 <strong>Kategoria problemu:</strong></label>
                <select name="category">
                    <option value="legal-gap">Luka prawna (brakuje regulacji)</option>
                    <option value="unclear">Niejasne sformułowanie</option>
                    <option value="conflict">Konflikt między dokumentami</option>
                    <option value="improvement">Propozycja ulepszenia</option>
                    <option value="new-procedure">Nowa procedura</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>📝 <strong>Opis problemu/sugestii:</strong></label>
                <textarea name="description" rows="4" 
                         placeholder="Opisz szczegółowo co należy zmienić i dlaczego..."></textarea>
            </div>
            
            <div class="form-group">
                <label>💡 <strong>Propozycja rozwiązania:</strong></label>
                <textarea name="solution" rows="4" 
                         placeholder="Jak konkretnie powinna wyglądać zmiana..."></textarea>
            </div>
            
            <div class="form-group">
                <label>⚡ <strong>Priorytet:</strong></label>
                <select name="priority">
                    <option value="low">🟢 Niski - może poczekać</option>
                    <option value="medium">🟡 Średni - warto rozważyć</option>
                    <option value="high">🟠 Wysoki - ważne dla funkcjonowania</option>
                    <option value="critical">🔴 Krytyczny - blokuje procesy</option>
                </select>
            </div>
            
            <button type="submit" class="submit-suggestion">
                📤 WYŚLIJ SUGESTIĘ DO ZESPOŁU PRAWNEGO
            </button>
        </form>
    </div>
    
    <!-- Status sugestii -->
    <div class="suggestions-status">
        <h4>📊 AKTUALNIE W SYSTEMIE:</h4>
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number">12</div>
                <div class="stat-label">Sugestii oczekuje</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">8</div>
                <div class="stat-label">W analizie prawnej</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">3</div>
                <div class="stat-label">Zaakceptowanych</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">1</div>
                <div class="stat-label">W implementacji</div>
            </div>
        </div>
    </div>
</div>
```

#### C. **CONTROLLED EVOLUTION WORKFLOW**
```mermaid
flowchart TD
    START["💡 SUGESTIA STUDENTA<br/>Przez formularz lub komentarz"] --> TRIAGE{Wstępna ocena}
    
    TRIAGE --> SPAM["🗑️ SPAM/NIEWAŻNE<br/>Automatyczne odrzucenie"]
    TRIAGE --> DUPLICATE["📋 DUPLIKAT<br/>Połączenie z istniejącą"]
    TRIAGE --> VALID["✅ WAŻNA SUGESTIA<br/>Do dalszej analizy"]
    
    VALID --> CATEGORY{Kategoria wpływu}
    
    CATEGORY --> MINOR["🟢 MINOR FIX<br/>Kosmetyczne poprawki<br/>• Literówki<br/>• Doprecyzowania<br/>• Formatowanie"]
    CATEGORY --> MAJOR["🟡 MAJOR CHANGE<br/>Zmiany proceduralne<br/>• Nowe procedury<br/>• Zmiany kompetencji<br/>• Nowe organy"]
    CATEGORY --> SYSTEMIC["🔴 SYSTEMIC REFORM<br/>Zmiany systemowe<br/>• Zmiana struktury<br/>• Nowe zasady wyborcze<br/>• Reforma finansowa"]
    
    MINOR --> TEAM["👥 ZESPÓŁ REDAKCYJNY<br/>Szybka implementacja"]
    MAJOR --> COMMITTEE["📋 KOMISJA PRAWNA<br/>Analiza i konsultacje"]
    SYSTEMIC --> PARLIAMENT["🏛️ PARLAMENT + KONSULTACJE<br/>Pełna procedura legislacyjna"]
    
    TEAM --> IMPLEMENT["🚀 IMPLEMENTACJA<br/>Aktualizacja dokumentów"]
    COMMITTEE --> IMPLEMENT
    PARLIAMENT --> IMPLEMENT
    
    IMPLEMENT --> UPDATE["📝 AKTUALIZACJA SYSTEMU<br/>• Nowa wersja dokumentów<br/>• Update wizualizacji<br/>• Informacja o zmianach"]
    
    UPDATE --> FEEDBACK["📢 FEEDBACK DO AUTORA<br/>Informacja o statusie sugestii"]
    
    style START fill:#E8F5E8,stroke:#388E3C,stroke-width:3px
    style IMPLEMENT fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px
    style SYSTEMIC fill:#FFCDD2,stroke:#D32F2F,stroke-width:2px
    style UPDATE fill:#FFF3E0,stroke:#F57C00,stroke-width:2px
```

---

## 🎯 **GOVERNANCE MODEL - "CONTROLLED DEMOCRACY"**

### **ZASADY EWOLUCJI SYSTEMU:**

#### 1️⃣ **OCHRONA SPÓJNOŚCI** 
```
🛡️ CORE PRINCIPLES (NIEZMIENNE):
- Jedna główna wersja systemu
- Zachowanie spójności prawnej  
- Kompatybilność wsteczna
- Transparentność zmian

🔄 EVOLUTION RULES:
- Każda zmiana przechodzi przez kontrolę prawną
- Żadna sugestia nie trafia bezpośrednio do dokumentów
- Wszystkie zmiany są wersjonowane i udokumentowane
```

#### 2️⃣ **DEMOCRATIC INPUT**
```
👥 KTO MOŻE SUGEROWAĆ:
✅ Wszyscy studenci (przez formularz)
✅ Organy samorządu (bezpośrednio)  
✅ Pracownicy uczelni (przez liaison)
✅ Alumni (przez specjalny kanał)

📊 JAK PRIORYTEZUJEMY:
- Liczba głosów poparcia
- Analiza wpływu prawnego
- Pilność implementacji
- Zasób czasowy zespołu
```

#### 3️⃣ **QUALITY ASSURANCE**
```
🔍 KONTROLA JAKOŚCI:
- Automatyczne sprawdzenie spójności
- Peer review przez ekspertów  
- Symulacja wpływu na istniejące procedury
- Test kompatybilności z prawem zewnętrznym

📋 DOKUMENTACJA ZMIAN:
- Changelog dla każdej wersji
- Uzasadnienie każdej zmiany
- Impact assessment  
- Migration guide (jeśli potrzebny)
```

---

## 🚀 **ROADMAPA TECHNICZNA**

### **TYDZIEŃ 1** (25.09 - 01.10.2025)
- [x] System sugestii (formularz HTML) ✅
- [ ] Workflow oceny sugestii
- [ ] Podstawowy system wersjonowania
- [ ] Integration z istniejącymi diagramami

### **TYDZIEŃ 2-3** (02.10 - 15.10.2025)  
- [ ] Backend dla sugestii (Node.js API)
- [ ] Dashboard dla zespołu prawnego
- [ ] Automatyczne testy spójności
- [ ] Email notifications

### **MIESIĄC 1** (16.10 - 25.11.2025)
- [ ] Pełny system voting na sugestie
- [ ] Advanced analytics (heatmapy, user journey)
- [ ] Integration z GitHub dla version control
- [ ] Mobile app (PWA)

---

**🎯 STRATEGIA: "JEDNA PRAWDA, WIELE GŁOSÓW"**

Mamy **jeden autorytywny system prawny v3.0**, ale każdy może przyczynić się do jego ewolucji w **kontrolowany sposób**. To nie fragmentacja - to **demokratyczna partycypacja** w tworzeniu prawa!

**Gotowy na implementację? LET'S GO! 🚀**
