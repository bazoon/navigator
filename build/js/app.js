function Page() {
  this.mainNavList = document.querySelector('.main-nav__list');
  this.mainNav = document.querySelector('.main-nav');
  this.navToggle = document.querySelector('.page-header__toggle');
  this.navClose = document.querySelector('.mobile-header__toggle');
  this.pageHeaderWrap = document.querySelector('.page-header__main-wrap');
  this.mobileHeader = document.querySelector('.mobile-header');
  this.citySelectToggle = document.querySelector('.sub-nav__item--choose');
  this.citySelectCover = document.querySelector('.city-select__cover');
  this.citySelectWrap = document.querySelector('.city-select__wrap');
  this.citySelectPin = document.querySelector('.sub-nav__pin');
  this.cityInput = document.querySelector('.city-select-search');
  this.cityList = document.querySelector('.city-select__list');
  this.citySelectButton = document.querySelector('.city-select__button');
  this.body = document.querySelector('body');
  this.userMenuToggle = document.querySelector('.sub-nav__item--user');
  this.userAvatar = document.querySelector('.sub-nav__item--user-avatar');
  this.userMenu = document.querySelector('.sub-nav__user-menu');
  this.userCarret = document.querySelector('.sub-nav__item--user-carret');
  this.citySelectClear = document.querySelector('.city-select__cross');
}

Page.prototype.setupMenu = function () {
  this.mainNav.classList.add('main-nav--closed');
  this.mainNavList.classList.add('main-nav__list--closed');
  this.navToggle.classList.add('page-header__toggle--closed');
  this.navToggle.addEventListener("click", this.toggleMenu.bind(this));
  this.navClose.addEventListener("click", this.toggleMenu.bind(this));
}

Page.prototype.toggleMenu = function () {
  this.mainNav.classList.toggle('main-nav--closed');
  this.navToggle.classList.toggle('page-header__toggle--closed');
  this.mainNavList.classList.toggle('main-nav__list--closed');
  this.pageHeaderWrap.classList.toggle('page-header__main-wrap--open');
  this.mobileHeader.classList.toggle('mobile-header--open');
}

Page.prototype.handleSubmitCity = function () {
  if (this.cityInput.value) {
    this.citySelectToggle.innerText = this.cityInput.value;
    this.closeCitySelect();
  }
}

Page.prototype.setupCitySelect = function () {
  this.citySelectToggle.addEventListener("click", this.toggleCitySelect.bind(this));
  this.citySelectPin.addEventListener("click", this.toggleCitySelect.bind(this));
  this.cityInput.addEventListener("keyup", this.handleCityChange.bind(this));
  this.cityList.addEventListener("click", this.handleSelectCity.bind(this));
  this.citySelectButton.addEventListener("click", this.handleSubmitCity.bind(this));
  this.citySelectButton.addEventListener("keydown", this.handleCityBlur.bind(this));
  this.citySelectClear.addEventListener("click", this.handleClearCitySelect.bind(this));
}

Page.prototype.handleClearCitySelect = function () {
  this.cityInput.value = '';
};

Page.prototype.handleCityBlur = function (e) {
  this.cityInput.focus();
  e.preventDefault();
}

Page.prototype.handleSelectCity = function (e) {
  if (e.target.tagName === 'LI') {
    this.cityInput.value = e.target.innerText;
    this.hideCityList();
  }
}

Page.prototype.searchCity = function (city) {
  if (city.length < 1) {
    return Promise.resolve([]);
  }

  return fetch("/js/cities.json").then(response => response.json().then(data => {
    return data.filter(c => {
      return c.city.indexOf(city) > -1;
    });
  }));
}

Page.prototype.showCityList = function () {
  this.cityList.classList.remove("city-select__list-hidden");
}

Page.prototype.hideCityList = function () {
  this.cityList.classList.add("city-select__list-hidden");
}

Page.prototype.handleCityChange = function () {
  this.showCityList();
  var citiesTemplate = '';
  this.searchCity(this.cityInput.value).then(cities => {
    cities.forEach(c => {
      citiesTemplate += '<li tabindex="3" class="city-select__item">' + c.city + '</li>';
    });
    this.cityList.innerHTML = citiesTemplate;
  });
}

Page.prototype.closeCitySelect = function () {
  this.citySelectCover.classList.add("city-select__cover-hidden");
}

Page.prototype.toggleCitySelect = function () {
  var me = this;
  this.citySelectCover.classList.toggle("city-select__cover-hidden");
  this.body.addEventListener("click", closeCitySelect);


  function shouldClose(cls) {
    var citySelectClasses = ['city-select__cover'];
    return citySelectClasses.indexOf(cls) > 0;
  }

  function closeCitySelect(e) {
    var target = e.target;
    var current = target;

    if (target.className === 'city-select__cover') {
      me.closeCitySelect();
      me.body.removeEventListener("click", closeCitySelect);
    }
  }

}

Page.prototype.setupUserMenu = function () {
  this.userMenuToggle.addEventListener("click", this.showUserMenu.bind(this));
  this.userAvatar.addEventListener("click", this.showUserMenu.bind(this));
}

Page.prototype.showUserMenu = function () {
  var me = this;
  this.userMenu.classList.remove("sub-nav__user-menu-hidden");
  this.body.addEventListener("click", closeUserMenu);
  this.userCarret.classList.remove('sub-nav__item--user-carret-up');

  function closeUserMenu(e) {
    if (e.target.classList.contains('sub-nav__item--user') || e.target.classList.contains('sub-nav__item--user-avatar')) {
      return;
    }
    me.hideUserMenu();
    me.body.removeEventListener("click", closeUserMenu);
  }
}

Page.prototype.hideUserMenu = function () {
  this.userMenu.classList.add("sub-nav__user-menu-hidden");
  this.userCarret.classList.add('sub-nav__item--user-carret-up');
}

function main() {
  var page = new Page();
  page.setupMenu();
  page.setupCitySelect();
  page.setupUserMenu();
}

document.addEventListener("DOMContentLoaded", main);
