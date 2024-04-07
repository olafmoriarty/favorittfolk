const getParagraphFromWikitext = (oldText : string) => {
	let text = oldText;
	text = text.replace(/\[\[(?!File?:)[^\|\]]+?\|([^\[\]]+?)\]\]/g, '$1');
	text = text.replace(/\[\[(?!File?:)([^\[\]]+?)\]\]/g, '$1');
	text = text.replace(/\[\[File?\:[^\[\]]+\]\]/g, '');
	text = text.replace(/\[\[[^\]\|]+\|(.+?)\]\]/g, '$1');
	text = text.replace(/\[\[(.+?)\]\]/g, '$1');
	text = text.replace(/\{\{Fk\|([^\{\}]+?)\}\}/g, '$1');
	text = text.replace(/\{\{[^\{\}]+?\}\}/g, '').replace(/\{\{[^\{\}]+?\}\}/g, '').replace(/\{\{[^\{\}]+?\}\}/g, '').replace(/\{\{[^\{\}]+?\}\}/g, '').replace(/\{\{[^\{\}]+?\}\}/g, '');
	text = text.replace(/\'\'\'?/g, '');
	text = text.replace(/\<ref[^\>]*\>[^\<]+?\<\/ref\>/g, '');
	text = text.replace(/\<ref[^\>]+\/\>/g, '');
	text = text.replace(/\<[^\>]+\>/g, '');
	text = text.replace(/^\:.*$/gm, '');
	text = text.replace(/&ndash;/g, '–');
	text = text.replace(/&nbsp;/g, ' ');
	text = text.replace(/(.)\n(?!\n|=)/g, '$1 ');
	text = text.replace(/__NOTOC__/g, '');
	text = text.trim();
	text = text.split("\n")[0];
	return text;
}

export default getParagraphFromWikitext;