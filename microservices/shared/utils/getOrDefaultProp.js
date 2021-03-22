const getOrDefault = (json, prop, _default = null, _class = null) =>
	(x => _class ? new _class(x) : x)(
		json.hasOwnProperty(prop) ? json[prop] : _default
	);

module.exports = {getOrDefault};
