function QuoteFilter({ maxAge, onChange }) {
	return (
		<div className="filter">
			<label htmlFor="max-age-select">Show quotes from: </label>
			<select
				id="max-age-select"
				value={maxAge}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="7">Last week</option>
				<option value="30">Last month</option>
				<option value="365">Last year</option>
				<option value="all">All time</option>
			</select>
		</div>
	);
}

export default QuoteFilter;
