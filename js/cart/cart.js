import CartUI from "./cart.UI.js";
import Item from "/tpl/cart/Item.js";
import { getCart } from "../API.js";
import { toFixedLocale } from "../utils.js";

class Cart extends CartUI {

	data;
	elements;
	items = [];
	itemsAbsent = [];
	checkedItems = [];
	favorites = [];
	totalAcc = {
		price: 0,
		discountPrice: 0,
		count: 0
	}

	constructor() {
		super();
		this.init();
	}

	async init() {
		this.data = await getCart();
		this.elements = this.getElements();
		this.events();
		this.itemsRender();
	}

	itemsRender() {
		const {
			cart: {
				items,
				itemsAbsent
			},
			absent: {
				count: absentCount
			}
		} = this.elements;

		let count = 0,
			countAbsent = 0;

		this.checkedItems = [];
		
		itemsAbsent.innerHTML = "";
		items.innerHTML = "";

		for (const item of this.data.items) {
			let element;
			if (item.absent) {
				element = itemsAbsent.appendChild(Item(item, true));
				this.itemsAbsent.push(element);
				countAbsent++;
			}else{
				item.discountFull = Object.values(item.discount).reduce((acc, discount) => acc + discount);
				this.updateItemPrice(item, element);
				element = items.appendChild(Item(item));
				this.checkedItems.push(item.id);
				this.items.push(element);
				count++;
			}
			this.setItemEvents(element, item);
		}

		absentCount.innerText = countAbsent;

		this.updateCartCount();
		this.updateTotal();
	}

	updateItemPrice(data, element) {
		const discount = data.discount;
		data.fullPrice = data.price * data.count;
		data.discountPrice = data.price - (data.price / 100 * data.discountFull);
		data.discountFullPrice = data.discountPrice * data.count;

		if (element) {
			const popupSelector = name => `.item_price_full__popup [data-property="${name}"] .item_price_full__text span`;

			const getDiscountDifference = value => toFixedLocale(data.fullPrice / 100 * value);
			
			const [
				priceDiscount,
				priceFull
			] = element.querySelectorAll(".item_price_discount__price, .item_price_full__price");
			
			const popupDiscountShop = element.querySelector(popupSelector("shop"));
			const popupDiscountUser = element.querySelector(popupSelector("user"));

			if (discount.shop && popupDiscountShop) {
				popupDiscountShop.innerText = getDiscountDifference(discount.shop)
			}

			if (discount.user && popupDiscountUser) {
				popupDiscountUser.innerText = getDiscountDifference(discount.user)
			}

			priceDiscount.innerText = toFixedLocale(data.discountPrice * data.count);
			priceFull.innerText = toFixedLocale(data.fullPrice * data.count);
			this.updateTotal();
		}

		return data;
	}
}


export default Cart;