import { useState, useRef, SyntheticEvent } from 'react'; // Импорт хуков из React: useState для состояния, useRef для ссылок на элементы и SyntheticEvent для типов событий
import { ArrowButton } from 'components/arrow-button'; // Импорт компонента кнопки со стрелочкой
import { Button } from 'components/button'; // Импорт компонента кнопки
import { Spacing } from 'components/spacing'; // Импорт компонента для добавления отступов
import { RadioGroup } from 'components/radio-group'; // Импорт компонента радио-кнопок
import { Separator } from 'components/separator'; // Импорт компонента разделителя
import { Select } from 'components/select'; // Импорт компонента выпадающего списка
import { Text } from 'components/text'; // Импорт компонента для отображения текста
import { useClose } from 'components/hooks/useClose'; // Импорт хука для закрытия меню

import {
	fontFamilyOptions, // Опции для выбора шрифта
	fontSizeOptions, // Опции для выбора размера шрифта
	fontColors, // Опции для выбора цвета шрифта
	backgroundColors, // Опции для выбора цвета фона
	contentWidthArr, // Опции для выбора ширины контента
	OptionType, // Тип для параметров опций
	ArticleStateType, // Тип для состояния параметров статьи
	defaultArticleState, // Значение по умолчанию для параметров статьи
} from 'src/constants/articleProps'; // Импорт констант с возможными значениями для параметров

import clsx from 'clsx'; // Импорт библиотеки clsx для динамического добавления классов

import styles from './ArticleParamsForm.module.scss'; // Импорт стилей компонента

export type ArticleParamsFormProps = {
	onChange: React.Dispatch<React.SetStateAction<ArticleStateType>>; // Пропс, который позволяет передавать изменения состояния параметров статьи
};

export const ArticleParamsForm = ({ onChange }: ArticleParamsFormProps) => {
	// Рефы для хранения состояния формы и ссылки на aside элемент
	const defaultStateForm = useRef<ArticleStateType>(defaultArticleState);
	const asideRef = useRef<HTMLDivElement | null>(null);

	// Локальное состояние для отслеживания, открыто ли меню
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	// Состояния для каждого параметра статьи
	const [fontFamily, setfontFamily] = useState<OptionType>(
		defaultStateForm.current.fontFamilyOption
	);
	const [fontSize, setfontSize] = useState<OptionType>(
		defaultStateForm.current.fontSizeOption
	);
	const [backgroundColor, setBackgroundColor] = useState<OptionType>(
		defaultStateForm.current.backgroundColor
	);
	const [fontColor, setFontColor] = useState<OptionType>(
		defaultStateForm.current.fontColor
	);
	const [contentWidth, setContentWidth] = useState<OptionType>(
		defaultStateForm.current.contentWidth
	);

	// Хук для закрытия меню при клике вне его области
	useClose({
		isOpen: isMenuOpen,
		onClose: () => setIsMenuOpen(false),
		rootRef: asideRef,
	});

	// Функция для переключения состояния меню
	const toggleStateMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	// Функции для изменения параметров статьи
	const changefontFamily = (option: OptionType) => {
		setfontFamily(option);
	};
	const changeFontSize = (option: OptionType) => {
		setfontSize(option);
	};
	const changeBackgroundColor = (option: OptionType) => {
		setBackgroundColor(option);
	};
	const changeFontColor = (option: OptionType) => {
		setFontColor(option);
	};
	const changeContentWidth = (option: OptionType) => {
		setContentWidth(option);
	};

	// Функция для обработки отправки формы
	const handleOnSubmitForm = (e: SyntheticEvent) => {
		e.preventDefault(); // Отменяет стандартное поведение формы
		onChange({
			fontFamilyOption: fontFamily,
			fontColor: fontColor,
			backgroundColor: backgroundColor,
			contentWidth: contentWidth,
			fontSizeOption: fontSize,
		}); // Отправка новых значений в родительский компонент
	};

	// Функция для сброса параметров к значениям по умолчанию
	const handleOnClickButtonReset = () => {
		onChange(defaultStateForm.current);

		setfontFamily(defaultStateForm.current.fontFamilyOption);
		setfontSize(defaultStateForm.current.fontSizeOption);
		setBackgroundColor(defaultStateForm.current.backgroundColor);
		setFontColor(defaultStateForm.current.fontColor);
		setContentWidth(defaultStateForm.current.contentWidth);
	};

	return (
		<div ref={asideRef}>
			<ArrowButton onClick={toggleStateMenu} isMenuOpen={isMenuOpen} />{' '}
			{/* Кнопка для открытия/закрытия меню */}
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen, // Если меню открыто, применяем класс для отображения
				})}>
				<form className={styles.form} onSubmit={handleOnSubmitForm}>
					{' '}
					{/* Форма для изменения параметров статьи */}
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры {/* Заголовок формы */}
					</Text>
					<Spacing size={50} />
					<Select
						options={fontFamilyOptions} // Список доступных шрифтов
						selected={fontFamily} // Текущий выбранный шрифт
						onChange={changefontFamily} // Обработчик изменения шрифта
						title='шрифт' // Заголовок для поля
					/>
					<Spacing size={50} />
					<RadioGroup
						name='font-size'
						options={fontSizeOptions} // Список доступных размеров шрифта
						selected={fontSize} // Текущий выбранный размер
						onChange={changeFontSize} // Обработчик изменения размера шрифта
						title='размер шрифта' // Заголовок для поля
					/>
					<Spacing size={50} />
					<Select
						options={fontColors} // Список доступных цветов шрифта
						selected={fontColor} // Текущий выбранный цвет шрифта
						onChange={changeFontColor} // Обработчик изменения цвета шрифта
						title='цвет шрифта' // Заголовок для поля
					/>
					<Spacing size={50} />
					<Separator /> {/* Разделитель между секциями */}
					<Spacing size={50} />
					<Select
						options={backgroundColors} // Список доступных цветов фона
						selected={backgroundColor} // Текущий выбранный цвет фона
						onChange={changeBackgroundColor} // Обработчик изменения цвета фона
						title='цвет фона' // Заголовок для поля
					/>
					<Spacing size={50} />
					<Select
						options={contentWidthArr} // Список доступных ширин контента
						selected={contentWidth} // Текущая выбранная ширина
						onChange={changeContentWidth} // Обработчик изменения ширины контента
						title='ширина контента' // Заголовок для поля
					/>
					<Spacing size={207} />
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить' // Кнопка для сброса изменений
							type='reset'
							onClick={handleOnClickButtonReset} // Сброс значений на начальные
						/>
						<Button title='Применить' type='submit' />{' '}
						{/* Кнопка для применения изменений */}
					</div>
				</form>
			</aside>
		</div>
	);
};
