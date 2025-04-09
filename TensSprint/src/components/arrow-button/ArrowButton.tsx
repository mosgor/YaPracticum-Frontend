import clsx from 'clsx'; // Импорт библиотеки clsx для динамического применения классов
import arrow from 'src/images/arrow.svg'; // Импорт иконки стрелочки для кнопки
import styles from './ArrowButton.module.scss'; // Импорт стилей для компонента

/** Функция для обработки открытия/закрытия формы */
type ArrowButtonProps = {
	isMenuOpen: boolean; // Флаг, который указывает, открыто ли меню
	onClick: () => void; // Функция для обработки клика (открытие/закрытие)
};

// Компонент кнопки стрелочки
export const ArrowButton = ({ isMenuOpen, onClick }: ArrowButtonProps) => {
	return (
		/* Не забываем указаывать role и aria-label атрибуты для интерактивных элементов */
		<div
			onClick={onClick} // Обработчик клика на кнопку, вызывает функцию onClick
			role='button' // Устанавливаем роль как кнопку для доступности
			aria-label='Открыть/Закрыть форму параметров статьи' // Описание действия кнопки для доступности
			tabIndex={0} // Устанавливаем tabindex, чтобы элемент был фокусируемым
			className={clsx(styles.container, {
				[styles.container_open]: isMenuOpen, // Применяется класс для открытого состояния
			})}>
			<img
				src={arrow} // Используем иконку стрелочки
				alt='иконка стрелочки' // Описание изображения для доступности
				className={clsx(styles.arrow, {
					[styles.arrow_open]: isMenuOpen, // Применяется класс для изменения состояния стрелочки
				})}
			/>
		</div>
	);
};
