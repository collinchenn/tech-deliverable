function SortingFilter({ sortOrder, onChange }) {
	return (
		<div className="sort-control">
			<label htmlFor="sort-order-select">Sort:</label>
			<select
				id="sort-order-select"
				value={sortOrder}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="desc">Latest</option>
				<option value="asc">Earliest</option>
			</select>
		</div>
	);
}

export default SortingFilter;