import FilmCardView from '../view/film-card';
import PopupCardView from '../view/popup';
import { render, RenderPosition, replace, remove } from '../utils/render';
import { UpdateType, UserAction } from '../utils/const';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Film {
  constructor(filmContainer, changeData, filterType) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._filterType = filterType;

    this._cardComponent = null;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleCloseEscClick = this._handleCloseEscClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleAddClick = this._handleAddClick.bind(this);
  }

  init(card, comments = []) {
    this._card = card;
    this._comments = comments;

    const prevCardComponent = this._cardComponent;

    this._cardComponent = new FilmCardView(card);

    if (this._cardPopupComponent) {
      this._renderFilmPopup(this._comments);
    }


    this._cardComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevCardComponent === null) {
      render(this._filmContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._cardPopupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._cardPopupComponent.updateData({
          isDisabled: true,
          isEmojiName: null,
        });
        break;
      case State.DELETING:
        this._cardPopupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._cardComponent.shake(resetFormState);
        this._cardPopupComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._cardComponent);
    if (document.querySelector('.film-details')) {
      this._handleClosePopupClick();
    }
  }

  _renderFilmPopup(comments = []) {
    if (this._cardPopupComponent) {
      remove(this._cardPopupComponent);
    }

    document.removeEventListener('keydown', this._handleCloseEscClick);
    this._cardPopupComponent = new PopupCardView(this._card, comments);
    this._cardPopupComponent.setCloseClickHandler(this._handleClosePopupClick);
    this._cardPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._cardPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardPopupComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._cardPopupComponent.setAddClickHandler(this._handleAddClick);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._handleCloseEscClick);
    render(document.body, this._cardPopupComponent, RenderPosition.BEFOREEND);
  }

  _handleHistoryClick() {
    const currentFilterType = this._filterType === 'all' || this._filterType !== 'history';
    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          history: !this._card.userDetails.history,
        },
      });
  }

  _handleFavoriteClick() {
    const currentFilterType = this._filterType === 'all' || this._filterType !== 'favorites';
    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          favorite: !this._card.userDetails.favorite,
        },
      });
  }

  _handleWatchlistClick() {
    const currentFilterType = this._filterType === 'all' || this._filterType !== 'watchlist';
    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._card,
        userDetails: {
          ...this._card.userDetails,
          watchlist: !this._card.userDetails.watchlist,
        },
      });
  }

  _handleDeleteClick(commentId, filmId) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { commentId, filmId },
    );
  }

  _handleAddClick(card, newComment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      { card, newComment } ,
    );
  }

  _handleOpenPopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    this._renderFilmPopup();
    this._changeData(
      UserAction.LOAD_COMMENTS,
      UpdateType.PATCH,
      {
        film: this._card,
      } ,
    );
  }

  _handleClosePopupClick() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleCloseEscClick);
  }

  _handleCloseEscClick(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._handleClosePopupClick();
    }
  }
}
