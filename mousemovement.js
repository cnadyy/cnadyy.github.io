// store in global scope because dom access is expensive
var c_offset_x = 0;
var c_offset_y = 0;

const enable_movement_query = window.matchMedia('(prefers-reduced-motion: reduce)');
var disable_movement = enable_movement_query.matches;

const html_elem = document.querySelector("html");

function move_bg_to_offset(offset_x, offset_y) {
	const scale = -0.01;
	const significant_distance = 3;

	const limit = 15;
	const limit_min = -limit;

	// this performs a basic clamp on the value, make sure we're not getting too ahead of ourselves
	s_x = Math.min(Math.max(Math.floor(offset_x * scale), limit_min), limit);
	s_y = Math.min(Math.max(Math.floor(offset_y * scale), limit_min), limit);

	if (Math.abs(s_x - c_offset_x) > significant_distance || Math.abs(s_y - c_offset_y) > significant_distance) {
		const time_ms = 250;
		const final_ms = 0;

		html_elem.style.setProperty("--transition-speed", `${time_ms / 1000}s`);

		setTimeout(() => {
			html_elem.style.setProperty("--transition-speed", `${final_ms / 1000}s`);
		}, time_ms);
	}

	html_elem.style.setProperty("--offset-x", s_x + "px");
	html_elem.style.setProperty("--offset-y", s_y + "px");

	c_offset_x = s_x;
	c_offset_y = s_y;
}

html_elem.addEventListener("mousemove", (e) => {
	if (!disable_movement)
		move_bg_to_offset(e.pageX, e.pageY);
});

window.addEventListener('deviceorientation', (e) => {
	const scalar = 15;
	if (!disable_movement)
		move_bg_to_offset(e.gamma * scalar, e.beta * scalar);
});

enable_movement_query.addEventListener('change', () => {
	disable_movement = enable_movement_query.matches;
});