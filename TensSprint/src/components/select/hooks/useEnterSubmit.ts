import { useEffect } from 'react'; // Импортируем хук useEffect для выполнения побочных эффектов

// Тип для пропсов хука useEnterSubmit
type UseEnterSubmit = {
	onChange: React.Dispatch<React.SetStateAction<boolean>>; // Функция для обновления состояния (например, открытия/закрытия списка)
	placeholderRef: React.RefObject<HTMLDivElement>; // Ссылка на элемент, для которого отслеживаем нажатие клавиши Enter
};

// Кастомный хук для обработки нажатия клавиши Enter
export const useEnterSubmit = ({
	placeholderRef, // Ссылка на placeholder, на который будет добавлен обработчик
	onChange, // Функция, которая будет вызвана при нажатии Enter
}: UseEnterSubmit) => {
	// useEffect выполняется один раз при монтировании компонента, так как массив зависимостей пуст
	useEffect(() => {
		// Получаем текущий элемент, на который ссылается placeholderRef
		const placeholderEl = placeholderRef.current;
		if (!placeholderEl) return; // Если элемент не найден, прекращаем выполнение

		// Обработчик нажатия клавиши Enter
		const handleEnterKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				// Переключаем состояние на противоположное (например, открываем/закрываем список)
				onChange((isOpen: boolean) => !isOpen);
			}
		};

		// Добавляем обработчик нажатия клавиши
		placeholderEl.addEventListener('keydown', handleEnterKeyDown);

		// Очистка: удаляем обработчик при размонтировании компонента или изменении ссылки
		return () => {
			placeholderEl.removeEventListener('keydown', handleEnterKeyDown);
		};
	}, []); // Пустой массив зависимостей означает, что эффект сработает только один раз при монтировании компонента
};
