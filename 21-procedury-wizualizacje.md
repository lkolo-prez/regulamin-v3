# WIZUALIZACJE PROCEDUR

*Załącznik nr 21 do [Regulaminu Samorządu Studenckiego Politechniki Opolskiej](01-regulamin-sspo.md)*

Ten dokument zawiera wizualne przedstawienie kluczowych procedur opisanych w systemie prawnym Samorządu Studenckiego Politechniki Opolskiej. Diagramy mają na celu ułatwienie zrozumienia złożonych procesów.

## 1. Procedura Wyborcza (na podstawie [Ordynacji Wyborczej](02-ordynacja-wyborcza.md))

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

## 2. Postępowanie przed Komisją Etyki (na podstawie [Regulaminu Komisji Etyki](06-regulamin-komisji-etyki.md))

Diagram ilustruje ścieżkę postępowania w przypadku zgłoszenia naruszenia zasad etycznych przez członka organu Samorządu.

```mermaid
flowchart TD
    A[Start: Zgłoszenie naruszenia zasad etyki] --> B{Wszczęcie postępowania przez Komisję Etyki};
    B --> C[Postępowanie wyjaśniające (do 30 dni)];
    C --> D{Wydanie orzeczenia};
    D -- Stwierdzono naruszenie --> E{Zastosowanie sankcji};
    D -- Brak naruszenia --> F[Zakończenie postępowania];
    E --> G{Czy strona składa odwołanie do Parlamentu?};
    G -- Tak --> H[Rozpatrzenie odwołania przez Parlament];
    G -- Nie --> F;
    H --> F;
```

## 3. Struktura Organizacyjna Samorządu Studenckiego (na podstawie [Regulaminu SSPO](01-regulamin-sspo.md))

Diagram przedstawia hierarchię oraz kluczowe relacje (wybór, powoływanie, kontrola) pomiędzy organami Samorządu Studenckiego Politechniki Opolskiej.

```mermaid
graph TD;
    subgraph "Społeczność Studencka"
        A("Wszyscy Studenci Politechniki Opolskiej")
    end

    subgraph "Władza Ustawodawcza i Wyborcza"
        B(Parlament Studentów)
    end

    subgraph "Władza Wykonawcza"
        C(Przewodniczący Samorządu)
        D(Zarząd Samorządu)
    end

    subgraph "Organy Kontrolne i Etyczne"
        E(Komisja Rewizyjno-Wyborcza)
        F(Komisja Etyki)
    end
    
    subgraph "Struktury Wydziałowe"
        G([Wydziałowe Rady Studentów](05-regulamin-wrs.md))
    end

    A --"Wybierają w wyborach bezpośrednich"--> B;
    A --"Wybierają w wyborach bezpośrednich"--> G;
    
    B --"Wybiera w głosowaniu tajnym"--> C;
    B --"Powołuje na wniosek Przewodniczącego"--> D;
    B --"Wybiera"--> E;
    B --"Wybiera"--> F;

    C --"Kieruje pracami"--> D;
    
    E --"Kontroluje działalność"--> D;
    D --"Składa sprawozdania"--> B;
    C --"Odpowiada przed"--> B;

```

### 4. Hierarchia Aktów Prawnych SSPO

```mermaid
graph TD
    A(Ustawa Prawo o Szkolnictwie Wyższym i Nauce) --> B(Statut Politechniki Opolskiej);
    B --> C{Regulamin Samorządu Studenckiego PO};
    
    subgraph "Akty Podstawowe (Integralna część Regulaminu)"
        C --> D1([Zał. 1: Ordynacja Wyborcza]);
        C --> D2([Zał. 2: Kodeks Etyczny]);
        C --> D3([Zał. 3: Regulamin Finansowy]);
        C --> D4([Zał. 4: Regulamin WRS]);
    end

    subgraph "Akty Wykonawcze i Szczegółowe (Załączniki do Regulaminu)"
        C --> E1([Zał. 5: Regulamin Komisji Etyki]);
        C --> E2([Zał. 6-8: Regulaminy Ciał Doradczych]);
        C --> E3([Zał. 9-12: Dokumenty strategiczne i proceduralne]);
        C --> E4([Zał. 13-16: Dokumenty reform i uzupełnień]);
    end

    subgraph "Dokumenty Pomocnicze (poza systemem prawnym)"
        F1(Indeks Dokumentów);
        F2(Macierz Powiązań);
        F3(Podsumowanie Reformy);
    end

    D1 --> E4;
    D2 --> E1;

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
