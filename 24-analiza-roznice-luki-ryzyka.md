# Różnice, luki i ryzyka – SSPO: PDF 2020 vs. System Prawny v3 (GitHub)

Data: 2025-10-05
Adresaci: Zarząd SSPO, KRW, WRS, KE, Redakcja Rejestru
Zakres: porównanie starej wersji (PDF 2020) z systemem v3 (repo: regulamin-v3)

—

## 1) Podsumowanie dla zarządu (executive summary)

- Przejście z monolitu (1 dokument + 2 załączniki) do systemu „kodeksowego” (moduły domenowe + przewodniki + rejestr publikacyjny) upraszcza rozwój i egzekucję reguł.
- Kluczowe luki 2020 (brak: finansów/COI, etyki, konsultacji, jawności IT/e-głosowań) zostały domknięte w v3 osobnymi modułami i checklistami operacyjnymi.
- Nowe ryzyka v3: fragmentacja i kolizje między modułami, bieżące utrzymanie i wersjonowanie, zgodność RODO/IT dla procesów online, ryzyko „przeburokratyzowania”.
- Mitigacje w v3: zasady kolizyjne (lex superior → lex specialis → lex posterior) w rdzeniu, centralny Rejestr (wejście w życie: 01 § 40 – kotwica legacy), mapy powiązań, check‑listy publikacyjne i IT, vacatio legis, errata SLA.
- „Last mile”: spiąć progi jawności i formaty CSV/JSON, sformalizować COI (oświadczenia + rejestr + wyłączenia), wzorzec protokołu z 7‑dniowym terminem publikacji, DPIA dla e‑głosowań, minimalne okno konsultacji 14 dni oraz wyjątki trybu pilnego.

—

## 2) Tabela różnic: „było – słabości – jest – jak odpowiada – ryzyka – co doprecyzować”

Objaśnienia skrótów łączy: 01–23 to pliki w repo; stabilne kotwice legacy np. 01 § 40: `01-regulamin-sspo.md#§-40`. Mapa renumeracji: `18-indeks-dokumentow.md#mapa-renumeracji`.

| Obszar | Stary stan (PDF 2020) | Słabości/luki | Nowy stan (v3 – pliki) | Jak odpowiada nowy system | Ryzyka/uwagi | Co doprecyzować/zmienić |
|---|---|---|---|---|---|---|
| Architektura prawa | 1 dokument + 2 załączniki | Monolit, mało miejsca na domeny | 01 + moduły 03–23; indeks (18), macierz (19) | Modularność, domeny zdefiniowane, nawigacja | Fragmentacja | Zasada kolizyjna w rdzeniu + wersjonowanie modułów |
| Etyka i zgodność | brak KE i kodeksu | Brak trybu etycznego i sankcji | 03, 06 | Normy zachowań, organ, procedury | Granica właściwości vs. KRW | Jawność orzeczeń (anonimizacja), tryb odwoławczy |
| Finanse i jawność | Ogólne sprawozdania (min. 1/rok) | Brak progów publikacji, wzorców danych | 04, 23 | Zasady gospodarki + checklista publikacji | RODO, zgodność z polityką Uczelni | Progi (np. 5k/10k), CSV/JSON, kwartalne raporty |
| Poziom wydziałowy (WRS) | Ujęte skrótowo | Niedookreślone kompetencje i procesy | 05 | Standardy i procesy WRS | Rozbieżności między wydziałami | SLA z dziekanatami, szablony pism |
| Głosowania/IT | USOSweb min. 12h | Brak audytu/logów/testów, brak fallbacku | 13, 14–15, 21, TESTING-PLAN.md | Wymogi IT, testy, procedury awaryjne, wizualizacje | Awaria/RODO/kwestionowanie ważności | Checklista szyfrowania/logów/DRC, DPIA |
| Kampanie i komunikacja | Ogólnikowe | Brak reguł kanałów online | 23 | Standardy publikacji i przejrzystość | Egzekwowalność, moderacja | Granice agitacji/reklamy/BOT‑ów |
| Konsultacje publiczne | Brak formalnej procedury | Ryzyko „wrzutek”, niski udział | 09 | Ramy konsultacji i odpowiedzi na uwagi | Wydłużenie procesu | Min. 14 dni, wyjątki pilne, raport |
| Kadencje/przejścia | Ciągłość do wyboru następców | Luki przejściowe/uzupełniające | 16, 17 | Rytm i tryb przejściowy | Kolizje z kalendarzem Uczelni | Harmonogram uzupełnień, vacatio |
| Posiedzenia i protokoły | Zał. nr 2 – ogólne | Brak standardu protokołów/nagrań | 01 (posiedzenia), 23 (publikacja) | Jawność i standard publikacji | Dane osobowe w nagraniach | Wzorzec protokołu, 7 dni publikacji, zasady nagrań |
| Konflikt interesów (COI) | Zakazy łączenia funkcji | Brak oświadczeń i wyłączeń | 03, 04, procedury | Mechanizmy COI w modułach | Niejednolita praktyka | Oświadczenia, rejestr COI, wyłączenia |
| Strategia i rozwój | Brak | Ad‑hoc, brak KPI | 11, 12 | Kierunki i ścieżki rozwoju | Realizacja celów | KPI roczne, raport SSPO, przegląd |
| Honor i ceremoniał | Brak | Niejasne wyróżnienia | 07, 10 | Transparentne tryby | Upolitycznienie | Kryteria, komisja, uzasadnienia, odwołania |
| Mapa dokumentów | Brak | Trudna orientacja | 18, 19 | Nawigacja i kontrola spójności | Aktualność | Automatyzacja aktualizacji + wersjonowanie |
| Wdrożenie i utrzymanie | Brak | Ryzyko „martwych przepisów” | 20 (2 pliki) | Plan legislacyjny i rollout | Zasoby i terminy | Harmonogram, role, szkolenia |

—

## 3) „Słabości i luki” starej wersji – oraz jak odpowiada v3 (przykłady z repo)

- Jawność i finanse: brak progów/formatów publikacji i wzorców danych → 04 + 23 definiują progi, schematy publikacji, terminy; odnośniki do Rejestru (wejście w życie: 01 § 40 – legacy).
- E‑głosowania i IT: brak audytu/logów/fallbacku → 13 + 14–15 + 21 + TESTING‑PLAN tworzą standard techniczny, testy i tryby awaryjne; zalecane DPIA i backupy.
- Etyka i zgłaszanie naruszeń: brak organu i procedury → 03 + 06: normy, whistleblowing, wyłączenia, postępowanie i środki.
- COI: tylko zakazy łączenia funkcji → 03/04/procedury: oświadczenia, rejestr i wyłączenia w sprawach własnych (do skonsolidowania jako wspólny standard).
- Konsultacje/OSR: brak ścieżki → 09 + przewodniki 20: minimalne okna, odpowiedzi na uwagi, raport z konsultacji.
- Kadencje/przejścia: brak rytmu i uzupełnień → 16 + 17: klarowna oś czasu i scenariusze przejściowe.
- Posiedzenia i protokoły: brak standardu protokołów/nagrań i terminów → rdzeń + 23: zasady publikacji, jawność, retencja; zalecany wzorzec protokołu i 7 dni publikacji.

—

## 4) Potencjalne zagrożenia nowego systemu i środki zaradcze

- Kolizje między modułami (np. etyka vs. finanse vs. wyborcze)
  - Środki: klauzula kolizyjna w 01 („lex superior → lex specialis → lex posterior”), macierz powiązań (19) i przypisy „first‑match” w modułach specjalnych.
- Spójność wersji i linków (częste aktualizacje)
  - Środki: centralny CHANGELOG, semantyczne wersjonowanie modułów, stabilne kotwice legacy (np. 01 § 40), mapa renumeracji (18 #mapa-renumeracji), wydania zbiorcze.
- Compliance RODO/IT w e‑procesach (logi, nagrania, głosowania)
  - Środki: DPIA, polityka retencji, anonimizacja, minimalizacja danych, audyty z UOI; testy obciążeniowe; procedury awaryjne.
- Nadmierna proceduralizacja (spowolnienie)
  - Środki: tryb pilny z OSR‑lite, limity czasów, radary ryzyka i SLA w przewodnikach.
- Egzekwowalność standardów publikacyjnych (moderacja, spory)
  - Środki: rola redakcji Rejestru (nie cenzury), zasady odwołań, jawny rejestr decyzji redakcyjnych.

—

## 5) Rekomendacje „last mile” przed uchwaleniem

1) Dodać/przypomnieć klauzulę kolizyjną w rdzeniu i wstępny porządek pierwszeństwa; ujednolicić wzmiankę o „lex specialis/lex posterior”.
2) Spiąć 04 z 23: progi jawności (np. umowy > 5 000/10 000), format CSV/JSON, kwartalne sprawozdania, audyt wewnętrzny, anonimizacja zgodna z RODO.
3) Sformalizować COI jako wspólny standard: oświadczenia interesów (wzór), rejestr COI, wyłączenia z głosowań, publikacja w Rejestrze (z anonimizacją).
4) Ustalić standard posiedzeń: wzorzec protokołu, termin publikacji do 7 dni, polityka nagrań i retencji, jawność list obecności (z ograniczeniami RODO), sygnatura sprawy.
5) Urealnić IT dla e‑głosowań: DPIA, szyfrowanie w spoczynku i transmisji, logi z podpisem czasu, DRC/backup, testy wydajnościowe i plan awaryjny offline.
6) Mapować reformę kadencyjną na kalendarz Uczelni i zdefiniować scenariusze wyborów uzupełniających (progi, terminy, publikacja wyników w 48h w Rejestrze).
7) W procedurach konsultacyjnych – minimum 14 dni (z wyjątkami pilnymi), obowiązkowy raport z konsultacji (matryca uwag: przyjęto/odrzucono + uzasadnienie).

—

## Aneks A – Szablon diffu paragrafowego (do uzupełnienia po eksporcie PDF)

| Paragraf/rozdz. | Było (PDF 2020) | Jest (v3: plik/rozdz.) | Skutek praktyczny | Rekomendacja | Priorytet |
|---|---|---|---|---|---|
| § … | … | … | … | … | wysoki/średni/niski |
| § … | … | … | … | … | … |

Instrukcja użycia:
- Dla odwołań do rdzenia stosuj stabilne kotwice legacy, np. wejście w życie: 01 § 40 → `01-regulamin-sspo.md#§-40`.
- Dla dokumentów z renumeracją skorzystaj z „Mapa renumeracji” w `18-indeks-dokumentow.md#mapa-renumeracji`.

—

## Aneks B – Mapa plików v3 (skrót)

01 Regulamin SSPO, 02 Ordynacja Wyborcza, 03 Kodeks Etyczny, 04 Regulamin Finansowy, 05 Regulamin WRS, 06 Komisja Etyki, 07 Kolegium Honorowych, 08 Rada Doradcza, 09 Procedury konsultacyjne, 10 Ceremoniał, 11 Strategia współpracy, 12 System rozwoju, 13 Zabezpieczenia systemowe, 14 Uzupełnione procedury, 15 Uproszczenia proceduralne, 16 Reforma kadencyjna, 17 Podsumowanie reformy, 18 Indeks, 19 Macierz powiązań, 20 Przewodnik uchwalenia, 20 Przewodnik wdrożeniowy, 21 Procedury – wizualizacje, 22 System współpracy, 23 Kodeks publikacyjny.

—

Uwagi redakcyjne:
- Zachowaj jednolitą numerację paragrafów (kolejne liczby całkowite); unikaj „§ 10a” – w razie potrzeby renumeruj i dodaj kotwice legacy.
- Przy linkach między modułami preferuj stabilne kotwice legacy (np. 01 § 40) i aktualizuj macierz powiązań (19) oraz indeks (18).
