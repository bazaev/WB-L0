const DeliveryModal = (deliveryMethods, deliveryMethod) => {
	const sectionTitle = {
		"pickup": "В пункт выдачи",
		"delivery": "Курьером"
	}

	let active;

	const [activeMethod, activeItem] = deliveryMethod;
	
	const body = document.createElement("div");
	body.classList.add("modal_delivery");
	body.innerHTML = `
		<div class="modal_delivery_sections"></div>
		<div class="modal_delivery_title">Мои адреса</div>
		<form class="modal_delivery_content" id="modal_delivery_form"></form>
	`;

	const sections = body.querySelector(".modal_delivery_sections");
	const content = body.querySelector(".modal_delivery_content");

	for (const method in deliveryMethods) {
		const deliveryItems = document.createElement("div");
		deliveryItems.classList.add("modal_delivery_items");

		const isActive = activeMethod === method;

		const items = deliveryMethods[method];

		for (const key in items) {
			const item = items[key];
			let subValue = "";

			const deliveryItem = document.createElement("div");
			deliveryItem.classList.add("modal_delivery_item");

			if (item.rating !== undefined) {
				subValue = `
					<div class="modal_delivery_item__subvalue">
						<div class="modal_delivery_item__star ico-star"></div>
						<div class="modal_delivery_item__rating">${item.rating}</div>
						<span class="modal_delivery_item__type">пункт выдачи</span>
					</div>
				`;
			}

			deliveryItem.innerHTML = `
				<label class="modal_delivery_item__radio radio">
					<input type="radio" id="modal-${method}-${key}" class="radio_input" name="delivery" ${activeMethod === method && activeItem == key ? 'checked' : ''} value="${method}-${key}">
					<span class="radio_box"></span>
				</label>
				<label class="modal_delivery_item__value" for="modal-${method}-${key}">
					<div class="modal_delivery_item__address">${item.address}</div>
					${subValue}
				</label>
				<div class="modal_delivery_item__remove ico-remove"></div>
			`;

			const removeButton = deliveryItem.querySelector(".modal_delivery_item__remove");
			
			const removeButtonHandler = ({ target }) => {
				delete deliveryMethods[method][key];
				target.closest(".modal_delivery_item").remove();
			}
			removeButton.addEventListener("click", removeButtonHandler);

			deliveryItems.appendChild(deliveryItem);
		}

		const sectionButton = document.createElement("span");
		sectionButton.classList.add("modal_delivery_sections__button");
		sectionButton.innerHTML = sectionTitle[method];

		const buttonClickHandler = () => {
			if (active?.sectionButton !== sectionButton) {
				active?.sectionButton.classList.remove("active");
				active?.deliveryItems.classList.remove("active");

				sectionButton.classList.add("active");
				deliveryItems.classList.add("active");
				
				active = { sectionButton, deliveryItems };
			}
		}


		sectionButton.addEventListener("click", buttonClickHandler);

		sections.appendChild(sectionButton);

		if (isActive) {
			buttonClickHandler()
		}

		content.appendChild(deliveryItems);

	}

	return body;

}

export default DeliveryModal;