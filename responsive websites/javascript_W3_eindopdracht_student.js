
const btn    = document.getElementById("btn");
const mobile = document.getElementById("mobile");
const type   = document.getElementById("type");
const result = document.getElementById("result");

btn.addEventListener("click", () => 
{
	const mobileValue = Number(mobile.value);
	const typeValue   = type.value;

	// simpele validatie
	if (!mobileValue || !typeValue) 
	{
		result.className = "alert alert-danger mt-3";
		result.textContent = "Vul alles in.";
		result.classList.remove("d-none");
		return;
	}

	let message = "";
	let alertClass = "alert mt-3 ";

	// >>> HIER KOMT JULLIE LOGICA <<<
	// gebruik if / else if / else
	// en minstens één keer &&

});