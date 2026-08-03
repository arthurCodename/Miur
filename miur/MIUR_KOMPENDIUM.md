# Miur — kompendium

Wszystko w jednym miejscu: co jest zbudowane, jak konkretnie działa, jakie
przepływy zachodzą, co jest otwarte i o co trzeba zapytać.

**Stan na:** 3 sierpnia 2026 · **Branch:** `integration` · **Typecheck i lint:** czysto

---

## Spis treści

1. [Stan w jednym zdaniu](#1-stan-w-jednym-zdaniu)
2. [Architektura — z czego to się składa](#2-architektura--z-czego-to-się-składa)
3. [Łańcuchy — jak to konkretnie działa](#3-łańcuchy--jak-to-konkretnie-działa)
4. [Co jest zbudowane — pliki i funkcje](#4-co-jest-zbudowane--pliki-i-funkcje)
5. [Bezpieczeństwo](#5-bezpieczeństwo)
6. [Optymalizacja](#6-optymalizacja)
7. [Dane o katalogu erotizo](#7-dane-o-katalogu-erotizo)
8. [Wymogi prawne](#8-wymogi-prawne)
9. [Otwarte decyzje](#9-otwarte-decyzje)
10. [Wszystkie pytania do zadania](#10-wszystkie-pytania-do-zadania)
11. [Co dalej](#11-co-dalej)

---

## 1. Stan w jednym zdaniu

**Sklep jest zbudowany. Nie potrafi przyjąć pieniędzy.**

Dosłownie: gdyby dziś wszedł prawdziwy klient i przeszedł całą ścieżkę
zakupową, dostałby stronę „dziękujemy", my dostalibyśmy zapis zamówienia — i
nikt by nic nie zapłacił, i żadna paczka by nie wyjechała.

| Obszar | Stan |
|---|---|
| Fundament (Next.js, baza, CSP, strony prawne) | ✅ gotowe |
| Konta (rejestracja, logowanie, reset hasła) | ✅ gotowe |
| Koszyk (serwerowy, łączenie przy logowaniu) | ✅ gotowe |
| Checkout — formularz, dostawa, zgody | ✅ gotowe |
| Katalog — 25 652 produkty z erotizo | ✅ gotowe |
| Wyszukiwarka — ogonki i literówki | ✅ gotowe (niepodpięta do frontu) |
| Zamówienia — zapis do bazy | ✅ gotowe |
| Maile — potwierdzenie i wysyłka | ✅ gotowe |
| **Płatności** | ❌ **blokada** |
| Automatyczny zwrot przy braku towaru | ❌ |
| Etykiety InPost | ❌ (mapa działa, brak konta ShipX) |
| Panel administracyjny | ❌ |
| Zdjęcia na własnym hostingu | ❌ (linkują do erotizo) |
| Ograniczenie prób logowania | ❌ |
| Test dostępności (EAA) | ❌ |

---

## 2. Architektura — z czego to się składa

Każda nazwa w projekcie jest jedną z trzech rzeczy. To upraszcza obraz.

### 2.1 Nasz własny program

| Co | Do czego |
|---|---|
| **Next.js 16** | Szkielet aplikacji. Folder = adres URL. Łączy kod serwerowy i przeglądarkowy w jednym projekcie. |
| **React** | Opis tego, jak wygląda ekran dla danych danych. |
| **TypeScript** | JavaScript ze sprawdzaniem typów — błąd wychodzi przed wdrożeniem, nie u klienta. |
| **Tailwind** | Style pisane nazwami klas. |

### 2.2 Usługi, które wynajmujemy

| Usługa | Rola | Status |
|---|---|---|
| **Neon** | Hosting bazy PostgreSQL | działa |
| **Vercel** | Hosting strony | działa |
| **Cloudflare** | Przyspieszenie + ochrona przed ruchem botów | planowane |
| **Resend** | Wysyłka maili | działa (domena niezweryfikowana) |
| **Przelewy24** | Płatności | **brak konta** |
| **InPost** | Paczkomaty i przesyłki | mapa działa, brak konta ShipX |
| **erotizo.pl** | Dostawca towaru | działa |
| **Inngest** | Uruchamianie procesów w tle | planowane |
| **Inkubator** | Księgowość + CRM | do ustalenia |

### 2.3 Biblioteki pomocnicze

`Drizzle` (zapytania do bazy w TypeScripcie) · `Auth.js` (logowanie i sesje) ·
`bcryptjs` (skróty haseł) · `Zod` (walidacja danych wejściowych) ·
`Zustand` (pamięć koszyka w przeglądarce) · `React Hook Form` (formularze) ·
`React Email` (szablony maili) · `sax` (parser strumieniowy XML) ·
`shadcn/ui` (gotowe komponenty interfejsu)

### 2.4 Rozszerzenia bazy danych

| Rozszerzenie | Po co |
|---|---|
| `pg_trgm` | Wyszukiwanie odporne na literówki |
| `unaccent` | „zel" znajduje „żel" |
| Indeksy GIN | Przyspieszenie obu powyższych |

---

## 3. Łańcuchy — jak to konkretnie działa

### 3.1 Łańcuch: klient dodaje produkt do koszyka

```
1. Klik "Do koszyka"          [PRZEGLĄDARKA]
   ↓ cena tekstowa "349,00 zł" zamieniana na liczbę 349
2. Dopisanie do koszyka        [PRZEGLĄDARKA] — natychmiast, licznik skacze
3. Zapis do localStorage       [PRZEGLĄDARKA] — przetrwa zamknięcie karty
4. Odczekanie 0,5 sekundy      [PRZEGLĄDARKA] — 5 klików = 1 zapytanie
5. POST /api/cart              [SIEĆ]
6. Sprawdzenie danych (Zod)    [SERWER] — nic z przeglądarki nie jest brane na wiarę
7. Kim jest ten klient?        [SERWER] — zalogowany → userId, gość → ciasteczko
8. Zapis do bazy               [BAZA] — jedna operacja, bez wyścigu
```

**Ważne:** licznik koszyka aktualizuje się w kroku 2, zanim serwer cokolwiek
usłyszy. Dlatego klikanie jest natychmiastowe.

**Przy logowaniu:** koszyk anonimowy jest scalany z koszykiem konta, nie
kasowany.

### 3.2 Łańcuch: zamówienie i płatność (Golden Flow) — DO ZBUDOWANIA

```
1. Klik "Przejdź do płatności"     [PRZEGLĄDARKA]
2. Sprawdzenie stanów magazynowych [SERWER] tuż przed przekierowaniem
3. Zapis zamówienia, status PENDING [BAZA]
4. Przekierowanie na Przelewy24     [POZA NAMI] — nie widzimy danych karty
5. Klient płaci                     [POZA NAMI]
6. P24 dzwoni do nas: "zapłacone"   [SIEĆ] ← webhook
   ├─ 6a. Czy już to obsłużyliśmy?  [SERWER] jeśli tak → 200 OK i koniec
   └─ 6b. Weryfikacja podpisu CRC   [SERWER] fałszywka → odrzucamy
7. Status: P24_PAID                 [BAZA]
8. PAUZA 15 MINUT                   [INNGEST]
   └─ klient widzi przycisk "Anuluj" → zwrot → koniec
9. Wysłanie zamówienia do erotizo   [SIEĆ] discreet_packaging: true
   ├─ 9a. ODRZUCONE → zwrot → mail z przeprosinami → CANCELLED_REFUNDED
   └─ 9b. PRZYJĘTE → dalej
10. Wystawienie faktury             [CRM/księgowość]
11. Mail z potwierdzeniem + PDF     [RESEND]
12. Status: COMPLETED               [BAZA]
```

**Krok 6a jest najważniejszą linijką w całym systemie.** Operatorzy płatności
wysyłają to samo powiadomienie wielokrotnie (sieć bywa zawodna, więc ponawiają
dla pewności). Bez tego sprawdzenia wysłalibyśmy zamówienie dwa razy i dwa razy
wystawili fakturę.

**Krok 8 — po co pauza:** przy zapieczętowanych produktach intymnych mamy prawo
odmówić zwrotu po otwarciu. Jeśli klient rozmyśli się dziesięć minut po
zakupie, bez tej pauzy zostajemy z wyborem: zły klient albo towar, którego nie
odsprzedamy. Kwadrans nic nie kosztuje i usuwa ten problem.

**Krok 9a wydarzy się często, nie wyjątkowo.** Nie mamy własnego magazynu.

### 3.3 Łańcuch: pieniądze (model inkubatora)

**Łańcuch pierwszy — z udziałem sklepu:**

```
Klient płaci → Przelewy24 → pieniądze trafiają do księgowości inkubatora
```

**Łańcuch drugi — bez udziału sklepu:**

```
Pieniądze zbierają się w księgowości
   ↓ [RĘCZNIE] prośba o przelew
Subkonto przedpłacone u erotizo
   ↓ [AUTOMATYCZNIE PO STRONIE EROTIZO]
Pobranie kwoty za każde zrealizowane zamówienie
```

**Dobra wiadomość:** pieniądze nigdy nie przepływają przez nasz kod. Nie
trzymamy sald ani danych kart — mniej kodu i znacznie mniej obowiązków
prawnych.

**Trzy problemy, które ten model tworzy:**

| Problem | Na czym polega |
|---|---|
| **Subkonto może się wyczerpać** | Klient zapłacił, towar jest, ale saldo puste → zamówienie odrzucone. Ten sam skutek co brak towaru, inna przyczyna. Ryzyko realne, bo przelew z księgowości jest opóźniony — weekend ze skokiem sprzedaży wyzeruje saldo szybciej, niż zdążycie je uzupełnić. |
| **Kto może zwrócić pieniądze?** | Zwrot idzie przez API Przelewy24 na koncie sprzedawcy. Jeśli konto należy do inkubatora — czy nasz kod może wywołać zwrot, czy musi to zrobić człowiek? **Jeśli człowiek, automatyczne zwroty nie istnieją** i zamiast nich potrzebna jest kolejka do ręcznej obsługi. To inny projekt. |
| **Trzy systemy, trzy liczby** | Sklep wie ile sprzedał i po ile kupił. Księgowość wie ile wpłynęło. Erotizo wie ile pobrało. Nikt tego automatycznie nie porówna. Stąd kolumny `wholesale_price_net` i `net_profit`. |

**Konsekwencja finansowa dla Bodzi:** model przedpłaty oznacza, że pieniądze
muszą być u erotizo **zanim** klient kupi. To kapitał obrotowy zamrożony z góry.

### 3.4 Łańcuch: import katalogu z erotizo

```
1. Pobranie pliku do katalogu tymczasowego  (69 MB)
2. Parsowanie strumieniowe                   3 s, 32 MB pamięci
3. Zapis 72 podmiotów odpowiedzialnych      (GPSR)
4. Zapis produktów partiami po 500
   └─ cena = hurt netto × marża × (1 + VAT)
5. Wycofanie produktów zniknniętych z feedu (miękkie usunięcie)
```

**Dlaczego pobieramy do pliku, a nie przetwarzamy z sieci:** zerwane połączenie
w połowie 69-megabajtowego pliku zostawiłoby katalog w połowie zaktualizowany.
Tak albo pobranie się uda, albo synchronizacja w ogóle nie startuje.

**Dlaczego strumieniowo:** wczytanie 69 MB w całości wymaga kilkuset MB pamięci
i zabiłoby proces na serwerze. Parser strumieniowy trzyma w pamięci jeden
produkt naraz.

**Rytm:** pełny katalog raz dziennie, stany i ceny co godzinę — tak często, jak
erotizo generuje pliki. Częściej nie ma sensu.

### 3.5 Łańcuch: maile

```
Zamówienie zapisane → notifyOrderCreated() → szablon React Email → Resend → klient
```

**Zasada:** błąd wysyłki maila **nigdy** nie wywala zamówienia. Zamówienie jest
już w bazie; gdyby błąd poleciał dalej, klient zobaczyłby komunikat o błędzie i
zamówił drugi raz. Błąd jest łapany i zapisywany do logów.

---

## 4. Co jest zbudowane — pliki i funkcje

### Checkout

| Plik | Funkcja |
|---|---|
| `app/checkout/page.tsx` | Formularz, walidacja PL (telefon, kod pocztowy), wybór dostawy, widget InPost, zgody RODO, zakup jako gość |
| `components/checkout/OrderSummary.tsx` | Panel podsumowania reagujący na wybraną dostawę |
| `lib/checkout/shipping.ts` | Stawki: paczkomat 12,99 / kurier 16,99 / darmowa od 199 zł |
| `components/checkout/CartSheet.tsx` | Wysuwany koszyk |

### Zamówienia

| Plik | Funkcja |
|---|---|
| `app/api/orders/route.ts` | Endpoint POST |
| `lib/orders/create.ts` | `createOrder()` — **ceny z bazy, nigdy z przeglądarki**; migawka pozycji; kasowanie koszyka |
| `lib/orders/zod.ts` | Walidacja |
| `lib/orders/notify.ts` | `notifyOrderCreated()`, `describeDelivery()` |
| `app/checkout/success/page.tsx` | Potwierdzenie — cudzego zamówienia nie zobaczysz |

### Maile

| Plik | Funkcja |
|---|---|
| `lib/email/templates/BaseLayout.tsx` | Wspólna ramka, nadawca „Salgo" |
| `lib/email/templates/OrderConfirmation.tsx` | Potwierdzenie z pouczeniem o 14 dniach |
| `lib/email/templates/ShippingNotification.tsx` | Powiadomienie o wysyłce (bez wywołania) |
| `lib/email/send-*.ts` | Opakowania na Resend |
| `scripts/preview-emails.tsx` | Podgląd maili + testy matematyki i bloków prawnych |

### Katalog

| Plik | Funkcja |
|---|---|
| `lib/catalog/sync/parse-feed.ts` | `parseCatalogFeed()`, `parseStockFeed()`, `parseResponsibles()` |
| `lib/catalog/sync/sync-catalog.ts` | `syncCatalog()`, `slugifyProduct()`, `calculateRetailPrice()` |
| `scripts/sync-catalog.ts` | Uruchamianie z linii poleceń |
| `db/schema.ts` | Kolumny: hurt, marża, VAT, zdjęcia, kategoria, marka, EAN, waga + tabela `responsibles` |

### Wyszukiwarka

| Plik | Funkcja |
|---|---|
| `db/sql/001_search_unaccent.sql` | Rozszerzenia + funkcja `immutable_unaccent()` |
| `scripts/apply-sql.ts` | Nakładanie SQL, którego Drizzle nie opisze |
| `lib/catalog/search-products-db.ts` | `searchProductsInDb()` |

### Bezpieczeństwo i konfiguracja

| Plik | Funkcja |
|---|---|
| `proxy.ts` | CSP z losowym tokenem na każde żądanie |
| `next.config.ts` | Sześć nagłówków bezpieczeństwa, przekierowania, przepisania URL |
| `lib/env/server-env.ts` | Blokada wdrożenia produkcyjnego przy brakujących danych sprzedawcy |
| `auth.ts` / `auth.config.ts` | Logowanie, sesje, scalanie koszyka |

---

## 5. Bezpieczeństwo

### Co jest zrobione

| Obszar | Zabezpieczenie |
|---|---|
| **Nagłówki HTTP** | `X-Frame-Options: DENY` (nikt nie osadzi sklepu w ramce na swojej stronie), `nosniff`, `Referrer-Policy`, `Permissions-Policy` (blokada kamery i mikrofonu), `HSTS` (wymuszenie HTTPS), `X-DNS-Prefetch-Control` |
| **CSP** | 14 dyrektyw, **losowy token do każdego żądania**. Najskuteczniejsza obrona przed wstrzyknięciem obcego skryptu. `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'` |
| **Hasła** | bcrypt, koszt 12. W bazie nigdy hasło, tylko nieodwracalny skrót |
| **Reset hasła** | Token 256-bitowy, w bazie tylko skrót SHA-256, ważny 30 min, jednorazowy, unieważnia pozostałe |
| **Ochrona przed sprawdzaniem kont** | Logowanie i „zapomniałem hasła" odpowiadają zawsze tak samo. Przy tym asortymencie to nie drobiazg — inaczej dałoby się sprawdzić, czy dana osoba u nas kupuje |
| **Ceny** | Liczone na serwerze z bazy. Podmiana ceny w przeglądarce nic nie daje |
| **Ciasteczka** | `HttpOnly` (skrypt ich nie odczyta), `sameSite: lax`, `secure` na produkcji |
| **Walidacja** | Zod na każdym wejściu API |
| **Miękkie usuwanie** | Produkty nie znikają — historia zamówień zostaje spójna |

### Czego brakuje

| Luka | Skutek |
|---|---|
| Brak ograniczenia liczby prób | Logowanie i rejestrację można nękać bez limitu; można też wyczerpać limit maili |
| Rejestracja zdradza istnienie konta | Da się sprawdzić, czy dany adres u nas kupuje |
| Brak potwierdzania adresu e-mail | Można się zarejestrować na cudzy adres |
| Numery zamówień po kolei | Strony potwierdzeń gości da się zgadywać |
| Brak testów dostępności | Wymóg prawny (EAA) |
| Brak CI | Nic nie sprawdza kodu automatycznie przed wdrożeniem |
| `drizzle-kit push` zamiast migracji | Ryzykowne na produkcji |

---

## 6. Optymalizacja

| Zabieg | Efekt |
|---|---|
| Indeksy wyszukiwarki | **359 ms → 4,5 ms** (80×) |
| Parser strumieniowy | 69 MB przy 32 MB pamięci zamiast kilkuset |
| Komponenty serwerowe | Do przeglądarki idzie JavaScript tylko tam, gdzie trzeba klikać. Przycisk „do koszyka" jest osobnym plikiem właśnie po to — inaczej cała karta produktu leciałaby jako kod |
| Opóźniona synchronizacja koszyka | 5 kliknięć = 1 zapytanie |
| Zapis partiami | 25 652 produkty w 22 s |
| CSP pomijane dla plików statycznych | Mniej wywołań na Vercelu = niższy rachunek |
| `ANALYZE` po imporcie | Bez tego baza dalej skanowałaby wszystko po kolei |

---

## 7. Dane o katalogu erotizo

**Dostęp:** dwa pliki XML. Adres zawiera token — **traktować jak hasło**,
trzymać w `.env.local`, nigdy w kodzie. Kto ma link, pobiera cały katalog z
cenami hurtowymi.

| Plik | Rozmiar | Odświeżanie | Zawiera |
|---|---|---|---|
| `products.xml` | 69 MB | raz dziennie | pełny katalog, opisy, zdjęcia, kategorie, EAN, waga |
| `basic.xml` | 5 MB | co godzinę | tylko stany i ceny |

### Co pokazały prawdziwe dane

| Ustalenie | Znaczenie |
|---|---|
| **25 652 produkty** | |
| **Połowa niedostępna** — 12 675 ma stan zerowy | Normalne przy dropshippingu, ale front musi to ukrywać |
| **10 843 do kupienia** po odjęciu bufora | Bufor „nie sprzedawaj ostatnich 3 sztuk" ukrywa 2 134 produkty ponad te zerowe — 16% oferty |
| **Trzy stawki VAT:** 23% (25 039), 8% (572), 5% (41) | Nie da się zaszyć jednej stawki. Faktury muszą liczyć VAT per pozycja |
| **Brak sugerowanej ceny detalicznej** — `price_net` = `price_retail_net` we wszystkich wierszach | **Każda cena jest naszą decyzją.** Erotizo nie podpowiada nic |
| **Opisy już istnieją** jako gotowy HTML po polsku | Zadanie dla AI to nie *pisanie* opisów, tylko *przepisywanie* — te same teksty publikuje każdy inny sklep z erotizo, a Google karze duplikaty |
| **2–8 zdjęć na produkt**, 25 631 produktów ma zdjęcia | Hotlinkowania nie wolno — trzeba przenieść na własny hosting |
| **72 podmioty odpowiedzialne** (GPSR), przypisane do 25 378 produktów | Wymóg prawny, patrz niżej |
| `prod_hidden` / `prod_search_hidden` | Obecnie nikt nie jest oznaczony, ale kod to respektuje |
| `prod_weight`, `prod_ean` | Waga umożliwia prawdziwe stawki InPost; EAN jest wymagany do Google Shopping |

### Cena — uwaga krytyczna

Wszystkie ceny na stronie liczy się dziś tak:

```
cena detaliczna = hurt netto × 2,0 × (1 + VAT)
```

Przykład: produkt kosztujący 22,12 zł netto jest wystawiony za 54,42 zł.

**Mnożnik 2,0 to zaślepka.** Wybrałem go, żeby liczby wyglądały sensownie, a
nie na podstawie analizy rynku. Skoro erotizo nie podaje ceny sugerowanej, to
jest wyłącznie decyzja biznesowa i trzeba ją podjąć świadomie przed startem.
Można zmieniać globalnie albo per produkt.

---

## 8. Wymogi prawne

| Wymóg | Stan |
|---|---|
| **Potwierdzenie na trwałym nośniku** (art. 21 ustawy o prawach konsumenta) | ✅ mail z potwierdzeniem zawiera pozycje, dostawę, sumę i pouczenie o 14 dniach |
| **Bramka wieku 18+** | ✅ |
| **Zgoda na cookies** | ✅ analityka domyślnie wyłączona do momentu zgody |
| **Zgody RODO przy zamówieniu** | ✅ regulamin i polityka wymagane, newsletter domyślnie odznaczony |
| **Dane sprzedawcy** (NIP, REGON) | ✅ w stopce i mailach — **do potwierdzenia, czyje po ustaleniu roli inkubatora** |
| **GPSR** — podmiot odpowiedzialny przy produkcie | ⚠️ dane zaimportowane, **ale nigdzie nie wyświetlane**. To jest wymóg, nie ozdoba |
| **Omnibus** — historia ceny z 30 dni | ❌ tabela istnieje, nic jej nie zapisuje |
| **EAA — dostępność** | ❌ nietestowane, obowiązkowe |
| **Prawo do bycia zapomnianym** | ❌ |

---

## 9. Otwarte decyzje

### Największa: własny sklep czy TrisoShop

| | Własny sklep | TrisoShop |
|---|---|---|
| Płatności | ❌ do zbudowania (~tydzień) | ✅ Przelewy24 w standardzie |
| Etykiety InPost | ❌ | ✅ |
| Faktury | ❌ | ✅ + integracja z księgowością |
| Panel administracyjny | ❌ | ✅ |
| Synchronizacja erotizo | ✅ zbudowana | ✅ **erotizo jest na ich liście** |
| Zdjęcia na własnym hostingu | ❌ do zbudowania | ✅ automatycznie |
| Design Bogdana | ✅ | ❌ chyba że tryb headless |
| Kontrola nad dyskrecją | ✅ pełna | ⚠️ w zakresie panelu |
| Utrzymanie i zmiany w prawie | nasz problem, na zawsze | ich problem |
| Koszt | czas programisty | od 59 zł/mies. |

**Uwaga o koszcie utopionym:** to, że dużo zbudowaliśmy, **nie jest argumentem**.
Ten czas jest wydany niezależnie od decyzji. Liczy się tylko, co jest lepsze od
dziś do przodu.

**Sugestia:** rozważyć odwrócenie kolejności — uruchomić na Trisie, sprawdzić,
czy ludzie kupują, a własny sklep dokończyć później, jeśli szablon zacznie
ograniczać. Dziś nie wiecie, czy będzie sprzedaż; miesiąc pracy na backend to
najdroższy sposób zadania tego pytania. Kod nie zgnije — katalog, wyszukiwarka i
maile zostają na branchu.

**Co przetrwa przejście na Trisa:**

| | |
|---|---|
| Kod backendu | ❌ niepotrzebny |
| Design i front | ❌ chyba że headless |
| **Wiedza o feedzie** (3 stawki VAT, brak ceny sugerowanej, połowa katalogu niedostępna) | ✅ |
| **Decyzja o marży** | ✅ nadal Wasza |
| **Wymogi prawne** (GPSR, Omnibus, EAA) | ✅ trzeba dopytać, czy Triso je spełnia |

### Pozostałe otwarte

- **Nadawca maili:** „Salgo" czy „Miur"? Dziś Salgo — jak na przesyłce. Ale mail
  od nieznanej nazwy wygląda jak oszustwo. Jedna linijka w kodzie.
- **Host bazy:** CLAUDE.md mówi DigitalOcean, działamy na Neon. **Polityka
  prywatności wymienia DigitalOcean** — jeśli produkcja to Neon, ta strona
  podaje nieprawdę o tym, gdzie leżą dane klientów. To wada zgodności, nie
  literówka.
- **Redis** — rekomendacja: pominąć w v1, bufor stanu załatwia to samo taniej.

---

## 10. Wszystkie pytania do zadania

### Do inkubatora — najpierw te trzy

1. **Czy przez Was można w ogóle sprzedawać artykuły dla dorosłych?** Jeśli nie,
   reszta rozmowy jest bezprzedmiotowa.
2. **Kto jest sprzedawcą wobec klienta — Wy czy my?** Od tego zależy, czyj NIP i
   nazwa idą do regulaminu, stopki i na każdą fakturę.
3. **Kto jest administratorem danych osobowych?** Nasi klienci kupują produkty
   ujawniające informacje o życiu seksualnym — to dane szczególnej kategorii
   (art. 9 RODO), inny poziom obowiązków niż sklep z butami.

### Do inkubatora — księgowość

4. Faktury wystawiają się automatycznie po opłaconym zamówieniu czy ręcznie?
5. Czy Wasz system ma API — czy sklep może zlecić wystawienie faktury?
6. Czy faktura rozbija kwotę na towar i osobno usługę dostawy?
7. Jak obsługujecie trzy stawki VAT (23 / 8 / 5%)?
8. Jak wygląda korekta przy zwrocie? Przy dropshippingu to codzienność.
9. KSeF — kto i kiedy nas podłącza?

### Do inkubatora — CRM

10. Jaki to konkretnie system? (Potrzebna nazwa.)
11. Wystawia faktury czy tylko prowadzi klientów?
12. Ma API?
13. Kto po Waszej stronie ma dostęp do danych klientów?
14. Czy możemy wysyłać tylko numer zamówienia i kwoty, **bez nazw produktów**?
    Rekomendacja: tak. Raz wysłanej historii zakupów się nie cofnie.

### Do inkubatora — pieniądze

15. Na czyj rachunek wpływają pieniądze i jak trafiają do nas?
16. **Czy nasz system może wywołać zwrot przez API Przelewy24, czy zwrot zawsze
    robi księgowość ręcznie? Ile to trwa?** ← to pytanie zmienia najwięcej
17. Kto podpisuje umowy z Przelewy24, InPost i erotizo?
18. Czy Wasza umowa z Przelewy24 dopuszcza branżę erotyczną?

### Do inkubatora — na koniec

19. Co się dzieje, gdy odchodzimy? Zabieramy bazę klientów i historię zamówień?
20. Narzucacie jakieś rozwiązanie sklepowe? (Dotyczy decyzji Triso.)
21. Ile to kosztuje — stała opłata, procent od obrotu, czy jedno i drugie?

### Do erotizo

22. Czy saldo subkonta da się odczytać automatycznie? Powiadamiacie o niskim
    stanie?
23. Co dokładnie zwracacie przy odrzuceniu zamówienia — czy odróżniamy „brak
    towaru" od „brak środków"? To dwie różne wiadomości do klienta.
24. Jak wygląda API składania zamówień i czy wspiera dyskretne opakowanie?

### Do TrisoShop

25. Czy da się użyć własnego frontu (tryb headless)?
26. Jak obsługujecie 18+: bramka wieku, dyskretne opakowanie, neutralny nadawca?
27. Czy Przelewy24 przez Was akceptuje branżę erotyczną?
28. Czy wyświetlacie dane GPSR przy produkcie? Prowadzicie historię cen
    (Omnibus)? Czy szablony spełniają EAA?
29. Jak często synchronizujecie stany z erotizo?

---

## 11. Co dalej

**Wstrzymane do decyzji Triso.** Nie zaczynam płatności — to tydzień pracy,
który przepada przy przejściu na platformę.

Jeśli **zostajemy przy własnym sklepie**, kolejność jest taka:

| Krok | Czas | Uwagi |
|---|---|---|
| 1. Płatności (Golden Flow) | 5–8 dni | Blokada. Wymaga konta testowego P24 |
| 2. Kolumny marży i zysku | z tą samą zmianą bazy | Potem trudno uzupełnić |
| 3. Etykiety InPost | 2–3 dni | Po zatwierdzeniu konta ShipX |
| 4. Panel administracyjny | 3–5 dni | Da wreszcie wywołanie mailowi o wysyłce |
| 5. Zdjęcia na własny hosting | 1–2 dni | 25 631 produktów |
| 6. Podpięcie wyszukiwarki do frontu | pół dnia | Baza ma już kategorie i zdjęcia |
| 7. Ograniczenie prób logowania | 1 dzień | |
| 8. GPSR na stronie produktu | pół dnia | Wymóg prawny |
| 9. Omnibus — historia cen | 1 dzień | Wymóg prawny |
| 10. Dostępność (EAA) | 3–4 dni | Wymóg prawny |

**Czekamy na innych:**

| Co | Czas | Blokuje |
|---|---|---|
| **Konto testowe Przelewy24** | 1–3 dni | Płatności, czyli otwarcie sklepu |
| Konto InPost ShipX | 1–2 dni | Etykiety |
| Odpowiedzi inkubatora | — | Faktury, zwroty, dane sprzedawcy |
| Dostęp do DNS miur.pl | 10 min | Maile lecą z tymczasowego adresu i część trafia w spam |

**Rozwiązane:** dostęp do erotizo. To było ryzyko z tygodniami negocjacji —
działa, katalog zaimportowany.

---

*Wersja techniczna: `MIUR_PROJECT_STATUS.md`. Wersja bez żargonu:
`MIUR_STATUS_PLAIN.md`.*
