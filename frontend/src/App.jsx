import { useEffect, useState } from "react";
import Quote from "./components/Quote";
import QuoteFilter from "./components/QuoteFilter";
import logo from "./assets/quotebook.png";
import "./App.css";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [sortOrder, setSortOrder] = useState("desc");
	const sortedQuotes = [...quotes].sort((a, b) => {
		const aTime = new Date(a.time).getTime();
		const bTime = new Date(b.time).getTime();
		return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
	});

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

			<QuoteFilter maxAge={maxAge} onChange={setMaxAge} />
			
			<label htmlFor="sort-order-select" style={{ marginLeft: "0.75rem" }}>
				Sort by:
			</label>
			<select
				id="sort-order-select"
				value={sortOrder}
				onChange={(e) => setSortOrder(e.target.value)}
			>
				<option value="desc">Latest</option>
				<option value="asc">Earliest</option>
			</select>

			<div className="messages">
				{sortedQuotes.length === 0 ? (
					<p>There are no quotes yet</p>
				) : (
					sortedQuotes.map((quote, index) => (
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