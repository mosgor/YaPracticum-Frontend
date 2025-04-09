import { useState, useRef } from 'react'; // Импортируем хуки useState для состояния и useRef для создания ссылок на элементы
import type { MouseEventHandler } from 'react'; // Импортируем тип для обработчиков событий мыши
import clsx from 'clsx'; // Импортируем библиотеку clsx для динамического применения классов
import { OptionType } from 'src/constants/articleProps'; // Импортируем тип OptionType для опций
import { Text } from 'components/text'; // Импортируем компонент для отображения текста
import arrowDown from 'src/images/arrow-down.svg'; // Импортируем изображение стрелочки для выпадающего списка
import { Option } from './Option'; // Импортируем компонент Option для отображения каждой опции
import { isFontFamilyClass } from './helpers/isFontFamilyClass'; // Вспомогательная функция для проверки класса шрифта
import { useEnterSubmit } from './hooks/useEnterSubmit'; // Хук для обработки нажатия клавиши Enter
import { useOutsideClickClose } from './hooks/useOutsideClickClose'; // Хук для обработки кликов вне компонента

import styles from './Select.module.scss'; // Импортируем стили компонента Select

// Тип для пропсов компонента Select
type SelectProps = {
	selected: OptionType | null; // Текущая выбранная опция
	options: OptionType[]; // Список доступных опций
	placeholder?: string; // Текст по умолчанию, если ничего не выбрано
	onChange?: (selected: OptionType) => void; // Функция для обработки выбора опции
	onClose?: () => void; // Функция для обработки закрытия выпадающего списка
	title?: string; // Заголовок для списка
};

// Компонент для отображения выпадающего списка с опциями
export const Select = (props: SelectProps) => {
	// Деструктурируем пропсы
	const { options, placeholder, selected, onChange, onClose, title } = props;

	// Состояние для отслеживания открытия/закрытия списка
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// Ссылки на элементы для использования в хуках
	const rootRef = useRef<HTMLDivElement>(null); // Ссылка на корневой элемент селектора
	const placeholderRef = useRef<HTMLDivElement>(null); // Ссылка на placeholder для отслеживания кликов и нажатий клавиши Enter

	// Хук для закрытия списка при клике вне элемента
	useOutsideClickClose({
		isOpen,
		rootRef,
		onClose,
		onChange: setIsOpen,
	});

	// Хук для обработки нажатия клавиши Enter на placeholder
	useEnterSubmit({
		placeholderRef,
		onChange: setIsOpen,
	});

	// Обработчик выбора опции
	const handleOptionClick = (option: OptionType) => {
		setIsOpen(false); // Закрытие списка после выбора
		onChange?.(option); // Вызываем onChange с выбранной опцией
	};

	// Обработчик клика по placeholder для открытия/закрытия списка
	const handlePlaceHolderClick: MouseEventHandler<HTMLDivElement> = () => {
		setIsOpen((isOpen) => !isOpen); // Переключаем состояние открытия/закрытия списка
	};

	return (
		<div className={styles.container}>
			{title && ( // Если есть заголовок, отображаем его
				<>
					<Text size={12} weight={800} uppercase>
						{title} {/* Заголовок списка */}
					</Text>
				</>
			)}
			<div
				className={styles.selectWrapper}
				ref={rootRef} // Привязываем ссылку на корневой элемент
				data-is-active={isOpen} // Атрибут для указания состояния (открыт/закрыт)
				data-testid='selectWrapper'>
				{/* Иконка стрелочки */}
				<img
					src={arrowDown} // Источник изображения стрелочки
					alt='иконка стрелочки' // Описание изображения
					className={clsx(styles.arrow, { [styles.arrow_open]: isOpen })} // Динамическое применение классов для стрелочки
				/>
				{/* Placeholder для отображения выбранной опции или текста по умолчанию */}
				<div
					className={clsx(
						styles.placeholder, // Базовый стиль для placeholder
						styles[selected?.optionClassName || ''] // Дополнительный класс, если опция выбрана
					)}
					data-status={status} // Атрибут для статуса (например, выбран/не выбран)
					data-selected={!!selected?.value} // Атрибут, указывающий на выбранную опцию
					onClick={handlePlaceHolderClick} // Обработчик клика по placeholder
					role='button' // Указываем, что это интерактивный элемент
					tabIndex={0} // Делаем placeholder фокусируемым
					ref={placeholderRef}>
					{' '}
					{/* Ссылка на placeholder для обработки клавиши Enter */}
					<Text
						family={
							isFontFamilyClass(selected?.className)
								? selected?.className
								: undefined
						}>
						{' '}
						{/* Применение шрифта, если это валидный класс шрифта */}
						{selected?.title || placeholder}{' '}
						{/* Отображение выбранной опции или текста по умолчанию */}
					</Text>
				</div>
				{/* Если список открыт, отображаем опции */}
				{isOpen && (
					<ul className={styles.select} data-testid='selectDropdown'>
						{options
							.filter((option) => selected?.value !== option.value) // Исключаем уже выбранную опцию из списка
							.map((option) => (
								<Option
									key={option.value} // Уникальный ключ для каждой опции
									option={option} // Передаем данные опции в компонент Option
									onClick={() => handleOptionClick(option)} // Обработчик для выбора опции
								/>
							))}
					</ul>
				)}
			</div>
		</div>
	);
};
