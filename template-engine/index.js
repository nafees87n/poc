import Handlebars from "handlebars";
const template = Handlebars.compile("Name: {{[name.a]}}");
console.log(
	template(
		{ "name.a": "Nil" },
		{
			"name.b": "Nils",
		}
	)
);
