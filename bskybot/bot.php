<?php

// Kode for blueskybot:

// Hent tittel og wikipedia-ID frå tabell for person som
// - er rata høgast (stemmer / runder)
// - og har fått minst ei stemme
// - av dei folka som IKKJE har blitt delt på bsky tidlegare
// (Er tabellen tom, avslutt scriptet her)

// Hent personbeskrivelsen frå Wikipedia
// Trekk ut første avsnitt og fjern formatering

// Lag ein tekststreng beståande av tittelen (i store bokstavar) og første avsnitt
// Bryt tekststrengen opp i chunks på maks 300 teikn, etter mellomrom

// Koble opp mot Bluesky

// Gjer tittelen klikkbar med lenke til Wikipedia
// Post innlegga til Bluesky i ein tråd

// Legg ID i tabell over folk som har blitt delt på bsky allereie, så den ikkje kjem igjen
// (Husk å gi mysql-brukaren tilgong til å opprette rader)