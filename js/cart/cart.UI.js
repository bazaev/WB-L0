import Modal from "../modal.js";
import DeliveryModal from "../../tpl/cart/delivery.modal.js";
import PaymentModal from "../../tpl/cart/payment.modal.js";
import { toFixedLocale } from "../utils.js";

class CartUI {

	total = {
		price: 0,
		fullPrice: 0,
		discount: 0,
		count: 0
	}

	#phoneMask = /^\+?(\d{1})(\d{0,3})(\d{0,3})?(\d{1,2})?(\d{1,2})?/;
	
	#emailRegExp = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/;

	constructor() {

	}
	
	getElements() {
		const el = selector => document.querySelector(selector);
		return {
			sections: {
				profile: el("#sections_profile"),
				cart: el("#sections_cart"),
			},
			cart: {
				allCheckbox: el("#cart_all"),
				items: el("#cart_items"),
				itemsAbsent: el("#cart_items_absent"),
				itemsCount: el("#cart_items_count"),
				itemsPrice: el("#cart_items_price")
			},
			hide: {
				itemsButton: el("#hide_items_button"),
				itemsAbsentButton: el("#hide_items_absent_button"),
			},
			absent: {
				count: el("#absent_count"),
			},
			delivery: {
				methodButton: el("#delivery_method_button"),
				methodAddress: el("#delivery_method_address"),
				methodRating: el("#delivery_method_rating"),
			},
			payment: {
				methodButton: el("#payment_method_button"),
				cardSystemImg: el("#payment_card_system_img"),
				cardNumber: el("#payment_card_number"),
				cardDate: el("#payment_card_date"),
			
			},
			total: {
				price: el("#total_price"),
				fullPrice: el("#total_full_price"),
				discount: el("#total_discount"),
				count: el("#total_count"),
				deliveryMethodButton: el("#total_delivery_method_button"),
				deliveryMethodAddress: el("#total_delivery_method_address"),
				paymentMethodButton: el("#total_payment_method_button"),
				paymentCardSystemImg: el("#total_payment_card_system_img"),
				paymentCardNumber: el("#total_payment_card_number"),
				prepaymentCheckbox: el("#total_prepayment_checkbox"),
				orderButton: el("#total_order_button"),
			
			},
			recipientInput: {
				name: el("#cart .widget.recipient .recipient_input input[name='name']"),
				surname: el("#cart .widget.recipient .recipient_input input[name='surname']"),
				email: el("#cart .widget.recipient .recipient_input input[name='email']"),
				phone: el("#cart .widget.recipient .recipient_input input[name='phone']"),
				inn: el("#cart .widget.recipient .recipient_input input[name='inn']")
			},
			mobile: {
				navCart: el("#mobile_nav_cart"),
				navFavorites: el("#mobile_nav_favorites")
			},
		}
	}

	updateTotal() {
		const { itemsCount, itemsPrice } = this.elements.cart;
		const el = this.elements.total;
		
		this.total = this.checkedItems.reduce((acc, id) => {
			const item = this.data.items.find(item => item.id === id);

			if (item.absent) { return acc }

			return {
				count: acc.count + item.count,
				price: acc.price + item.fullPrice,
				discountPrice: acc.discountPrice + item.discountFullPrice
			}
		}, this.totalAcc);

		this.total.discount = this.total.price - this.total.discountPrice;

		const {
			count,
			price,
			discountPrice,
			discount
		} = this.total;
		
		el.price.innerText = toFixedLocale(discountPrice);
		el.fullPrice.innerText = toFixedLocale(price);
		el.discount.innerText = toFixedLocale(discount);
		el.count.innerText = count;

		itemsCount.innerText = count;
		itemsPrice.innerText = toFixedLocale(discountPrice);
	}

	setItemEvents(element, data) {
		const checkboxInput = element.querySelector(".checkbox_input");
		const [countDecrement, countIncreement] = element.querySelectorAll(".item_count .item_count_button");
		const countValue = element.querySelector(".item_count_value");
		const remainingCount = element.querySelector(".item_remaining__count");
		const [favoritesButton, removeButton] = element.querySelectorAll(".item_favorites, .item_remove");

		const updatePrice = () => this.updateItemPrice(data, element);

		const increementHandler = () => {
			data.count++;
			if (typeof data.remaining === 'number') {
				data.remaining--;
				remainingCount.innerText = data.remaining;
				if (data.remaining < 1) {
					countIncreement.disabled = "true";
				}
			}
			countDecrement.disabled = undefined;
			countValue.innerText = data.count;
			updatePrice();
		}

		const decrementHandler = () => {
			data.count--;
			if (typeof data.remaining === 'number') {
				data.remaining++;
				remainingCount.innerText = data.remaining;
			}
			if (data.count < 2) {
				countDecrement.disabled = "true";
			}
			countIncreement.disabled = undefined;
			countValue.innerText = data.count;
			updatePrice();
		}

		const checkboxInputHandler = ({ target }) => {
			if (target.checked) {
				this.checkedItems.push(data.id)
			} else {
				const index = this.checkedItems.indexOf(data.id);
				this.checkedItems.splice(index, 1);
			}
			this.updateCartAll();
			this.updateTotal();
		}

		const favoritesButtonHandler = ({ target }) => {
			const index = this.favorites.indexOf(data.id);
			if (index > -1) {
				this.favorites.splice(index, 1);
				target.classList.remove("ico-heart", "active");
				target.classList.add("ico-favorites");
			} else {
				this.favorites.push(data.id);
				target.classList.remove("ico-favorites");
				target.classList.add("ico-heart", "active");
			}
			this.updateFavoritesCount();
		}

		const removeButtonHandler = ({ target }) => {
			const index = this.data.items.findIndex(item => item.id === data.id);
			if (index > -1) {
				this.data.items.splice(index, 1);
				this.itemsRender();
				this.updateCartCount();
			}
		}

		if (countIncreement) {
			countIncreement.addEventListener("click", increementHandler);
			countDecrement.addEventListener("click", decrementHandler);
		}

		if (checkboxInput) {
			checkboxInput.addEventListener("change", checkboxInputHandler);
		}

		favoritesButton.addEventListener("click", favoritesButtonHandler);
		removeButton.addEventListener("click", removeButtonHandler);
	}

	updateCartAll() {
		const allCheckbox = this.elements.cart.allCheckbox;
		const items = this.data.items.filter(item => !item.absent);

		allCheckbox.checked = this.checkedItems.length === items.length;
	}

	updateCartCount() {
		const cart = this.elements.sections.cart;
		const navCart = this.elements.mobile.navCart;
		const count = this.data.items.filter(item => !item.absent).length || '';

		cart.dataset.count = count;
		navCart.dataset.count = count;
	}
	
	updateFavoritesCount() {
		const navFavorites = this.elements.mobile.navFavorites;
		const count = this.favorites.length || '';
		
		navFavorites.dataset.count = count;
	}

	events() {
		const {
			cart: {
				allCheckbox
			},
			hide: {
				itemsButton,
				itemsAbsentButton
			},
			total: {
				prepaymentCheckbox,
				orderButton,
				deliveryMethodButton,
				paymentMethodButton,
				paymentCardNumber,
				paymentCardSystemImg,
				deliveryMethodAddress
			},
			delivery: {
				methodButton,
				methodAddress
			},
			payment: {
				methodButton: paymentMethodBtn,
				cardNumber,
				cardSystemImg
			},
			recipientInput: inputs
		} = this.elements;

		const orderButtonText = orderButton.innerText;

		const cartAllHandler = ({ target }) => {
			const checked = target.checked;
			for (const element of this.items) {
				const checkboxInput = element.querySelector(".checkbox_input");
				if (checkboxInput.checked !== checked) {
					checkboxInput.click();
				} 
			}
		}

		const hideItemsHandler = ({ target }) => {
			const parent = target.parentNode.parentNode;
			if (!parent.classList.contains("hide")) {
				parent.classList.add("hide");
			}else{
				parent.classList.remove("hide");
			}
		}

		const prepaymentCheckboxHandler = ({ target }) => {
			if (target.checked) {
				orderButton.innerText = `Оплатить ${toFixedLocale(this.total.discountPrice)} сом`;
			} else {
				orderButton.innerText = orderButtonText;
			}
		}

		const deliveryMethodHandler = () => {

			const body = DeliveryModal(this.data.deliveryMethods, this.data.deliveryMethod);

			Modal({
				title: "Способ доставки",
				body,
				callBack: ({ close }) => {
					const form = body.querySelector("#modal_delivery_form");
					const value = form.elements.delivery.value.split('-');
					if (value) {
						this.data.deliveryMethod = value;
					}
					const method = this.data.deliveryMethods[value[0]][value[1]];

					deliveryMethodAddress.innerText = method.address;
					methodAddress.innerText = method.address;
					close();
				}
			});
		}

		const paymentMethodHandler = () => {

			const body = PaymentModal(this.data.paymentMethods, this.data.paymentMethod);

			Modal({
				title: "Способ оплаты",
				body,
				callBack: ({ close }) => {
					const form = body.querySelector("#modal_payment_form");
					const value = form.elements.payment.value;
					if (value) {
						this.data.paymentMethod = value;
					}
					const method = this.data.paymentMethods[value];

					paymentCardNumber.innerText = method.number;
					cardNumber.innerText = method.number;

					const path = cardSystemImg.getAttribute('src').split('/');
					path[path.length - 1] = `${method.system}.svg`;
					const system = path.join('/');
					cardSystemImg.src = system;
					paymentCardSystemImg.src = system;

					close();
				}
			});
		}

		const orderHandler = () => {
			let firstError;

			for (const key in inputs) {
				const input = inputs[key];
				const parent = input.parentNode;
				if (!input.value) {
					if (!firstError) {
						firstError = input;
					}
					if (!parent.classList.contains("error")) {
						parent.classList.add("error");
					}
				}else{
					if (parent.classList.contains("error")) {
						if (!firstError) {
							firstError = input;
						}
					}
				}
			}

			if (firstError && window.innerWidth < 1024) {
				firstError.scrollIntoView({ block: "center", behavior: "smooth" });
			}
		}
		
		const inputValidate = ({ target, type }) => {
			const { name, value } = target;
			const parent = target.parentNode;
			const isError = parent.classList.contains("error");
			const isCheck = parent.classList.contains("check");
			let error;
			if (value) {
				if (name === "name" || name === "surname") {
					error = false
				}else if (name === "phone") {
					const match = value.replaceAll(/[^0-9]+/g, '').match(this.#phoneMask);
					if (match) {
						const lastNumberPart = match[match.length - 1];
						const formated = match.filter((match, key) => key && match).join(' ')
						target.value = `+${formated}`;

						if (isError || type === "blur") {
							if (lastNumberPart?.length === 2) {
								error = false
							}else{
								error = true
							}
						}
					}else{
						if (isError || type === "blur") {
							error = true
						}
					}
				}else if (name === "email") {
					const test = this.#emailRegExp.test(value);
					if (test) {
						error = false
					}else{
						if (type === "blur") {
							error = true
						}
					}
				}else if (name === "inn") {
					const test = /^\d{14}$/.test(value);
					if (test) {
						error = false
					}else{
						if (type === "blur") {
							error = true
						}
					}
				}
			}else{
				error = false
			}
			
			if (error === true) {
				if (!isError) {
					parent.classList.add("error");
				} if (!isCheck) {
					parent.classList.add("check");
				}
			}else if (error === false) {
				parent.classList.remove("error","check");
			}
		}

		allCheckbox.addEventListener("change", cartAllHandler);

		itemsButton.addEventListener("click", hideItemsHandler);
		itemsAbsentButton.addEventListener("click", hideItemsHandler);

		prepaymentCheckbox.addEventListener("change", prepaymentCheckboxHandler);

		deliveryMethodButton.addEventListener("click", deliveryMethodHandler);
		methodButton.addEventListener("click", deliveryMethodHandler);

		paymentMethodButton.addEventListener("click", paymentMethodHandler);
		paymentMethodBtn.addEventListener("click", paymentMethodHandler);
		
		for (const name in inputs) {
			const input = inputs[name];
			input.addEventListener("input", inputValidate);
			input.addEventListener("blur", inputValidate);
		}

		orderButton.addEventListener("click", orderHandler);
	}

}

export default CartUI;
