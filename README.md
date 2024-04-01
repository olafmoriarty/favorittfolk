# Favorittfolk.no

Kjeldekoden til favorittfolk.no, som gir deg fire nesten tilfeldig valde nordmenn frå ei liste på 47 000 og ber deg om å velja din favoritt.

Frontend: React
Backend: PHP (./public/api.php)

Databasen (MySQL) er ikkje inkludert i denne repoen, men inneheld ei rad for kvar person det går an å stemme på, henta frå norsk Wikipedia. Kvar rad inneheld kolonnene "title" (tittelen på wikipediaartikkelen), "pageid" (pageid for wikipediaartikkelen, primærnøkkel), "votes" (antall stemmer personen har fått, default 0) og "rounds" (antall runder personen har deltatt i, default 0).