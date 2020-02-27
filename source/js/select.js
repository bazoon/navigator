
function Select(id, params) {
  this.id = id;
  this.open = false;
}

Select.prototype.init = function () {
  var options = $(this.id + '_select')[0].children;

  if ($(this.id + '_select').val()) {
    $(this.id + '_value').html(options[$(this.id + '_select')[0].selectedIndex].label);
    $(this.id).addClass('valued');
  } else {
    $(this.id + '_value').html(options[0].label);
  }

  for (var i = 1; i < options.length; i++) {
    var option = options[i];
    $('<li/>', {
      click: this.listClick.bind(this, option.label, option.value),
      html: option.label
    }).appendTo(this.id + '_options');
  }

  $(this.id + '_icon').mousedown(this.iconClick.bind(this));
  $(this.id).focus(this.selectClick.bind(this));
  $(this.id).blur(this.blur.bind(this))
}

Select.prototype.iconClick = function (e) {
  if ($(this.id).hasClass('valued') && !this.open) {
    var select = $(this.id + '_select')[0].children[0]
    $(this.id).removeClass('valued');

    $(this.id + '_value').html(select.label);
    $(this.id + '_select').val(select.value);
  } else if (!this.open) {
    $(this.id).focus();
  } else {
    $(this.id).blur();
  }

  e.stopImmediatePropagation();
  e.preventDefault();
}

Select.prototype.selectClick = function (e) {
  if (this.open) {
    this.open = false;
    $(this.id).removeClass('open');
  } else {
    this.open = true;
    $(this.id).addClass('open');
  }
}

Select.prototype.listClick = function (label, value) {
  $(this.id + '_value').html(label);
  $(this.id + '_select').val(value);

  if (value != '') {
    $(this.id).addClass('valued');
  } else if ($(this.id).hasClass('valued')) {
    $(this.id).removeClass('valued');
  }

  $(this.id).blur();
}

Select.prototype.documentClick = function (e) {
  if (this.open && e.target != $(this.id + '_value')[0]) {
    this.open = false;
    $(this.id).removeClass('open');
    $(document).unbind('click', this.documentClick.bind(this));
  }
}

Select.prototype.blur = function (e) {
  if (this.open) {
    this.open = false;
    $(this.id).removeClass('open');
  }
}


$(document).ready(function () {
  for (var i = 0; i < $('.select').length; i++) {
    new Select('#' + $('.select')[i].id).init();
  }
});
