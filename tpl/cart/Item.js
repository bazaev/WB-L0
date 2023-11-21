/*

	⠄⠄⠄⠄⠄⠄⢴⡶⣶⣶⣶⡒⣶⣶⣖⠢⡄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⢠⣿⣋⣿⣿⣉⣿⣿⣯⣧⡰⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⣿⣿⣹⣿⣿⣏⣿⣿⡗⣿⣿⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠟⡛⣉⣭⣭⣭⠌⠛⡻⢿⣿⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠄⠄⣤⡌⣿⣷⣯⣭⣿⡆⣈⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠄⢻⣿⣿⣿⣿⣿⣿⣿⣷⢛⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠄⠄⢻⣷⣽⣿⣿⣿⢿⠃⣼⣧⣀⠄⠄⠄⠄⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣛⣻⣿⠟⣀⡜⣻⢿⣿⣿⣶⣤⡀⠄⠄⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠄⠄⢠⣤⣀⣨⣥⣾⢟⣧⣿⠸⣿⣿⣿⣿⣿⣤⡀⠄⠄⠄
	⠄⠄⠄⠄⠄⠄⠄⠄⢟⣫⣯⡻⣋⣵⣟⡼⣛⠴⣫⣭⣽⣿⣷⣭⡻⣦⡀⠄
	⠄⠄⠄⠄⠄⠄⠄⢰⣿⣿⣿⢏⣽⣿⢋⣾⡟⢺⣿⣿⣿⣿⣿⣿⣷⢹⣷⠄
	⠄⠄⠄⠄⠄⠄⠄⣿⣿⣿⢣⣿⣿⣿⢸⣿⡇⣾⣿⠏⠉⣿⣿⣿⡇⣿⣿⡆
	⠄⠄⠄⠄⠄⠄⠄⣿⣿⣿⢸⣿⣿⣿⠸⣿⡇⣿⣿⡆⣼⣿⣿⣿⡇⣿⣿⡇
	⠄⠄⠄⠄⠄⠄⠄⠘⣿⣿⡘⣿⣿⣷⢀⣿⣷⣿⣿⡿⠿⢿⣿⣿⡇⣩⣿⡇
	⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣷⠙⠛⠋⣿⣿⣿⣿⣿⣷⣶⣿⣿⣿⡇⣿⣿⡇

*/
import { toFixedLocale } from "../../js/utils.js";

const Item = ({ cover, name, properties, point, shop, count, remaining, discount, discountFullPrice, fullPrice }, isAbsent) => {

	let largePriceClass = '',
		discountFullPriceLocale,
		fullPriceLocale;

	let checkboxItem = '',
		discountItems = '',
		propertiesItem = '',
		pointItem = '',
		counterItem = '',
		remainingItem = '',
		priceItem = '';
	
	const discountTypeText = {
		shop: "Скидка",
		user: "Скидка покупателя"
	}

	const propertiesSize = properties?.size || "";

	if (!isAbsent) {
		discountFullPriceLocale = toFixedLocale(discountFullPrice);
		fullPriceLocale = toFixedLocale(fullPrice);

		if (discountFullPrice.toString().length > 5) {
			largePriceClass = ' item_price_large';
		}

		checkboxItem = `
			<div class="item_checkbox">
				<div class="checkbox">
					<input type="checkbox" class="checkbox_input" checked="true">
					<span class="checkbox_box"></span>
				</div>
			</div>
		`;

		pointItem = `
			<div class="item_point">${point}</div>
			<div class="item_shop">
				<div class="item_shop_name">${shop}</div>
				<div class="item_shop_info ico-info popup">
					<div class="item_shop_info__popup popup_content">
						<div class="item_shop_info__title">
							OOO «МЕГАПРОФСТИЛЬ»
						</div>
						<div class="item_shop_info__text">
							ОГРН: 5167746237148
						</div>
						<div class="item_shop_info__text">
							129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34
						</div>
					</div>
				</div>
			</div>
		`;

		counterItem = `
			<div class="item_count">
				<button class="item_count_button"${remaining !== null && (count < 2) ? ' disabled' : ''}>−</button>
				<span class="item_count_value">${count}</span>
				<button class="item_count_button"${remaining !== null && remaining < 1 ? ' disabled' : ''}>+</button>
			</div>
		`;

		if (remaining !== null) {
			remainingItem = `<div class="item_remaining">Осталось <span class="item_remaining__count">${remaining}</span> шт.</div>`;
		}
		
		discountItems = Object.entries(discount).map(([key, value]) => {
			const title = discountTypeText[key];
			const discount = value.toFixed();
			const discountDifference = toFixedLocale(fullPrice / 100 * value);

			return `
				<div class="item_price_full_popup__item" data-property="${key}">
					<div class="item_price_full_popup__title">${title} ${discount}%</div>
					<div class="item_price_full_popup__text">-<span>${discountDifference}</span> сом</div>
				</div>
			`;
		}).join('');

		priceItem = `
			<div class="item_price_discount${largePriceClass}">
				<span class="item_price_discount__price">${discountFullPriceLocale}</span> <span class="item_price_currency">сом</span>
			</div>
			<div class="item_price_full popup"><span class="item_price_full__price">${fullPriceLocale}</span> сом
				<div class="popup_content item_price_full_popup">
					<div class="item_price_full_popup__items">
						${discountItems}
					</div>
				</div>
			</div>
		`;
	}

	if (properties) {
		propertiesItem = `
			<div class="item_properties">
				${properties.color ? `<div class="item_property" data-property="color">Цвет: ${properties.color}</div>` : ''}
				${properties.size ? `<div class="item_property" data-property="size">Размер: ${properties.size}</div>` : ''}
			</div>
		`;
	}

	const item = document.createElement('div');
	item.classList.add('item');

	item.innerHTML = `
		<label class="item_cover">
			${checkboxItem}
			<img src="/res/img/${cover}" class="item_img" alt="">
			<div class="item_cover__size">${propertiesSize}</div>
		</label>
		<div class="item_info">
			<div class="item_title">${name}</div>
			${propertiesItem}
			${pointItem}
		</div>
		<div class="item_actions">
			${counterItem}
			${remainingItem}
			<div class="item_buttons">
				<button class="item_favorites ico-favorites"></button>
				<button class="item_remove ico-remove"></button>
			</div>
		</div>
		<div class="item_price">
			${priceItem}
		</div>
	`;
	
	return item;
}

export default Item;