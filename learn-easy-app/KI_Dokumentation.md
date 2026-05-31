# KI Dokumentation

Dieses Dokument beschreibt alle Bereiche des Projekts, bei denen KI (Claude) zur Unterstützung eingesetzt wurde.

---

## Bugfixes

### 1. JSX-Syntaxfehler in Home
Ein Syntaxfehler durch einen doppelten Block verhinderte den Start der App. Die KI hat den Fehler lokalisiert und behoben.

### 2. Quiz – Text im Light Mode nicht lesbar
Texte im Quiz waren im Light Mode nicht sichtbar, da Farben hardcodiert waren. Die KI hat die betroffenen Stellen auf theme-abhängige Farben umgestellt.

### 3. Quiz – Fehlender Zurück-Button
Im Quiz fehlte ein Zurück-Button. Die KI hat diesen ergänzt.

### 4. NothingFound-Komponente – Text unsichtbar im Light Mode
Die Leer-Zustand-Komponente zeigte im Light Mode keinen Text, da die Farbe hardcodiert weiß war. Die KI hat das auf theme-abhängige Farben korrigiert.

### 5. Bookmark-Bilder wurden nicht angezeigt
Gespeicherte Bilder aus den Kapiteln wurden in der Bookmark-Übersicht nicht angezeigt. Die KI hat die Ursache im Ladeverhalten der Daten identifiziert und behoben.

### 6. Zurück-Icon im Dark Mode unsichtbar
Das Zurück-Icon war im Dark Mode nicht sichtbar, da die Farbe hardcodiert schwarz war. Die KI hat das Icon korrekt auf das bestehende Farbsystem umgestellt.

### 7. Videos-Bookmark – falscher Titel und keine Inhalte
Der Videos-Bereich zeigte den falschen Titel und keine Inhalte an. Die KI hat Titel und Datenfilter korrigiert.

### 8. QuizResult – bestandener Quiz zeigte falsches Ergebnis
Bei einem bestandenen Quiz wurde trotzdem der „Try again"-Button angezeigt. Die KI hat den Logikfehler gefunden und behoben.

### 9. Kurswahl zeigte bereits abgeschlossene Kurse
Abgeschlossene Kurse wurden in der Kursauswahl weiterhin angezeigt. Die KI hat den Filter auf die richtige Datenquelle umgestellt.

### 10. „Choose next course" Button funktionierte nicht
Der Button zum Auswählen eines neuen Kurses nach Kursabschluss navigierte nicht zur richtigen Seite. Die KI hat den Fehler behoben.

### 11. Leerer Quiz nach Kapitelabschluss
Nach dem Abschließen aller Kapitel führte der „Take the quiz"-Button zu einem leeren Quiz. Die KI hat den fehlenden Parameter identifiziert und ergänzt.

### 12. Alte Bookmarks nach Kurswechsel noch sichtbar
Nach einem Kurswechsel waren die Bookmarks des vorherigen Kurses noch sichtbar. Die KI hat dafür gesorgt, dass beim Kurswechsel alle alten Bookmarks gelöscht werden.

### 13. Falsches Bild in der Suche
Bei der Suche wurde ein falsches, nicht zum Inhalt passendes Bild angezeigt. Die KI hat die Ursache im Fallback-Mechanismus gefunden und auf das korrekte Kursbild umgestellt.

### 14. Kurswechsel aus Account führte zu einem Datenbankfehler
Beim Kurswechsel über den Account-Tab trat ein Datenbankfehler auf, da versucht wurde einen neuen Nutzer mit fehlenden Daten anzulegen. Die KI hat die Logik so angepasst, dass immer korrekt geprüft wird ob ein Nutzer bereits existiert.

### 15. Suche zeigte Inhalte aus anderen Kursen
Die Suche zeigte nach einem Kurswechsel noch Inhalte des alten Kurses an. Die KI hat das Ladeverhalten so korrigiert, dass immer der aktuelle Kurs berücksichtigt wird.

### 16. Account – Änderungen wurden nicht sofort angezeigt
Änderungen wie der Daily Goal wurden im Account-Tab nicht sofort aktualisiert. Die KI hat das Ladeverhalten so angepasst, dass die Daten bei jedem Aufruf des Tabs neu geladen werden.

---

## Chapter Design

Das Design der Chapter-Screens wurde mithilfe von KI entwickelt. Layout, Farbgebung und die Darstellung der verschiedenen Inhaltstypen wurden mit KI-Unterstützung gestaltet und umgesetzt.

---

## Chapter Inhalte

Die Texte und Lerninhalte der einzelnen Kapitel wurden mithilfe von KI generiert. Die KI hat die Inhalte zu den jeweiligen Kursthemen erstellt und für eine Lern-App aufbereitet.

---

## Profilbild

Die Funktion zum Hochladen eines Profilbilds wurde zunächst ohne KI-Unterstützung implementiert, jedoch wurden die ausgewählten Bilder nicht korrekt angezeigt. KI wurde eingesetzt, um den Fehler zu identifizieren und die Implementierung korrekt umzusetzen.

---

## UX-Verbesserungen (Session 2 – User Feedback)

Basierend auf User-Tests mit 6 Interviews wurden folgende Verbesserungen mit KI-Unterstützung umgesetzt:

### 17. Username-Feld Hilfstext
Im Onboarding-Formular fehlte eine Erklärung was "Username" bedeutet. KI hat einen Placeholder (`z.B. max_müller`) und einen Hilfstext ("Nur Buchstaben, Zahlen und _ erlaubt") ergänzt. Betroffene Dateien: `components/Input.tsx`, `app/start/Start.tsx`

### 18. "Carry on"-Navigation klarer gestaltet
Der rechte Navigations-Pfeil zwischen Inhaltsblöcken (Text/Bild/Video) zeigt jetzt den nächsten Inhaltstyp an, z.B. "Weiter zum Video →". Betroffene Datei: `app/ChapterContent.tsx`

### 19. Course-Switch-Warnung umgeschrieben
Die Warnung beim Kurswechsel war zu beängstigend und hielt User davon ab zu wechseln. KI hat den Text beruhigend umformuliert und ein eigenes Modal anstelle des nativen Alerts eingebaut. Betroffene Datei: `app/(tabs)/Account.tsx`

### 20. "Saved to Library" Toast
Nach dem Speichern eines Bookmarks erscheint jetzt ein kurzer Toast "Saved to Library" bzw. "Removed from Library". Neue Komponente: `components/Toast.tsx`. Eingebaut in: `app/ChapterContent.tsx`, `app/(tabs)/Home.tsx`

### 21. Welcome-Screen nach Account-Erstellung
Nach dem Onboarding erscheint ein neuer Welcome-Screen mit "Are you ready to learn?" den der User aktiv bestätigen muss. Neue Datei: `app/start/Welcome.tsx`

### 22. Tab-Labels in der Bottom-Navigation
Alle vier Tabs haben jetzt sichtbare Labels: Home, Search, Library, Account. "Bookmarks" wurde zu "Library" umbenannt um den Zusammenhang mit "Saved to Library" herzustellen. Betroffene Datei: `app/(tabs)/_layout.tsx`

### 23. Single-Course-Modell im Onboarding erklärt
Auf der Kursauswahl-Seite wurde ein Hinweis hinzugefügt: "You can only have one active course at a time." Betroffene Datei: `app/start/Kurswahl.tsx`

### 24. Info-Icon stärker gestaltet
Das Info-Icon auf den Kurskarten war zu klein und wurde von allen 6 Usern übersehen. KI hat es in eine sichtbare "About"-Pill unten rechts auf dem Kursbild umgewandelt. Betroffene Datei: `app/start/Kurswahl.tsx`

### 25. Course-Switch in Settings verschoben
Der "Change Course"-Button wurde aus dem Options-Dropdown entfernt und direkt in die Further-Settings-Card eingefügt, wo er besser sichtbar ist. Betroffene Datei: `app/(tabs)/Account.tsx`

### 26. Auto-Routing nach "Finish Chapter"
Nach dem Abschließen eines Kapitels navigiert die App automatisch zum nächsten Kapitel oder zur Home-Seite, statt einfach zurück zu navigieren. Betroffene Datei: `app/ChapterContent.tsx`

### 27. Vollbild-Zoom für Bilder
Bilder im Chapter-Content können jetzt durch Antippen in einem Vollbild-Modal mit Pinch-to-Zoom angezeigt werden. Neue Komponente: `components/ImageViewer.tsx`

### 28. Detailliertes Quiz-Feedback
Nach dem Quiz werden falsche Antworten mit den korrekten Lösungen angezeigt, inklusive einem "Review Chapter"-Button der zum entsprechenden Kapitel führt. Betroffene Datei: `app/QuizResult.tsx`

### 29. Bookmark-IDs gefixt (doppelte Einträge)
Der `bookmarkCounter` wurde nach jedem App-Neustart auf 1 zurückgesetzt, wodurch neue Bookmarks alte überschrieben. KI hat die ID auf `content_id + Timestamp` umgestellt. Betroffene Datei: `db/database.js`

### 30. Bilder in Library mit expo-image
Bilder in der Library-Übersicht wurden manchmal nicht geladen (besonders GIFs). KI hat auf `expo-image` umgestellt das alle Formate unterstützt. Betroffene Datei: `app/bookmarks/Pictures.tsx`

### 31. Text-Bookmarks mit Kapitelinfo und Kurzvorschau
Text-Bookmarks zeigen jetzt den Kapitelnamen und nur eine 3-Zeilen-Vorschau statt dem ganzen Text. Betroffene Datei: `app/bookmarks/Texts.tsx`

### 32. Bookmarks bleiben beim Kurswechsel erhalten
Beim Kurswechsel wurden alle Bookmarks gelöscht. KI hat dieses Verhalten entfernt – Bookmarks sind jetzt kursübergreifend dauerhaft gespeichert. Betroffene Datei: `app/start/Kurswahl.tsx`

### 33. Expo SDK 55 → 56 Upgrade
Die App wurde von Expo SDK 55 auf SDK 56 aktualisiert. Dazu gehörten Paket-Updates, Import-Fixes in `components/haptic-tab.tsx` und die Entfernung des RxDB Dev-Mode Plugins. Betroffene Dateien: `package.json`, `components/haptic-tab.tsx`, `db/database.js`

### 34. Such-Navigation gefixt
Der Back-Button in den Suchergebnissen navigierte zu Home statt zurück zur Suchmaske. KI hat den Button auf die interne `handleBack()`-Funktion umgestellt. Betroffene Datei: `app/(tabs)/Suche.tsx`

### 35. Quiz-ChapterId gefixt
Der Quiz-Button auf der Home-Seite übergab immer die ID des letzten Kapitels. KI hat das auf das zuletzt abgeschlossene Kapitel (`currentChapter - 1`) korrigiert. Betroffene Datei: `app/(tabs)/Home.tsx`
