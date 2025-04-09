import { useEffect } from 'react'; // Импорт хука useEffect для выполнения побочных эффектов

type TUseClose = {
	isOpen: boolean; // Состояние, указывающее, открыто ли окно
	onClose: () => void; // Функция, вызываемая при закрытии
	rootRef: React.RefObject<HTMLElement>; // Ссылка на элемент, с которым мы проверяем клик вне его
};

// Кастомный хук для закрытия модального окна или другого элемента при клике вне его
// Хуки должны начинаться с "use", чтобы React их правильно распознал
export function useClose({ isOpen, onClose, rootRef }: TUseClose) {
	useEffect(() => {
		// Если окно закрыто (isOpen === false), прекращаем выполнение хука
		if (!isOpen) return;

		// Функция обработки клика вне элемента
		function handleClickOutside(event: MouseEvent) {
			const { target } = event;
			const isOutsideClick =
				target instanceof Node && // Проверяем, что target — это DOM-элемент
				rootRef.current &&
				!rootRef.current.contains(target); // Проверяем, что клик был вне текущего элемента
			if (isOutsideClick) {
				onClose(); // Если клик был вне элемента, вызываем onClose
			}
		}

		// Функция для обработки нажатия клавиши Escape
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose(); // Если нажата клавиша Escape, закрываем окно
			}
		};

		// Добавляем обработчики для кликов и нажатий клавиш
		document.addEventListener('keydown', handleEscape);
		document.addEventListener('mousedown', handleClickOutside);

		// Функция очистки при удалении компонента или изменении зависимостей
		return () => {
			document.removeEventListener('keydown', handleEscape); // Удаляем обработчик для Escape
			document.removeEventListener('mousedown', handleClickOutside); // Удаляем обработчик для кликов
		};
		// Следим за изменениями переменных isOpen, onClose и rootRef для того, чтобы хук срабатывал при изменении состояния
	}, [isOpen, onClose, rootRef]);
}
