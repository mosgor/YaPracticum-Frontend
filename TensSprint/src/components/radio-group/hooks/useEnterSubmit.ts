import { useEffect, useRef } from 'react'; // Импортируем хук useEffect для выполнения побочных эффектов и useRef для создания ссылки на DOM-элемент
import { OptionType } from 'src/constants/articleProps'; // Импортируем тип OptionType для параметра option

// Тип для пропсов хука useEnterSubmit
type UseEnterSubmit = {
	onChange?: (option: OptionType) => void; // Необязательная функция, которая будет вызываться при нажатии Enter
	option: OptionType; // Параметр option, который будет передан в onChange при нажатии Enter
};

// Хук для обработки нажатия клавиши Enter
export const useEnterSubmit = ({ onChange, option }: UseEnterSubmit) => {
	// Создаем ссылку на DOM-элемент
	const optionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Получаем текущий элемент, на который ссылается ref
		const optionHtml = optionRef.current;

		// Если элемент не существует, выходим из эффекта
		if (!optionHtml) return;

		// Функция, которая срабатывает при нажатии клавиши
		const handleEnterKeyDown = (event: KeyboardEvent) => {
			// Если фокус находится на элементе и нажата клавиша Enter, вызываем onChange
			if (document.activeElement === optionHtml && event.key === 'Enter') {
				onChange?.(option); // Вызов onChange с передачей option, если onChange существует
			}
		};

		// Добавляем обработчик события нажатия клавиши
		optionHtml.addEventListener('keydown', handleEnterKeyDown);

		// Очистка: удаляем обработчик события при размонтировании компонента
		return () => {
			optionHtml.removeEventListener('keydown', handleEnterKeyDown);
		};
	}, [onChange, option]); // Эффект зависит от onChange и option, чтобы реагировать на их изменения
};
