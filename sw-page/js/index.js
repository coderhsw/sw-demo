/* if ('serviceWorker' in window.navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js', { scope: '/' })
			.then(registration => {
				// 注册成功
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			})
			.catch(err => {
				// 注册失败
				console.log('ServiceWorker registration failed: ', err);
			});
	});
} */

const btn = document.querySelector('.btn');

const xhr = new XMLHttpRequest();

xhr.open('GET', 'http://localhost:3000/getImage?name=codeLight.jpg');
xhr.responseType = 'blob';

xhr.send();

xhr.onload = () => {
	const blob = new Blob([xhr.response], { type: 'image/jpeg' });
	const imgUrl = URL.createObjectURL(blob);

	console.log(xhr);
	genImage(imgUrl);
};

btn.addEventListener('click', () => {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';

	xhr.open('GET', 'http://localhost:3000/getImage?name=codeDark.jpg');

	xhr.send();

	xhr.onload = () => {
		const blob = new Blob([xhr.response], { type: 'image/jpeg' });
		const imgUrl = URL.createObjectURL(blob);

		genImage(imgUrl);
	};
});

function genImage(imgUrl) {
	const img = new Image();

	img.src = imgUrl;

	img.onload = function() {
		insertAfter(btn, img);
	};
}

function insertAfter(target, value) {
	const parent = target.parentNode;
	if (parent.lastElementChild === target) {
		parent.appendChild(value);
	} else {
		const brother = target.nextSibling;
		parent.insertBefore(value, brother);
	}
}
