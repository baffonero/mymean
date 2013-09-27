var ErrM= {};
module.exports = ErrM;


ErrM.ErrorCodes = {
	'001' : 'Password not valid',
	'002' : 'User not found',
	'003' : 'Username already in use',
	'004' : 'Incomplete Credentials',
	'005' : 'db error',
	'006' : 'La Mail appartiene a un account Facebook',
	'007' : 'Incomplete Params',
	'008' : 'Redis Saving Error',
	'009' : 'Error sending mail:',
	'010' : 'Account Blocked',
	'011' : 'Questa mail è stata già utilizzata per giocare a uno dei giochi Digitalmoka. Torna alla pagina di login per entrare o recuperare la password.',
	'012' : "Errore nel salvataggio dell'achievement",
	'013' : "Achievement già presente",
	'014' : "Errore nel salvataggio della scelta del mazzo"
}