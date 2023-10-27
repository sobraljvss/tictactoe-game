document.addEventListener('DOMContentLoaded', () => app());

const app = () => {
	const MARKS = ['X', 'O'];
	const selectedMark = MARKS[Math.floor(Math.random() * 2)];

	const markSquare = (mark, square) => {
		if (square.className !== 'occupiedSquares') {
			square.textContent = mark;
			square.className = 'occupiedSquares';
		} else {
			throw Error('Space already occupied');
		}
	};

	const ROWS = Array.from(document.querySelectorAll('tr')).map(row => Array.from(row.children)); // matrix of board squares
	ROWS.forEach(row =>
		row.map(square => square.addEventListener('click', e => markSquare(selectedMark, e.target)))
	); // set mark event for clicked square
};
