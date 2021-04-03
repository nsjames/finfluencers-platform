module.exports = {
	historicalPriceQuery:(content, startingDate, endingDate) =>
		`SELECT * FROM BUCKET_NAME WHERE doc_type = 'tokenprice' AND id = '${content.data.asset.id}' AND date > ${startingDate} AND date < ${endingDate}`
}
