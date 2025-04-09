import { OptionType } from 'src/constants/articleProps'; // Импортируем тип OptionType, который определяет структуру опций
import { Text } from 'components/text'; // Импортируем компонент для отображения текста
import { Option } from './Option'; // Импортируем компонент Option, который отображает отдельную опцию

import styles from './RadioGroup.module.scss'; // Импортируем стили для компонента RadioGroup

// Тип для пропсов компонента RadioGroup
type RadioGroupProps = {
	name: string; // Имя группы радио-кнопок
	options: OptionType[]; // Массив опций, которые будут отображаться
	selected: OptionType; // Текущая выбранная опция
	onChange?: (value: OptionType) => void; // Функция, которая будет вызываться при изменении выбранной опции
	title: string; // Заголовок для группы радио-кнопок
};

// Компонент для отображения группы радио-кнопок
export const RadioGroup = (props: RadioGroupProps) => {
	// Деструктуризация пропсов
	const { name, options, selected, onChange, title } = props;

	// Обработчик изменения выбранной опции
	const handleChange = (option: OptionType) => onChange?.(option);

	return (
		<div className={styles.container}>
			{' '}
			{/* Контейнер для всей группы радио-кнопок */}
			{title && ( // Если передан заголовок, отображаем его
				<>
					<Text weight={800} size={12} uppercase>
						{title} {/* Заголовок группы опций */}
					</Text>
				</>
			)}
			<div className={styles.group}>
				{' '}
				{/* Контейнер для всех опций */}
				{/* Отображаем все опции, переданные через пропс options */}
				{options.map((option) => (
					<Option
						key={option.value} // Уникальный ключ для каждой опции
						groupName={name} // Имя группы, к которой принадлежит опция
						value={option.value} // Значение опции
						title={option.title} // Заголовок опции
						selected={selected} // Текущая выбранная опция
						onChange={() => handleChange(option)} // Обработчик изменения
						option={option} // Полные данные опции
					/>
				))}
			</div>
		</div>
	);
};
