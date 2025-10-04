# System Prawny Samorządu Studenckiego Politechniki Opolskiej (Wersja 3.0)

## O Projekcie

Repozytorium to zawiera kompletną, zmodernizowaną i w pełni cyfrową wersję systemu prawnego Samorządu Studenckiego Politechniki Opolskiej (SSPO). Projekt został stworzony w celu uporządkowania, ujednolicenia i unowocześnienia wszystkich dokumentów regulujących działalność Samorządu.

Główne cele projektu:
- **Spójność:** Zapewnienie, że wszystkie dokumenty są ze sobą logicznie powiązane i nie zawierają sprzeczności.
- **Dostępność:** Stworzenie łatwo nawigowalnego systemu opartego na hiperłączach, dostępnego dla każdego studenta.
- **Nowoczesność:** Wykorzystanie nowoczesnych narzędzi (Docsify, Mermaid.js) do prezentacji treści, w tym wizualizacji procedur.
- **Transparentność:** Ułatwienie zrozumienia skomplikowanych procedur poprzez graficzne diagramy.

## Struktura Projektu

System składa się z 21 dokumentów w formacie Markdown, które tworzą spójną całość:

- **`01-regulamin-sspo.md`**: Akt najwyższej rangi, stanowiący konstytucję Samorządu.
- **`02-ordynacja-wyborcza.md` do `20-przewodnik-uchwalenia.md`**: Załączniki i dokumenty systemowe, które uszczegóławiają przepisy Regulaminu w różnych obszarach (wybory, finanse, etyka, procedury itp.).
- **`21-procedury-wizualizacje.md`**: Zbiór diagramów graficznych (stworzonych w Mermaid.js) ilustrujących kluczowe procesy w Samorządzie.
- **`index.html`**: Główny plik konfiguracyjny dla Docsify, który renderuje stronę.
- **`_sidebar.md`**: Plik definiujący menu nawigacyjne strony.
- **`README.md`**: Ten plik.

## Podgląd i Uruchomienie Lokalne (z użyciem Docsify)

System został zaprojektowany do przeglądania jako interaktywna strona internetowa za pomocą narzędzia **Docsify**.

### Wymagania
- **Node.js** i **npm** (do instalacji `docsify-cli`)
- Zalecany serwer deweloperski, np. `http-server` lub wbudowany serwer w edytorze kodu (jak Live Server w VS Code).

### Kroki do uruchomienia
1.  **Zainstaluj `docsify-cli` globalnie (jeśli jeszcze go nie masz):**
    ```bash
    npm i docsify-cli -g
    ```

2.  **Uruchom serwer deweloperski Docsify w głównym folderze projektu:**
    ```bash
    docsify serve .
    ```
    Alternatywnie, można użyć dowolnego serwera HTTP. Jeśli używasz VS Code z rozszerzeniem **Live Server**:
    - Kliknij prawym przyciskiem myszy na plik `index.html`.
    - Wybierz opcję "Open with Live Server".

3.  **Otwórz przeglądarkę:**
    Przejdź pod adres `http://localhost:3000` (lub inny port wskazany przez serwer). Zobaczysz w pełni interaktywną stronę z systemem prawnym SSPO, z działającymi linkami, menu nawigacyjnym i wyrenderowanymi diagramami.

## Kluczowe Technologie
- **Markdown:** Język znaczników użyty do napisania wszystkich dokumentów.
- **Docsify:** Generator stron z dokumentacją, który dynamicznie renderuje pliki Markdown w estetyczną i funkcjonalną stronę internetową.
- **Mermaid.js:** Biblioteka do tworzenia diagramów i schematów blokowych z tekstu, zintegrowana z Docsify.

---
*Projekt zrealizowany w ramach reformy systemowej Samorządu Studenckiego Politechniki Opolskiej 2025.*