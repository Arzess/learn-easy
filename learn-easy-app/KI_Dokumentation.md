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
