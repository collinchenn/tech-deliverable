import { useState } from "react";

function Quote({ name, message, time }) {
	const [expanded, setExpanded] = useState(false);

	const words = message.trim().split(/\s+/);
	const isLong = words.length > 50;

	const previewText = isLong ? words.slice(0, 50).join(" ") : message;

	const displayText =
		!isLong || expanded ? message : `${previewText}...`;

	return (
		<div className="quote">
			<p className="quote-message">"{displayText}"</p>

			{isLong && (
				<button
					type="button"
					className="quote-toggle"
					onClick={() => setExpanded((prev) => !prev)}
				>
					{expanded ? "Show less" : "Show more"}
				</button>
			)}

			<p className="quote-name">- {name}</p>
			<p className="quote-time">
                Posted on {new Date(time).toLocaleString()}
			</p>
		</div>
	);
}

export default Quote;
