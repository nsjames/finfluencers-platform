
import Identicon from 'identicon.js';
import {sha256} from '@finfluencers/shared/utils/crypto.util'

export default (text, size = 150) => {
	return new Identicon(sha256(text).slice(0,24), {
		background: [255, 255, 255, 0],
		foreground: [0, 0, 0, 50],
		margin: 0,
		size,
	}).toString();
};
