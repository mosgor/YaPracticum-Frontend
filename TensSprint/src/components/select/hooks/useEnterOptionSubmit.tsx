import { useEffect } from 'react'; // Импортируем хук useEffect для выполнения побочных эффектов
import { OptionType } from 'src/constants/articleProps'; // Импортируем тип OptionType для значений опций

// Тип для пропсов хука useEnterOptionSubmit
type UseEnterOptionSubmit = {
	onClick: (value: OptionType['value']) => void; // Функция, которая будет вызвана при нажатии Enter
	value: OptionType['value']; // Значение текущей опции
	optionRef: React.RefObject<HTMLLIElement>; // Ссылка на элемент списка, с которым отслеживаем нажатие
};

// Кастомный хук, который вызывает onClick, когда нажата клавиша Enter на указанном элементе списка
export const useEnterOptionSubmit = ({
	onClick, // Функция для обработки клика по опции
	value, // Значение опции, которое передается при вызове onClick
	optionRef, // Ссылка на элемент, с которым будет отслеживаться нажатие Enter
}: UseEnterOptionSubmit) => {
	// Хук выполняется при изменении зависимости
	useEffect(() => {
		const option = optionRef.current; // Получаем текущий элемент, на который ссылается ref
		if (!option) return; // Если элемент не найден, выходим из хука

		// Функция, которая срабатывает при нажатии клавиши
		const handleEnterKeyDown = (event: KeyboardEvent) => {
			// Проверяем, что фокус на данном элементе и нажата клавиша Enter
			if (document.activeElement === option && event.key === 'Enter') {
				onClick(value); // Если условие выполнено, вызываем onClick с переданным значением
			}
		};

		// Добавляем обработчик события для нажатия клавиши
		option.addEventListener('keydown', handleEnterKeyDown);

		// Функция очистки при удалении компонента или изменении зависимостей
		return () => {
			option.removeEventListener('keydown', handleEnterKeyDown); // Удаляем обработчик события
		};
	}, [value, onClick, optionRef]); // Эффект зависит от значения опции, функции onClick и ref элемента
};
