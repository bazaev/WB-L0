const toFixedLocale = value => Number(value.toFixed()).toLocaleString("ru-RU");

export { toFixedLocale }