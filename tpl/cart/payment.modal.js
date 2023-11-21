const PaymentModal = (paymentMethods, paymentMethod) => {
	const body = document.createElement("div");
	body.classList.add("modal_payment");
	body.innerHTML = `
		<form class="modal_payment_content" id="modal_payment_form">
			<div class="modal_payment_items"></div>
		</form>
	`;

	const items = body.querySelector(".modal_payment_items");
	
	for (const key in paymentMethods) {
		const item = paymentMethods[key];

		items.innerHTML += `
			<label class="modal_payment_item">
				<div class="modal_payment_item__radio radio">
					<input type="radio" class="radio_input" name="payment" ${paymentMethod == key ? 'checked' : ''} value="${key}">
					<span class="radio_box"></span>
				</div>
				<div class="modal_payment_item__image">
					<img src="res/banks/${item.system}.svg" alt="" />
				</div>
				<div class="modal_payment_item__value">
					<div class="modal_payment_item__address">${item.number}</div>
				</div>
			</label>
		`;
	}

	return body;
}

export default PaymentModal;
