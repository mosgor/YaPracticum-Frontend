import styles from './App.module.scss'; // Импорт стилей (CSS модуль), которые будут использоваться в компоненте App
import { useState, CSSProperties } from 'react'; // Импорт хука useState для управления состоянием и типа CSSProperties для инлайн-стилей
import { Article } from 'components/article'; // Импорт компонента для отображения статьи
import { ArticleParamsForm } from 'components/article-params-form'; // Импорт компонента формы для настройки параметров статьи
import {
	ArticleStateType, // Тип состояния для статьи, который будет хранить параметры
	defaultArticleState, // Значение по умолчанию для состояния статьи
} from 'src/constants/articleProps'; // Импорт констант, определяющих начальные параметры статьи

// Основной компонент приложения
export const App = () => {
	// useState для хранения состояния параметров статьи (шрифт, размер, цвет и т. д.)
	const [styleArticle, setStyleArticle] =
		useState<ArticleStateType>(defaultArticleState); // Инициализация состояния с использованием начальных значений из defaultArticleState

	return (
		// Основной элемент страницы (главный блок)
		<main
			className={styles.main} // Применение стилей из импортированного CSS-модуля
			style={
				// Инлайн-стили, которые будут изменяться в зависимости от состояния
				{
					'--font-family': styleArticle.fontFamilyOption.value, // Задает шрифт через CSS-переменную
					'--font-size': styleArticle.fontSizeOption.value, // Задает размер шрифта через CSS-переменную
					'--font-color': styleArticle.fontColor.value, // Задает цвет шрифта через CSS-переменную
					'--container-width': styleArticle.contentWidth.value, // Задает ширину контейнера через CSS-переменную
					'--bg-color': styleArticle.backgroundColor.value, // Задает цвет фона через CSS-переменную
				} as CSSProperties // Преобразуем объект в тип CSSProperties, чтобы TypeScript знал, что это валидные CSS-стили
			}>
			<ArticleParamsForm onChange={setStyleArticle} />
			<Article />
		</main>
	);
};
