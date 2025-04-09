import { useEffect } from 'react'; // Импортируем хук useEffect для выполнения побочных эффектов

// Тип для пропсов хука useOutsideClickClose
type UseOutsideClickClose = {
	isOpen: boolean; // Состояние, показывающее, открыто ли окно/компонент
	onChange: (newValue: boolean) => void; // Функция для обновления состояния (например, для закрытия)
	onClose?: () => void; // Необязательная функция для обработки закрытия
	rootRef: React.RefObject<HTMLDivElement>; // Ссылка на корневой элемент, к которому нужно прикрепить обработчик
};

// Кастомный хук для закрытия компонента при клике вне его
export const useOutsideClickClose = ({
	isOpen, // Состояние, показывающее, открыто ли окно
	rootRef, // Ссылка на корневой элемент
	onClose, // Функция, вызываемая при закрытии
	onChange, // Функция для изменения состояния (например, закрытия)
}: UseOutsideClickClose) => {
	useEffect(() => {
		// Обработчик для кликов по окну
		const handleClick = (event: MouseEvent) => {
			const { target } = event; // Получаем элемент, по которому был произведен клик
			// Если клик был не внутри rootRef, то закрываем окно
			if (target instanceof Node && !rootRef.current?.contains(target)) {
				// Если окно открыто, вызываем onClose
				isOpen && onClose?.();
				// Обновляем состояние, чтобы закрыть окно
				onChange?.(false);
			}
		};

		// Добавляем обработчик на клик по окну
		window.addEventListener('click', handleClick);

		// Функция очистки, удаляет обработчик при размонтировании компонента
		return () => {
			window.removeEventListener('click', handleClick);
		};
	}, [onClose, onChange, isOpen]); // Эффект зависит от isOpen, onChange и onClose
};
