import { useEffect, useState } from "react";
import Quote from "./components/Quote";
import logo from "./assets/quotebook.png";
import "./App.css";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");

	const handleSubmit = async (event) => {
		event.preventDefault();

		const form = event.target;
		const formData = new FormData(form);

		try {
			const res = await fetch("/api/quote", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				console.error("ERROR: problem submitting quote:", res.status);
				return;
			}

			const newQuote = await res.json();
			setQuotes((prevQuotes) => [...prevQuotes, newQuote]);

			form.reset();
		} catch (error) {
			console.error("ERROR: problem submitting quote:", error);
		}
	};

	useEffect(() => {
		const controller = new AbortController();

		async function fetchQuotes() {
			try {
				const url =
					maxAge === "all"
						? "/api/quotes"
						: `/api/quotes?max_age_days=${maxAge}`;

				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) {
					console.error("ERROR: failed to fetch quotes:", res.status);
					return;
				}

				const data = await res.json();
				setQuotes(data);
			} catch (err) {
				console.error("ERROR: failed to fetch quotes:", err);
			}
		}

		fetchQuotes();

		return () => controller.abort();
	}, [maxAge]);

	return (
		<div className="App">
			<img src={logo} alt="Quote book logo" className="logo" />
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>

			<div className="filter">
				<label htmlFor="max-age-select">Show quotes from: </label>
				<select
					id="max-age-select"
					value={maxAge}
					onChange={(e) => setMaxAge(e.target.value)}
				>
					<option value="7">Last week</option>
					<option value="30">Last month</option>
					<option value="365">Last year</option>
					<option value="all">All time</option>
				</select>
			</div>

			<div className="messages">
				{quotes.length === 0 ? (
					<p>There are no quotes yet</p>
				) : (
					quotes.map((quote, index) => (
						<Quote
							key={index}
							name={quote.name}
							message={quote.message}
							time={quote.time}
						/>
					))
				)}
			</div>
		</div>
	);
}

export default App;