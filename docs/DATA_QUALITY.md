# RIMCI — zasady jakości danych i ograniczenia wersji alpha

## Dane
Każdy rekord powinien docelowo zawierać: identyfikator, nazwy i aliasy, typ i rolę technologiczną, mechanizm, przeciwwskazania, źródła, datę weryfikacji, poziom dowodów oraz status recenzji. Obecne wpisy są **robocze**, nie mają kompletnej bibliografii i nie stanowią potwierdzenia bezpieczeństwa.

## Interpretacja etykiet
- Nie wolno wyliczać procentów ani dawek z kolejności składników.
- Jednostki IU/JM wymagają przelicznika przypisanego do konkretnej substancji.
- Masa soli magnezu, wapnia czy cynku nie jest automatycznie ilością pierwiastka.
- Porcje dzienne, porcje pojedyncze i ilości na 100 g to różne podstawy. Nie sumować bez ujednolicenia.
- Mieszanki zastrzeżone nie pozwalają na wyliczenie ilości poszczególnych substancji.
- Wpis nierozpoznany musi pozostać nierozpoznany; nie stosować domyślnych dopasowań na siłę.
- Wersja beta nie identyfikuje produktów producentów automatycznie ani nie weryfikuje ich etykiet.

## Interakcje
Powiązania klasyfikujemy jako **wchłanianie**, **metabolizm**, **synergia funkcjonalna**, **konflikt** lub **brak wystarczających danych**. Powiązanie mechanistyczne nie oznacza udowodnionej korzyści klinicznej ani konieczności jednoczesnego przyjmowania. W szczególności K2 nie jest uznawana za wzmacniacz wchłaniania D3.

## Bezpieczeństwo i prywatność
Nie umieszczać w publicznym repozytorium danych o zdrowiu, przyjmowanych lekach ani prywatnej historii suplementacji. Aktualna aplikacja przechowuje produkty i listę posiadanych składników lokalnie w przeglądarce, bez synchronizacji i bez szyfrowania na poziomie aplikacji. Współdzielone urządzenie lub profil przeglądarki nie zapewnia prywatności.

Wersja alpha **nie ustala indywidualnych dawek** i nie zastępuje lekarza ani farmaceuty. Szczególnej ostrożności wymagają m.in. ciąża, choroby nerek i wątroby, leki przeciwkrzepliwe oraz suplementy o wąskim marginesie bezpieczeństwa.

## Najbliższe zadania
1. Jawny model porcji produktu (porcja, liczba kapsułek, ilość dzienna).
2. Rozróżnianie masy związku od ilości substancji elementarnej.
3. Import/eksport lokalnych produktów i kopie zapasowe.
4. Testy parsera i testy interfejsu w przeglądarce.
5. Bibliografia i redakcyjny status weryfikacji każdej karty.
6. Dopiero potem ostrożne ostrzeżenia o kumulacji i potencjalnych interakcjach.
