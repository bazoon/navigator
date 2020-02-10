function Page() {
  this.mainNavList = document.querySelector('.main-nav__list');
  this.mainNav = document.querySelector('.main-nav');
  this.navToggle = document.querySelector('.page-header__toggle');
}

Page.prototype.setupMenu = function () {
  this.mainNav.classList.add('main-nav--closed');
  this.mainNavList.classList.add('main-nav__list--closed');
  this.navToggle.classList.add('page-header__toggle--closed');
  this.navToggle.addEventListener("click", this.toggleMenu.bind(this));
}

Page.prototype.toggleMenu = function () {
  this.mainNav.classList.toggle('main-nav--closed');
  this.navToggle.classList.toggle('page-header__toggle--closed');
  this.mainNavList.classList.toggle('main-nav__list--closed');
}


function main() {
  var page = new Page();
  page.setupMenu();
  easydropdown.all();
}

document.addEventListener("DOMContentLoaded", main);
