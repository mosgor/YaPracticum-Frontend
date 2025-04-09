import { useRef } from 'react'; // Импортируем хук useRef для создания ссылки на DOM-элемент
import type { MouseEventHandler } from 'react'; // Импортируем тип для обработчиков событий мыши
import clsx from 'clsx'; // Импортируем библиотеку clsx для динамического применения классов
import { OptionType } from 'src/constants/articleProps'; // Импортируем тип OptionType для опций
import { Text } from 'components/text'; // Импортируем компонент для отображения текста
import { isFontFamilyClass } from './helpers/isFontFamilyClass'; // Импортируем вспомогательную функцию для проверки класса шрифта
import { useEnterOptionSubmit } from './hooks/useEnterOptionSubmit'; // Импортируем кастомный хук для обработки нажатия клавиши Enter

import styles from './Select.module.scss'; // Импортируем стили для компонента Select

// Тип для пропсов компонента Option
type OptionProps = {
	option: OptionType; // Опция, содержащая значение, название и другие параметры
	onClick: (value: OptionType['value']) => void; // Функция, которая вызывается при клике на опцию
};

// Компонент для отображения отдельной опции в выпадающем списке
export const Option = (props: OptionProps) => {
	// Деструктурируем пропсы
	const {
		option: { value, title, optionClassName, className }, // Извлекаем данные опции
		onClick, // Функция для обработки клика
	} = props;

	// Ссылка на элемент списка для использования в хук `useEnterOptionSubmit`
	const optionRef = useRef<HTMLLIElement>(null);

	// Обработчик клика на опцию
	const handleClick =
		(clickedValue: OptionType['value']): MouseEventHandler<HTMLLIElement> =>
		() => {
			onClick(clickedValue); // Вызываем onClick с переданным значением опции
		};

	// Хук для обработки нажатия клавиши Enter на опции
	useEnterOptionSubmit({
		optionRef,
		value,
		onClick,
	});

	return (
		// Элемент списка для отображения опции
		<li
			className={clsx(styles.option, styles[optionClassName || ''])} // Применяем динамические классы
			value={value} // Устанавливаем значение для опции
			onClick={handleClick(value)} // Обработчик клика
			tabIndex={0} // Делаем элемент фокусируемым
			data-testid={`select-option-${value}`} // Атрибут для тестирования
			ref={optionRef}>
			{' '}
			{/* Ссылка на элемент */}
			<Text family={isFontFamilyClass(className) ? className : undefined}>
				{' '}
				{/* Применяем шрифт, если это валидный класс шрифта */}
				{title} {/* Название опции */}
			</Text>
		</li>
	);
};
