const Modal = ({ title = "", callBack, body } = {}) => {
	const modal = document.getElementById("modal");

	const node = document.createElement('div');
	node.classList.add("modal");

	node.innerHTML = `
		<div class="modal__cover"></div>
		<div class="modal__box">
			<div class="modal_header">
				<h3 class="modal_header__title">${title}</h3>
				<div class="modal_header__close ico-cross"></div>
			</div>
			<div class="modal_body"></div>
			<div class="modal_footer">
				<button class="modal_footer__submit button">Выбрать</button>
			</div>
		</div>
	`;

	const cover = node.querySelector(".modal__cover");
	const closeButton = node.querySelector(".modal_header__close");
	const modalBody = node.querySelector(".modal_body");
	const submitButton = node.querySelector(".modal_footer__submit");

	const close = () => modal.removeChild(node);

	const submitButtonHandler = () => callBack({ close });

	cover.addEventListener("click", close);
	closeButton.addEventListener("click", close);
	submitButton.addEventListener("click", submitButtonHandler);
	
	modalBody.appendChild(body);
	modal.appendChild(node);
}

export default Modal;