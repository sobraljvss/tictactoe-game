const app = () => {
	const SQUARES = Array.from(document.querySelectorAll('.boardSquares')); // array of squares
	const MARKS = ['X', 'O']; // playable marks

	// all valid win/lose outcomes
	const OUTCOMES = [
		[0, 4, 8],
		[2, 4, 6],
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
	];

	let playingMark, gamemode;

	// start new game
	const startNewGame = () => {
		// remove class and content from all squares and make them markable
		SQUARES.map(square => {
			square.classList.remove('markedSquare');
			square.textContent = '';
			square.onclick = () => markSquare(false, square);
		});

		// defining the first player's mark, game mode and who plays first (Player vs CPU only)
		playingMark = MARKS[Math.floor(Math.random() * 2)];
		gamemode = document.querySelector("input[type='radio'][name='gamemode']:checked").value;

		// choose who will play first (Player vs CPU only)
		if (gamemode === 'pvc') {
			if (Math.floor(Math.random() * 2) === 1) markSquare(true);
		}

		// tell which mark is playing
		document.querySelector('#announcer').textContent = `${playingMark} turn!`;

		// remove useless DOM
		document.querySelector('#gameLocker').style.display = 'none';
		document.querySelector('#gamemodeSelector').style.visibility = 'hidden';
		document.querySelector('#startButton').style.display = 'none';

		// load end game button
		document.querySelector('#endButton').style.display = 'block';
	};

	// choose a square (Player vs CPU only)
	const chooseSquare = () => {
		// free squares
		const POSSIBLE_MOVES = SQUARES.filter(square => !square.classList.contains('markedSquare'));

		for (const combination of OUTCOMES) {
			// the squares where the selected outcome should happen
			const appliedCombination = [
				SQUARES[combination[0]],
				SQUARES[combination[1]],
				SQUARES[combination[2]],
			];

			// verify if two squares of the outcome were already selected by the CPU and if the remaining square is free
			if (
				appliedCombination.filter(square => square.textContent === playingMark).length ===
					2 &&
				POSSIBLE_MOVES.includes(
					appliedCombination.find(square => !square.classList.contains('markedSquare'))
				)
			) {
				// if so, choose the remaining square
				return appliedCombination.find(
					square => !square.classList.contains('markedSquare')
				);
			}
		}

		// if there's no almost completed combination, just choose a random free square
		return POSSIBLE_MOVES[Math.floor(Math.random() * POSSIBLE_MOVES.length)];
	};

	// mark a selected square with the playing mark and verify endgame
	const markSquare = (isCPU = false, square = isCPU && null) => {
		// verify if the selected square was already chosen
		if (!isCPU && square.classList.contains('markedSquare')) {
			document.querySelector('#announcer').textContent = 'Square already marked!';
			return;
		}

		// play as CPU if game mode is Player vs CPU
		if (isCPU) square = chooseSquare();

		// mark the square
		square.textContent = playingMark;
		square.classList.add('markedSquare');

		// verify if game ended; if not, the playing mark changes
		const hasOutcome = verifyGameOutcome();
		if (!hasOutcome) {
			playingMark = playingMark === 'X' ? 'O' : 'X';

			// tell which mark is playing
			document.querySelector('#announcer').textContent = `${playingMark} turn!`;

			if (!isCPU && gamemode === 'pvc') markSquare(true);
		}
	};

	// end the game
	const endCurrentGame = (isTie = undefined) => {
		// unable marking and tell outcome
		SQUARES.map(square => (square.onclick = null));
		document.querySelector('#announcer').textContent =
			typeof isTie === 'undefined'
				? 'Tic Tac Toe Time!'
				: isTie
				? 'Tie!'
				: `${playingMark} wins!`;

		// reload hidden DOM
		document.querySelector('#gameLocker').style.display = 'block';
		document.querySelector('#gamemodeSelector').style.visibility = 'visible';
		document.querySelector('#startButton').style.display = 'block';

		// hide end game button
		document.querySelector('#endButton').style.display = 'none';
	};

	// verify for an outcome and end game properly according to it
	const verifyGameOutcome = () => {
		// verify win/lose and end game
		for (const combination of OUTCOMES) {
			// the squares where the selected outcome should happen
			const appliedCombination = [
				SQUARES[combination[0]],
				SQUARES[combination[1]],
				SQUARES[combination[2]],
			];

			if (appliedCombination.every(square => square.textContent === playingMark)) {
				endCurrentGame((isTie = false));
				return true; // game over
			}
		}

		// verify tie and end game
		if (SQUARES.every(square => square.classList.contains('markedSquare'))) {
			endCurrentGame((isTie = true));
			return true; // game over
		}

		return false;
	};

	// make start and end buttons usable
	document.querySelector('#startButton').addEventListener('click', startNewGame);
	document.querySelector('#endButton').addEventListener('click', () => endCurrentGame());
};

// initialize app
document.addEventListener('DOMContentLoaded', app);
