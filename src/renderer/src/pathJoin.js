const pathJoin = (parts, sep = '\\') => parts.join(sep).replace(new RegExp(sep + '{1,}', 'g'), sep);
export default pathJoin;