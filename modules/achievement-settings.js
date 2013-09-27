module.exports = {

	achievements: [
	    { 	"code":"001", 
		  	"when": "Al verificarsi dell'evento",
		  	"cli-srv": "CLI",
			"name": "La doppietta",
			"meaning": "Fai 2 scope di seguito",
			"symbol": "mazzo con due scope (carte di traverso)"
	    },
	    { 	"code":"002", 
		 	"when": "Al verificarsi dell'evento",
		 	"cli-srv": "CLI",
			"name": "Lo sparecchiatavolo",
			"meaning": "Fai 3 scope di seguito",
			"symbol": "mazzo con tre scope (carte di traverso)"
		},	
	    { 	"code":"003", 
		 	"when": "Al verificarsi dell'evento",
		 	"cli-srv": "CLI",
			"name": "Micidiale!",
			"meaning": "Fai 4 scope di seguito",
			"symbol": "un fulmine"
		},
		{ 	"code":"004", 
		 	"when": "Al verificarsi dell'evento",
		 	"cli-srv": "CLI",
			"name": "Scopa ricca",
			"meaning": "Fai scopa con il settebello",
			"symbol": "mazzo con settebello di traverso"
		},
		{ 	"code":"005", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Il pigliatutto",
			"meaning": "Chiudi una mano e lascia l'avversario a zero",
			"symbol": ""
		},
		{ 	"code":"006", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Terminator",
			"meaning": "Chiudi una mano con più di 8 punti",
			"symbol": "faccia terminator (schwarzeneger)"
		},
		{ 	"code":"007", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Il borsellino",
			"meaning": "Prendi almeno 8 denari",
			"symbol": "borsellino"
		},
		{ 	"code":"008", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Il salvadanaio",
			"meaning": "Prendi almeno 9 denari",
			"symbol": "salavadanaio"
		},
		{ 	"code":"009", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Il forziere",
			"meaning": "Prendi tutti i denari",
			"symbol": "forziere"
		},
		{ 	"code":"010", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Il primierista",
			"meaning": "Fai primiera con tutti i sette",
			"symbol": "i 4 sette"
		},
		{ 	"code":"011", 
		 	"when": "Fine mano",
		 	"cli-srv": "CLI",
			"name": "Il mazzo d'argento",
			"meaning": "Prendi almeno 30 carte",
			"symbol": ""
		},
		{ 	"code":"012", 
			"when": "Fine mano",
			"cli-srv": "CLI",
			"name": "Il mazzo d'oro",
			"meaning": "Prendi almeno 35 carte",
			"symbol": ""
		},
		{ 	"code":"013", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "L'esordiente",
			"meaning": "Vinci 30 partite",
			"symbol": "bambino con ciuccio",
			"formula" : "chObj.user.gamesdet.scopa.won >= 30"
		},
		{ 	"code":"014", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il praticante",
			"meaning": "Vinci 50 partite",
			"symbol": "bambino con fiocco del grembiule",
			"formula" : "chObj.user.gamesdet.scopa.won >= 50"
		 },
		{	"code":"015", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "L'esperto",
			"meaning": "Vinci 100 partite",
			"symbol": "",
			"formula" : "chObj.user.gamesdet.scopa.won >= 100"
		},
		{	"code":"016", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il maestro",
			"meaning": "Vinci 300 partite",
			"symbol": "",
			"formula" : "chObj.user.gamesdet.scopa.won >= 300"
		},
	 	{	"code":"017",
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il professionista",
			"meaning": "Vinci 500 partite",
			"symbol": "",
			"formula" : "chObj.user.gamesdet.scopa.won >= 500"
		},
		{	"code":"018", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il guru della scopa",
			"meaning": "Vinci 1000 partite",
			"symbol": "",
			"formula" : "chObj.user.gamesdet.scopa.won >= 1000"
		},
		{	"code":"019", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "L'osso duro",
			"meaning": "Vinci 5 partite di seguito",
			"symbol": "osso",
			"formula" : "chObj.user.gamesdet.scopa.strwon >= 5"
		},
		{	"code":"020", 
			"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il temibile",
			"meaning": "Vinci 10 partite di seguito",
			"symbol": "faccia con occhi minacciosi",
			"formula" : "chObj.user.gamesdet.scopa.strwon >= 10"
		},
		{	"code":"021", 
		 	"when":"savescore",
			"cli-srv": "SRV",
			"name": "L'asso della scopa",
			"meaning": "Vinci 20 partite di seguito",
			"symbol": "asso",
			"formula" : "chObj.user.gamesdet.scopa.strwon >= 20"
		},
		{	"code":"022", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "L'imbattibile",
			"meaning": "Vinci 50 partite di seguito",
			"symbol": "braccio muscoloso",
			"formula" : "chObj.user.gamesdet.scopa.strwon >= 50"
		},
		{	"code":"024", 
		 	"when": "invite",
			"cli-srv": "SRV",
			"name": "Aggiungi un posto a tavola",
			"meaning": "Sfida un amico di facebook",
			"symbol": "due seduti al tavolo",
			"formula" : "chObj.user.gamesdet.scopa.sentinv.length >= 1"
		},
		{	"code":"025", 
		 	"when": "invite",
			"cli-srv": "SRV",
			"name": "Il generoso",
			"meaning": "Invita a giocare 20 amici di facebook",
			"symbol": "",
			"formula" : "chObj.user.gamesdet.scopa.sentinv.length >= 20"
		},
		{	"code":"026", 
		 	"when": "ldbrds",
			"cli-srv": "SRV",
			"name": "L'uomo da battere",
			"meaning": "Rimani per 7 giorni consecutivi tra i primi 10 della classifica multiplayer",
			"symbol": "",
			"formula" : "if(chObj.user.gamesdet.scopa.tp10row) {chObj.user.gamesdet.scopa.tp10row.MULTIPLAYER >= 7}"
		},
		{	"code":"027", 
		 	"when": "ldbrds",
			"cli-srv": "SRV",
			"name": "Il primo della classe",
			"meaning": "Rimani per 7 giorni consecutivi tra i primi 10 della classifica singleplayer principianti",
			"symbol": "bambino con grembiule",
			"formula" : "if(chObj.user.gamesdet.scopa.tp10row) {chObj.user.gamesdet.scopa.tp10row.BEGINNER >= 7}"
		},
		{	"code":"028", 
		 	"when": "ldbrds",
			"cli-srv": "SRV",
			"name": "L'astro nascente",
			"meaning": "Rimani per 7 giorni consecutivi tra i primi 10 della classifica singleplayer intermedi",
			"symbol": "stella proiettata verso l'alto",
			"formula" : "if(chObj.user.gamesdet.scopa.tp10row) {chObj.user.gamesdet.scopa.tp10row.MIDDLE >= 7}"
		},
		{	"code":"029", 
		 	"when": "ldbrds",
			"cli-srv": "SRV",
			"name": "Il grande giocatore",
			"meaning": "Rimani per 7 giorni consecutivi tra i primi 10 della classifica singleplayer esperti",
			"symbol": "",
			"formula" : "if(chObj.user.gamesdet.scopa.tp10row) {chObj.user.gamesdet.scopa.tp10row.ADVANCED >= 7}"
		},
		{	"code":"030", 
		 	"when": "ldbrds",
			"cli-srv": "SRV",
			"name": "L'eroe dei due mondi",
			"meaning": "Rimani per 7 giorni consecutivi tra i primi 10 della classifica multiplayer e in una delle classifiche singleplayer",
			"symbol": "",
			"formula" : "if(chObj.user.gamesdet.scopa.tp10row) {chObj.user.gamesdet.scopa.tp10row.MULTIPLAYER >= 7 && (chObj.user.gamesdet.scopa.tp10row.ADVANCED >= 7||chObj.user.gamesdet.scopa.tp10row.MIDDLE >= 7||chObj.user.gamesdet.scopa.tp10row.BEGINNER >= 7)}"
		},
		{	"code":"031", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Cappotto!",
			"meaning": "Vinci e lascia l'avversario a 0",
			"symbol": "cappotto",
			"formula" : "(chObj.score.scoreopp === 0 && chObj.score.won === 1 && chObj.score.score >= 11)"
		},
		{	"code":"032", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Piatto ricco",
			"meaning": "Vinci con un punteggio superiore a 15 punti",
			"symbol": "",
			"formula" : "(chObj.score.won === 1 && chObj.score.score >= 15)"
		},
		{	"code":"033", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il fenomeno",
			"meaning": "Vinci con un margine di 8 punti",
			"symbol": "S di superman",
			"formula" : "(chObj.score.won === 1 && (chObj.score.score - chObj.score.scoreopp) >= 8)"
		},
		{	"code":"034", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "uno per tutti",
			"meaning": "Vinci con un margine di 1 solo punto",
			"symbol": "",
			"formula" : "(chObj.score.won === 1 && (chObj.score.score - chObj.score.scoreopp) === 1)"
		},
		{	"code":"035", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Batti il gigante",
			"meaning": "Vinci contro uno dei primi 10 in classifica",
			"symbol": "",
			"formula" : "if (chObj.opp) {(chObj.score.won === 1 && chObj.opp[chObj.score.ldbrd]['rank'] <= 10)} else {false}"
		},
		{	"code":"036", 
		 	"when": "Fine partita",
			"cli-srv": "CLI",
			"name": "Il collezionista",
			"meaning": "Prendi il settebello in tutte le mani",
			"symbol": "settebello o settebello in cornice"
		},
		{	"code":"037", 
		 	"when": "Fine partita",
			"cli-srv": "CLI",
			"name": "",
			"meaning": "Fai almeno 2 scope per ogni mano",
			"symbol": ""
		},
		{	"code":"038", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il timido",
			"meaning": "Gioca con 20 persone diverse",
			"symbol": "faccia con i rossi sulle guance",
			"formula" : "if (chObj.user.gamesdet.scopa.opps) {chObj.user.gamesdet.scopa.opps.length >= 20}"
		},
		{	"code":"039", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il simpatico",
			"meaning": "Gioca con 50 persone diverse",
			"symbol": "faccia che ride",
			"formula" : "if (chObj.user.gamesdet.scopa.opps) {chObj.user.gamesdet.scopa.opps.length >= 50}"
		},
		{	"code":"040", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il compagnone",
			"meaning": "Gioca con 100 persone diverse",
			"symbol": "",
			"formula" : "if (chObj.user.gamesdet.scopa.opps) {chObj.user.gamesdet.scopa.opps.length >= 100}"
		},
		{	"code":"041", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "L'espansivo",
			"meaning": "Gioca con 500 persone diverse",
			"symbol": "due mani che si stringono",
			"formula" : "if (chObj.user.gamesdet.scopa.opps) {chObj.user.gamesdet.scopa.opps.length >= 500}"
		},
		{	"code":"042", 
		 	"when": "savescore",
			"cli-srv": "SRV",
			"name": "Il leader",
			"meaning": "Gioca con 1000 persone diverse",
			"symbol": "faccia sopra a molta facce più piccole",
			"formula" : "if (chObj.user.gamesdet.scopa.opps) {chObj.user.gamesdet.scopa.opps.length >= 1000}"
		}
	]
}