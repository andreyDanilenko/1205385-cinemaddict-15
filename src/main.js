import ProfileView from './view/header-profile';
import NavView from './view/site-nav';
import FilmsView from './view/films';
import StatisticView from './view/statistics';
import FilmsPresenter from './presenter/films';
import FilmsModel from './abstract/observer';
import { cardData } from './mock/data-card';
import { generateFilter } from './utils/filters';
import { render, RenderPosition } from './utils/render';

const filters = generateFilter(cardData);

const filmsModel = new FilmsModel();
filmsModel.setFilms(cardData);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavView(filters), RenderPosition.BEFOREEND);

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);
filmsPresenter.init();
render(siteFooterStatisticsElement, new StatisticView(cardData), RenderPosition.BEFOREEND);
