const app = () => {
	const BOARD = Array.from(document.querySelectorAll('.boardRows')).map(row =>
		Array.from(row.children)
	); // matrix of squares
	const SQUARES = Array.from(document.querySelectorAll('.boardSquares')); // array of squares
	const ANNOUNCER = document.querySelector('#announcer'); // text telling which mark is playing and the game outcome
	const MARKS = ['X', 'O']; // playable marks

	let playingMark, gamemode;

	// start new game
	const startNewGame = () => {
		// remove class and content from all squares and make them markable
		SQUARES.forEach(square => {
			square.classList.remove(square.classList.contains('Xdom') ? 'Xdom' : 'Odom');
			square.textContent = '';
			square.onclick = () => markSquare(square);
		});

		// defining the first player's mark and game mode
		playingMark = MARKS[Math.floor(Math.random() * 2)];
		gamemode = Object.values(
			document.querySelector('input[type="radio"][name="gamemode"]:checked')
		).value;

		// tell which mark is playing
		ANNOUNCER.textContent = `${playingMark} turn!`;
	};

	// mark a selected square with the playing mark and verify endgame
	const markSquare = square => {
		// verify if the selected square was already chosen
		if (square.classList.contains('Xdom') || square.classList.contains('Odom')) {
			ANNOUNCER.textContent = 'Square already marked!';
			return;
		}

		// mark the square
		square.textContent = playingMark;
		square.classList.add(playingMark === 'X' ? 'Xdom' : 'Odom');

		// verify if game ended; if not, the playing mark changes
		if (!verifyGameOutcome()) {
			playingMark = playingMark === 'X' ? 'O' : 'X';

			// tell which mark is playing
			ANNOUNCER.textContent = `${playingMark} turn!`;
		}
	};

	// verify for an outcome and end game properly according to it
	const verifyGameOutcome = () => {
		// all valid win/lose outcomes
		const ENDGAME_COMBINATIONS = [
			[[0, 0], [1, 1], [2, 2]],
			[[0, 2], [1, 1], [2, 0]],
			[[0, 0], [0, 1], [0, 2]],
			[[1, 0], [1, 1], [1, 2]],
			[[2, 0], [2, 1], [2, 2]],
			[[0, 0], [1, 0], [2, 0]],
			[[0, 1], [1, 1], [2, 1]],
			[[0, 2], [1, 2], [2, 2]],
		];

		// end the game
		const endCurrentGame = isTie => {
			SQUARES.forEach(square => {
				square.onclick = null;
				ANNOUNCER.textContent = isTie ? 'Tie!' : `${playingMark} wins!`;
			});
		};

		// verify tie and end game
		if (
			SQUARES.every(
				square => square.classList.contains('Xdom') || square.classList.contains('Odom')
			)
		) {
			endCurrentGame(true);
			return true; // game over
		}

		// verify win/lose and end game
		for (const combination of ENDGAME_COMBINATIONS) {
			if (
				[
					BOARD[combination[0][0]][combination[0][1]],
					BOARD[combination[1][0]][combination[1][1]],
					BOARD[combination[2][0]][combination[2][1]],
				].every(square => square.classList.contains(`${playingMark}dom`))
			) {
				endCurrentGame(false);
				return true; // game over
			}
		}

		return false;
	};

	document.querySelector('#resetButton').addEventListener('click', startNewGame);
	startNewGame();
};

document.addEventListener('DOMContentLoaded', app);
