import { Text } from 'components/text'; // Импорт компонента для отображения текста внутри кнопки

import styles from './Button.module.scss'; // Импорт стилей для компонента Button

// Определение типа пропсов для компонента Button
export const Button = ({
	title, // Название, которое будет отображаться на кнопке
	onClick, // Функция, которая будет вызвана при клике на кнопку
	type, // Тип кнопки (например, "submit", "reset")
}: {
	title: string; // Пропс для текста кнопки
	onClick?: () => void; // Необязательный пропс для обработчика клика
	type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']; // Необязательный пропс для типа кнопки
}) => {
	return (
		<button className={styles.button} type={type} onClick={onClick}>
			{' '}
			{/* Кнопка с классом для стилизации и обработчиком клика */}
			<Text weight={800} uppercase>
				{' '}
				{/* Текст внутри кнопки с жирным шрифтом и заглавными буквами */}
				{title} {/* Отображение текста кнопки */}
			</Text>
		</button>
	);
};
