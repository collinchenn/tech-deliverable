
function Quote({ name, message, time }) {
	return (
		<div className="quote">
			<p className="quote-message">"{message}"</p>
			<p className="quote-name">— {name}</p>
			<p className="quote-time">{new Date(time).toLocaleString()}</p>
		</div>
	);
}

export default Quote;