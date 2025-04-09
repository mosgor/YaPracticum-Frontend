import { useRef } from 'react'; // Импортируем хук useRef для создания ссылки на элемент
import { OptionType } from 'src/constants/articleProps'; // Импортируем тип OptionType, который используется для описания опций
import { Text } from 'components/text'; // Импортируем компонент Text для отображения текста
import { useEnterSubmit } from './hooks/useEnterSubmit'; // Импортируем хук useEnterSubmit, который будет обрабатывать нажатие клавиши Enter

import styles from './RadioGroup.module.scss'; // Импортируем стили для компонента

// Тип для пропсов компонента Option
type OptionProps = {
	value: OptionType['value']; // Значение опции (например, "large", "medium", "small")
	title: OptionType['title']; // Заголовок опции, который будет отображаться
	selected: OptionType; // Текущая выбранная опция
	groupName: string; // Имя группы, к которой принадлежит опция
	onChange?: (option: OptionType) => void; // Необязательная функция для изменения выбранной опции
	option: OptionType; // Опция, которую мы отображаем
};

// Компонент Option для отображения одной радио-кнопки
export const Option = (props: OptionProps) => {
	// Деструктуризация пропсов
	const { value, title, selected, groupName, onChange, option } = props;

	// Ссылка на элемент для отслеживания фокуса
	const optionRef = useRef<HTMLDivElement>(null);

	// Обработчик изменения выбранной опции
	const handleChange = () => onChange?.(option);

	// Хук для обработки нажатия клавиши Enter
	useEnterSubmit({ onChange, option });

	// Уникальный id для каждого элемента радио-кнопки
	const inputId = `${groupName}_radio_item_with_value__${value}`;
	// Проверка, является ли эта опция выбранной
	const isChecked = value === selected.title;

	return (
		// Контейнер для опции, с добавлением атрибутов для стилей и тестирования
		<div
			className={styles.item}
			key={value}
			data-checked={isChecked} // Устанавливаем атрибут, показывающий, выбрана ли опция
			data-testid={inputId} // Атрибут для тестирования
			tabIndex={0} // Сделать элемент фокусируемым
			ref={optionRef}>
			{/* Скрытый input для радио-кнопки */}
			<input
				className={styles.input} // Применяем стили для радио-кнопки
				type='radio' // Тип радио-кнопки
				name={groupName} // Группа радио-кнопок
				id={inputId} // Уникальный id для input
				value={value} // Значение опции
				onChange={handleChange} // Обработчик изменения состояния
				tabIndex={-1} // Убираем элемент из последовательности табуляции (чтобы только контейнер был фокусируемым)
			/>
			{/* Метка для отображения названия опции */}
			<label className={styles.label} htmlFor={inputId}>
				<Text size={18} uppercase>
					{title} {/* Название опции */}
				</Text>
			</label>
		</div>
	);
};
